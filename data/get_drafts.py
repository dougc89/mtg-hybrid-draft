import credentials, mongo, pprint, local_db
from bson.objectid import ObjectId

try:
    db = local_db.database('hybrid-draft')
    drafts = db.collections['drafts']

    items = drafts.find({'type':'prayer'})

    for item in items:
        pprint.pprint(item)

except Exception as err:
    print(err)
finally:
    exit()
    db.connection.close()
