import argparse, mongo
from bson.objectid import ObjectId
from pprint import pprint

try:
    parser = argparse.ArgumentParser(description="Start a new draft.")
    parser.add_argument('-s', '--set', help="set for the target draft", required=True)
    parser.add_argument('-p', '--packs', help="number of packs", required=True)
    args = parser.parse_args()

    db = mongo.database('hybrid-draft')

    new_draft = {
        '_id': ObjectId(),
        'set': args.set,
        'num_packs': args.packs,
        'players':[],
        'packs': []
    }

    drafts = db.collections['drafts']

    drafts.insert_one(new_draft)

finally:
    db.connection.close()