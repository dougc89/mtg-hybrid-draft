import json, argparse, hashlib, datetime, local_db
from bson.objectid import ObjectId
from operator import itemgetter
from pprint import pprint

parser = argparse.ArgumentParser(description="Get a list of all the cards owned by a player in the draft.")
parser.add_argument('-d', '--draft', help="draft id to add the pack to", required=True)
parser.add_argument('-u', '--user', help="user id of the player", required=True)
args = parser.parse_args()

try:
    db = local_db.database('hybrid-draft')
    # drafts = db.collections['drafts']
    packs = db.collections['packs']

    user = args.user
    draft_id = args.draft

    # look up the packs assigned to this player in this draft
    draft_packs = packs.find({'draft_id': draft_id, 'assigned_to': user})
    print("{} packs found.".format(len(draft_packs)))

    # order the packs by the number of cards remaining, desc.
    pprint(sorted(draft_packs, key=itemgetter('cards_remaining'), reverse = True))

except Exception as err:
    print({'error': err})

finally:
    exit()