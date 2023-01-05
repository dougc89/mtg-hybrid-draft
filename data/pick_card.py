import json, argparse, hashlib, datetime, local_db
from bson.objectid import ObjectId
from pprint import pprint


parser = argparse.ArgumentParser(description="Pick a card from the pack.")
parser.add_argument('-p', '--pack', help="draft id to add the pack to", required=True)
parser.add_argument('-u', '--user', help="user id that is picking the card", required=True)
parser.add_argument('-c', '--card', help="multiverse_id of the card to choose", required=True)
args = parser.parse_args()

try:
    db = local_db.database('hybrid-draft')
    packs = db.collections['packs']

    user = args.user
    pack_id = args.pack_id

    

    inserted = packs.insert_one(new_pack)

    # output the inserted pack
    pprint(inserted)

except Exception as err:
    print({'error': err})

finally:
    exit()