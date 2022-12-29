import credentials, mongo, pymongo, argparse
from bson.objectid import ObjectId
from pprint import pprint

parser = argparse.ArgumentParser(description="Add a player to the draft.")
parser.add_argument('-d', '--draft', help="_id for the target draft")
parser.add_argument('-s', '--set', help="set for the target draft")
parser.add_argument('-i', '--id', help="_id for the player")
parser.add_argument('-n', '--name', help="display name for the player", required = True)
args = parser.parse_args()

db = mongo.database('hybrid-draft')

# drafts collection
drafts = db.database['drafts']

draft_id = None
if 'draft' in args:
    draft_id = args.draft
elif 'set' in args:
    items = drafts.find({'set':args.set})
    pprint(items)
    for item in items:
        # found the draft id
        pprint(item)
        draft_id = item.get('_id')
        break

else:
    print('provide draft _id or set code to find the target draft.')
    exit()

if not draft_id:
    print('draft _id not found from set code.')
    exit() 

new_player = {
    'name': args.name
}

# set the option _id
if 'id' in args:
    new_player['_id'] = args.id

added_player = drafts.update_one({'_id': ObjectId(draft_id)},
{
    '$push': {
        'players': new_player
    }
})

print(added_player)