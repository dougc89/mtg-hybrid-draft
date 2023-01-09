import credentials, mongo, pprint, local_db, json, argparse
from bson.objectid import ObjectId

try:
    parser = argparse.ArgumentParser(description="Drafts by set.")
    parser.add_argument('-s', '--set', help="set symbol")
    args = parser.parse_args()
    db = local_db.database('hybrid-draft')
    drafts = db.collections['drafts']

    if args.set:
        items = drafts.find({'set':args.set})
    else:
        items = drafts.find({})

    print(json.dumps(items))

except Exception as err:
    print(json.dumps({'error': f"{err}"}))
finally:
    exit()
    db.connection.close()
