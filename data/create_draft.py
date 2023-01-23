import argparse, local_db
from bson.objectid import ObjectId
from pprint import pprint

try:
    parser = argparse.ArgumentParser(description="Start a new draft.")
    parser.add_argument('-s', '--set', help="set for the target draft", required=True)
    parser.add_argument('-p', '--packs', help="number of packs", required=True)
    parser.add_argument('-t', '--type', help="proxy or paper?", required=True)
    args = parser.parse_args()

    db = local_db.database('hybrid-draft')

    draft_type = args.type
    while draft_type not in ['proxy', 'paper']:
        draft_type = input('Which draft type is this going to be? [paper/proxy] ')

    # _id = str(ObjectId())
    new_draft = {
        # '_id': _id,
        'set': args.set,
        'type': draft_type,
        'num_packs': args.packs,
        'players':[]
    }

    drafts = db.collections['drafts']
    
    # drafts.find({'_id': '5'})

    pprint(drafts.insert_one(new_draft))

except Exception as err:
    print(err)
finally:
    exit()
    db.connection.close()