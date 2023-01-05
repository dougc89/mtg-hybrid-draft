import json, argparse, hashlib, datetime, local_db
from bson.objectid import ObjectId
from pprint import pprint


parser = argparse.ArgumentParser(description="Crack a new pack and add it to the draft.")
parser.add_argument('-d', '--draft', help="draft id to add the pack to", required=True)
parser.add_argument('-u', '--user', help="user id that is adding the pack", required=True)
parser.add_argument('-c', '--cards', help="multiverse_ids in a json-encoded list", required=True)
args = parser.parse_args()

try:
    db = local_db.database('hybrid-draft')
    packs = db.collections['packs']

    user = args.user
    draft_id = args.draft
    new_pack = {
        'draft_id': draft_id,
        'opened_by': user,
        'assigned_to': user,
        'cards': json.loads(args.cards)
    }

    inserted = packs.insert_one(new_pack)

    # output the inserted pack
    pprint(inserted)

except Exception as err:
    print({'error': err})

finally:
    exit()