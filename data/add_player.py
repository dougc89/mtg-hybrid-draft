import credentials, mongo, pymongo, argparse, local_db
from bson.objectid import ObjectId
from pprint import pprint

parser = argparse.ArgumentParser(description="Add a player to the draft.")
parser.add_argument('-d', '--draft', help="_id for the target draft")
parser.add_argument('-s', '--set', help="set for the target draft")
parser.add_argument('-i', '--id', help="_id for the player")
parser.add_argument('-n', '--name', help="display name for the player", required = True)
args = parser.parse_args()

try:
    db = local_db.database('hybrid-draft')

    # drafts collection
    drafts = db.collections['drafts']

    draft_id = None
    if args.draft:
        print(args.draft)
        draft_id = args.draft
    elif args.set:
        print(args.set)
        items = drafts.find({"set":args.set})
        pprint(list(items))
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
    else:
        new_player['_id'] = str(ObjectId())

    # get the target draft
    draft = drafts.find({'_id': draft_id})[0]
    
    # add the new player
    draft.get('players').append(new_player)

    # write to the data store
    drafts.update({'_id': draft_id}, draft)

    # output the added player
    print(new_player)

except Exception as err:
    print({'error': err})

finally:
    exit()
    db.connection.close()