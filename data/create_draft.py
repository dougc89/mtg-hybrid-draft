import credentials, mongo

# connect to mongo
db = mongo.database('hybrid-draft')

# create/connect to drafts table
table = db.database['drafts']

new_draft = {
    'set': 'BRO',
    'num_packs': 4,
    'players':[],
    'packs': []
}

table.insert_one(new_draft)