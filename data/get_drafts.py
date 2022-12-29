import credentials, mongo, pprint
from bson.objectid import ObjectId

db = mongo.database('hybrid-draft')
drafts = db.database['drafts']

items = drafts.find({'set':'BRO'})

for item in items:
    pprint.pprint(item)