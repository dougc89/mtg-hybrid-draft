import json, argparse, hashlib, datetime, local_db, util
from bson.objectid import ObjectId
from operator import itemgetter
from pprint import pprint

try:
    logger = util.create_logger("Hybrid Draft Log", "c:\\github\\mtg-hybrid-draft\\data\\hybrid-draft.log", level = "DEBUG")
    parser = argparse.ArgumentParser(description="Get a list of all the cards owned by a player in the draft.")
    parser.add_argument('-d', '--draft', help="draft id to add the pack to", required=True)
    parser.add_argument('-u', '--user', help="user id of the player", required=True)
    args = parser.parse_args()


    # raise Exception('test')
    db = local_db.database('hybrid-draft')
    # drafts = db.collections['drafts']
    packs = db.collections['packs']

    user = args.user
    draft_id = args.draft

    # look up the packs assigned to this player in this draft
    draft_packs = packs.find({'draft_id': draft_id, 'assigned_to': user})
    logger.debug(json.dumps({'draft_id': draft_id, 'assigned_to': user}))
    # print("{} packs found.".format(len(draft_packs)))

    # order the packs by the number of cards remaining, desc.
    results = sorted(draft_packs, key=itemgetter('cards_remaining'), reverse = True)
    logger.debug(json.dumps(results))
    print(json.dumps(results))

except Exception as err:
    logger.debug(err)
    print(json.dumps({"error": f"{err}"}))

finally:
    exit()