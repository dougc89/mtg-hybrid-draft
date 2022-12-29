import json

class database:
    data = None
    collection_path = None
    def __init__(this, collection):
        this.collection_path = "{}.db".format(collection)
        with open(this.collection_path, 'r') as f:
            this.data = json.load(f)
    
    def write(this):
        with open(this.collection_path, 'w') as f:
            json.dump(f, this.data)

    def find(this, search_filter):
        matches = []
        for item in this.data:
            tested_keys = []
            for key in search_filter:
                tested_keys.append(key)
                if item.get(key) and item.get(key) == search_filter.get(key):
                    tested_keys.remove(key)

            # tested keys should be empty if all requested matches have been matched
            if len(tested_keys):
                matches.append(item)

        return matches
        
    def insert_one(this, document):
        this.data.append(document)
        this.write()
    