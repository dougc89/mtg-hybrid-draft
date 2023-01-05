import json, os
from bson.objectid import ObjectId
from pprint import pprint

class database:
    data = None
    database_path = None

    collections = {} 
    
    def __init__(this, database_name):
        this.database_path = str(database_name)
        for f in os.listdir(this.database_path):
            this.collections[f] = collection(os.path.join(this.database_path, f))
        # print(this.collections)

class collection:

    collection_path = None
    result_set = []

    def __init__(this, collection_path):
        this.collection_path = collection_path

    def find(this, search_filter):
        # reset the result set
        this.result_set = []

        # read all the documents in target collection directory
        documents = os.listdir(this.collection_path)
        for document in documents:
            with open(os.path.join(this.collection_path, document), 'r') as f:
                data = json.load(f)
            
            unmatched_keys = []
            for key in search_filter:
                unmatched_keys.append(key)
                if data.get(key) and data.get(key) == search_filter.get(key):
                    unmatched_keys.remove(key)

            # tested keys should be empty if all requested matches have been matched
            if not len(unmatched_keys):
                this.result_set.append(data)

        return this.result_set
        
    def insert_one(this, document):
        # _id will be used for the filename of the json document
        if '_id' in document:
            _id = document.get('_id')
        else:
            _id = str(ObjectId())
            # and set the id field in the document
            document['_id'] = _id
        
        with open(os.path.join(this.collection_path, "{}.json".format(_id)), 'w') as f:
            # write the new file
            json.dump(document, f, indent=4)
    