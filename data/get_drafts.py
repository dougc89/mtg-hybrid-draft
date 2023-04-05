import pprint, local_db, json, argparse
from bson.objectid import ObjectId

try:
    parser = argparse.ArgumentParser(description="Drafts by set.")
    parser.add_argument('-s', '--set', help="set symbol")
    args = parser.parse_args()

    db = local_db.database('hybrid-draft')
    drafts = db.collections['drafts']
    packs = db.collections['packs']

    if args.set:
        items = drafts.find({'set':args.set})
    else:
        items = drafts.find({})
    
    if len(items) < 1:
        raise Exception('draft not found')

    # use the first draft
    draft = items[0]

    for player in draft.get('players'):
        # determine how many packs the player is currently assigned
        assigned_packs = packs.find({'draft_id': draft.get('_id'), 'assigned_to': player.get('_id')})
        player['assigned_packs'] = len(assigned_packs)

    print(json.dumps([draft]))

except Exception as err:
    print(json.dumps({'error': f"{err}"}))
finally:
    exit()
    db.connection.close()
