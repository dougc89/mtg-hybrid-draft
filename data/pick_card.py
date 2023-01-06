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
    drafts = db.collections['drafts']
    packs = db.collections['packs']

    user = args.user
    pack_id = args.pack_id

    # look up the ordered list of players in the draft, to know who gets the pack next

    # look up the pack in question

    # assign the card (only one, in the chance of double-copies in one pack) in question to the player who is picking it

    # reduce the cards remaining count on the pack

    # assign the pack to the next person in line, using the odd/even state of pack's round for next/previous

    # output the updated pack

except Exception as err:
    print({'error': err})

finally:
    exit()