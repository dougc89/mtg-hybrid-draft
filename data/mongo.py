import os, pymongo, credentials, pprint


class database:
    # we will only interact with one database with this connection
    database = None

    def __init__(this, database):

        # Provide the mongodb atlas url to connect python to mongodb using pymongo
        CONNECTION_STRING = "mongodb+srv://{username}:{password}@{cluster}.mongodb.net/{database}".format(
            username = os.getenv('mongo_user'),
            password = os.getenv('mongo_pass'),
            cluster = os.getenv('mongo_cluster'),
            database = database
            )

        # Create a connection using MongoClient
        print('connecting...')
        client = pymongo.MongoClient(CONNECTION_STRING)
        print('connected.')

        # Create the database for our example (we will use the same database throughout the tutorial
        # print(client[database])
        this.database = client[database]

    def connection(this):
        return this.database

    
            



