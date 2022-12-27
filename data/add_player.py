import credentials, mongo, pymongo
from bson.objectid import ObjectId

db = mongo.database('hybrid-draft')

# drafts collection
drafts = db.database['drafts']

new_player = {
    '_id': '2790',
    'name': 'Doug C.'
}

drafts.update_one({
    '_id': ObjectId('63aa68056129a1291374816a')
},
{
    '$push': {
        'players': new_player
    }

})