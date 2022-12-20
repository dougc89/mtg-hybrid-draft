import json, argparse, hashlib, datetime

parser = argparse.ArgumentParser(description="Let's send some emails.")
parser.add_argument('-u', '--user', help="user id that is adding the pack")
args = parser.parse_args()

try:
    if not args.user:
        raise Exception("user not defined")
    user = args.user


    # read the file
    with open("c:\\github\\mtg-hybrid-draft\\data\\BRO.json", 'r') as f:
        data = json.load(f)
        packs = data.get('packs')
        # count the number of packs that this user has already opened, to determine the round we are adding this pack to 
        round = 1
        for pack in packs:
            if pack.get('opened_by') == user:
                round += 1
        
        # add the new pack
        new_pack = {
            '_id': hashlib.sha1(str(datetime.datetime.now()).encode()).hexdigest(),
            'opened_by': user,
            'round': round,
            'cards': []
        }
        packs.append(new_pack)

    # write to the file
    with open("c:\\github\\mtg-hybrid-draft\\data\\BRO.json", 'w') as f:
        json.dump(data, f)

    print(new_pack)
except Exception as err:
    print(err)