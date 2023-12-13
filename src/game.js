import Trianglify from "trianglify";
import {VIEWPORT_HEIGHT, VIEWPORT_WIDTH} from "./index";
import {Wall, WallHighlights} from "./wall";
import {Players} from "./player";
import * as PIXI from "pixi.js";

export default class Game {
  constructor(pixiApp, totalWallScale) {
    this.pixiApp = pixiApp;
    this.isOver = false;
    this.hasGameEndMessageShown = false;

    this.boardHeight = totalWallScale * VIEWPORT_HEIGHT;
    this.yPos = -this.boardHeight + VIEWPORT_HEIGHT; // Scroll from bottom to top
    this.yPosDelta = 1;
    this.DELTA_MULTIPLIER = 1.003;

    this.animationId;
    this.prevTimeStamp = 0;
    this.frameRate = 1000 / 30;

    this.holdInput = "";
    this.wordsTyped = 0;

    this.createBackground();
    this.createPlayers();

    // Rendering containers
    this.players;
    this.wall;
    this.wallHighlights;
    this.instructions;
  }

  // Game Setup
  createBackground() {
    let canvas = document.createElement("canvas");
    let webgl = canvas.getContext("webgl");
    let bgHeight = Math.min(webgl.MAX_TEXTURE_SIZE, this.boardHeight);

    const pattern = Trianglify({
      width: VIEWPORT_WIDTH,
      height: bgHeight,
      cellSize: 72,
      xColors: "random"
    });

    const texture = PIXI.Texture.from(pattern.toCanvas());
    const sprite = PIXI.Sprite.from(texture);
    sprite.scale.y = this.boardHeight / bgHeight;

    const bgContainer = new PIXI.Container();
    bgContainer.addChild(sprite);
    this.setupChildContainer(bgContainer);
  }

  createPlayers() {
    this.players = new Players(this.boardHeight);
    this.setupChildContainer(this.players);
  }

  createWall(wallData) {
    this.wall = new Wall(wallData);
    this.setupChildContainer(this.wall);

    this.wallHighlights = new WallHighlights(wallData);
    this.setupChildContainer(this.wallHighlights);

    this.animationId = requestAnimationFrame(this.animateScroll.bind(this));
  }

  animateScroll(timestamp) {
    if (this.isOver) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (timestamp - this.prevTimeStamp > this.frameRate) {
      this.prevTimeStamp = timestamp;

      this.yPos += this.yPosDelta;
      this.yPosDelta *= this.DELTA_MULTIPLIER;
      this.pixiApp.stage.children.forEach((child) => (child.y = this.yPos));
    }

    this.animationId = requestAnimationFrame(this.animateScroll.bind(this));
  }

  setupChildContainer(container) {
    container.y = this.yPos;
    this.pixiApp.stage.addChild(container);
  }

  // Game Update
  updatePlayers(newPlayers, socket) {
    if (this.isOver) return;
    this.players.updatePlayers(newPlayers, socket);
  }

  // Start game at the bottom of the wall and scroll up
  checkYPos(socket) {
    if (this.isOver) return;

    if (this.yPos >= -10) {
      socket.emit("wall complete");
    }
  }

  checkPlayerStatus(socket) {
    if (this.isOver) return;

    let player = this.players.children.find((c) => c.id === socket.id);

    if (player.isAlive) {
      if (player.topPawY && player.topPawY > -this.yPos + VIEWPORT_HEIGHT) {
        socket.emit("player lost");
        if (!this.hasGameEndMessageShown) {
          this.hasGameEndMessageShown = true;

          this.createTextSprite(
            `Words typed: ${this.wordsTyped}\nWall climbed: ${Math.floor(
              100 - (player.topPawY / this.boardHeight) * 100
            )}%`
          );
        }
      }
    }
  }

  handleKeydown(event, socket) {
    if (this.isOver) return;
    let player = this.players.children.find((c) => c.id === socket.id);

    if (player.isAlive) {
      if (event.keyCode === 13 || event.keyCode === 27 || event.keyCode === 32) {
        // enter, space, escape
        this.holdInput = "";
      } else if (event.keyCode === 8) {
        // backspace
        if (this.holdInput.length > 0) {
          this.holdInput = this.holdInput.slice(0, -1);
        }
      } else if (event.key.length === 1) {
        this.holdInput += event.key;
        if (this.wall.holds[this.holdInput]) {
          socket.emit("move paw", this.holdInput);
          this.wordsTyped++;
          this.holdInput = "";
        }
      }
      this.wallHighlights.createHighlights(this.holdInput);
    }
  }

  // Game End
  gameOver(playerId, players) {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (players[playerId].isAlive) {
      console.log("Holy cow you did it!");

      if (!this.hasGameEndMessageShown) {
        this.hasGameEndMessageShown = true;
        this.createTextSprite(`Holy cow!\nYou climbed the whole wall!`);
      }
    } else {
      console.log("The game has ended!");
    }

    let playersRanking = [];
    Object.keys(players).forEach((id) => {
      let player = Object.assign(players[id], {id: id});
      playersRanking.push(player);
    });

    playersRanking = playersRanking
      .sort((p1, p2) => p1.body.y - p2.body.y)
      .map((player, idx) => {
        return `Rank${idx + 1}: ${player.id === playerId ? "YOU" : "NOT YOU"}`;
      });

    console.log(playersRanking);
  }

  createTextSprite(spriteText) {
    let text = new PIXI.Text(spriteText, {
      fontFamily: "Arial",
      fontSize: 72,
      fill: "black",
      align: "center",
      stroke: "white",
      strokeThickness: 2
    });
    text.anchor.set(0.5, 0.5);
    text.x = VIEWPORT_WIDTH / 2;
    text.y = -this.yPos + VIEWPORT_HEIGHT / 2;

    this.wall.addChild(text);
  }
}
