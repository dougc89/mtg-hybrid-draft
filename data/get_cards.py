import json, argparse, hashlib, datetime, local_db
from bson.objectid import ObjectId
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

    # look up the packs assigned to this draft
    draft_packs = packs.find({'draft_id': draft_id})

    # list the multiverse_id's of cards owned by this player
    player_cards = []
    for pack in draft_packs:
        for card in pack.get('cards', []):
            if card.get('owned_by') == user:
                player_cards.append(card.get('multiverse_id'))


    # output the inserted pack
    print(json.dumps(player_cards))

except Exception as err:
    print(json.dumps({'error': err}))

finally:
    exit()