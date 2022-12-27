import credentials, mongo, pprint
from pymongo import ObjectId

db = mongo.database('hybrid-draft')
drafts = db.database['drafts']

items = drafts.find({'set':'BRO'})

for item in items:
    pprint.pprint(item)