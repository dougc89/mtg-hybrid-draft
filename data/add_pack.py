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
    drafts = db.collections['drafts']
    packs = db.collections['packs']

    user = args.user
    draft_id = args.draft

    # look up the draft info to check the max number of packs for this draft
    draft = drafts.find({'_id': draft_id})

    # error out if no draft by this id
    if len(draft) < 1:
        raise Exception("draft_id {} not found".format(draft_id))

    max_packs = int(draft[0].get('num_packs'))
    
    # look up other packs this player has opened for this draft
    packs_opened_by_user = packs.find({'draft_id': draft_id, 'opened_by': user})

    # they are only allowed to add a new one if the max has not been reached
    if not len(packs_opened_by_user) < max_packs:
        raise Exception("Max packs of {} already reached. Cannot add a new one to this draft for this player.".format(max_packs))

    card_list = json.loads(args.cards)

    # if len(card_list) != 15:
    #     raise Exception('There needs to be exactly 15 cards in the pack')

    new_pack = {
        'draft_id': draft_id,
        'opened_by': user,
        'round': len(packs_opened_by_user) + 1,
        'cards_remaining': len(card_list),
        'assigned_to': user,
        'cards': list(map(lambda x: {'multiverse_id': x, 'owned_by': None}, card_list))
    }

    inserted = packs.insert_one(new_pack)

    # output the inserted pack
    pprint(inserted)

except Exception as err:
    print({'error': err})

finally:
    exit()