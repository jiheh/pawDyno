from nltk.corpus import words
import random
import json

all_words = words.words()

small_words = list(set([x.lower() for x in all_words if len(x) in [3,4,5]]))
random.shuffle(small_words)

with open('small_words.json','w') as f:
    json.dump(small_words, f)
