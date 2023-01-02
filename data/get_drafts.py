import credentials, mongo, pprint
from bson.objectid import ObjectId

try:
    db = mongo.database('hybrid-draft')
    drafts = db.collections['drafts']

    items = drafts.find({'set':'BRO'})

    for item in items:
        pprint.pprint(item)

finally:
    db.connection.close()
