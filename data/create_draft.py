import argparse, local_db
from bson.objectid import ObjectId
from pprint import pprint

parser = argparse.ArgumentParser(description="Add a player to the draft.")
parser.add_argument('-s', '--set', help="set for the target draft", required=True)
parser.add_argument('-p', '--packs', help="number of packs", required=True)
args = parser.parse_args()

drafts = local_db.database('drafts')

new_draft = {
    '_id': ObjectId(),
    'set': args.set,
    'num_packs': args.packs,
    'players':[],
    'packs': []
}

drafts.insert_one(new_draft)