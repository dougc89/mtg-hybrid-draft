import json, argparse, hashlib, datetime, local_db, util
from bson.objectid import ObjectId
from pprint import pprint

logger = util.create_logger("Hybrid Draft Log: Card Picker", "c:\\github\\mtg-hybrid-draft\\data\\hybrid-draft.log", level = "DEBUG")
    
parser = argparse.ArgumentParser(description="Pick a card from the pack.")
parser.add_argument('-p', '--pack', help="draft id to add the pack to", required=True)
parser.add_argument('-u', '--user', help="user id that is picking the card", required=True)
parser.add_argument('-c', '--card', help="multiverse_id of the card to choose", required=True)
args = parser.parse_args()

try:
    logger.debug(json.dumps({'card':args.card, 'pack':args.pack, 'player': args.user}))
    db = local_db.database('hybrid-draft')
    drafts = db.collections['drafts']
    packs = db.collections['packs']

    user = args.user
    pack_id = args.pack

    # look up the pack in question
    pack = packs.find({'_id': pack_id})
    if len(pack) < 1:
        raise Exception('pack not found')
    else:
        # pick the first pack in the list
        pack = pack[0]

    # assign the card (only one, in the chance of double-copies in one pack) in question to the player who is picking it
    card_found = False
    for card in pack.get('cards'):
        if str(card.get('multiverse_id')) == str(args.card) and not card.get('owned_by'):
            card_found = True
            card['owned_by'] = user
            break

    if not card_found:
        raise Exception("An available card with _id {} not found in pack.".format(args.card))

    # reduce the cards remaining count on the pack
    pack['cards_remaining'] = int(pack['cards_remaining']) - 1

    if pack['cards_remaining'] == 0:
        # unset assigned to if all the cards in the pack have been picked
        pack['assigned_to'] = None
    else:
        # look up the ordered list of players in the draft, to know who gets the pack next
        draft = drafts.find({'_id': pack.get('draft_id')})[0]
        if draft.get('type') == 'solo':
            # no one picks this pack again after a selection has been made
            pack['assigned_to'] = None
        else:
            # find the player making the selection in the list of draft players, for their order
            index = 0
            for player in draft.get('players'):
                if player.get('_id') == user:
                    break
                # increment
                index += 1
            
            # if we did not ever find the user in players, index will be out of range
            if index > len(draft.get('players')) - 1:
                raise Exception("{} not found in draft players".format(user))

            # assign the pack to the next person in line, using the odd/even state of pack's round for next/previous
            if int(pack.get('round')) % 2 == 0:
                # even, so assign to previous player
                assigned_index = index - 1
                # go around the horn if we went outside range
                if assigned_index < 0:
                    assigned_index = len(draft.get('players')) - 1
            else:
                # odd, so assign to next player
                assigned_index = index + 1
                if assigned_index > len(draft.get('players')) - 1:
                    # set to the first player, since we went outside range
                    assigned_index = 0

            pack['assigned_to'] = draft.get('players')[assigned_index].get('_id')

    # update the pack, and output the updated pack
    packs.update({'_id': pack_id}, pack)

    pprint(pack)

except Exception as err:
    print({'error': err})

finally:
    exit()