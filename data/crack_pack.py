import argparse, mongo, json, requests, random
from bson.objectid import ObjectId
from pprint import pprint

def get_cards(uri, card_list = []):
    print("Getting cards from {}".format(uri))
    # has_more is a flag on the responses, which we init as true
    has_more = True
    #print(params)
    #uri = "https://api.scryfall.com/cards/search"
    while has_more:
        res = requests.get(uri)
        print(res)
        res = res.json()
        pprint(res)
        card_list.extend(list(map(lambda card: card.get('multiverse_ids')[0], res.get('data'))))
        if res.get('has_more'):
            print(res.get('next_page'))
            # get more cards if they exist
            uri = res.get('next_page')
        else:
            # stop looking
            has_more = False
    
    # list of multiverse_ids
    return card_list

def normal_pack(set):
    # pack is a list of multiverse_ids for cards in the following distribution
    pack = []

    # (1): Mythic (12.5%) / Rare (87.5%)
    rarity = 'mythic' if random.random() < 0.125 else 'rare'
    rare_uri = "https://api.scryfall.com/cards/search?q=set:{}+rarity:{}".format(set, rarity)
    rare_cards = get_cards(rare_uri)

    # pick one at random
    pack.append(random.choice(rare_cards))

    # (10): Common cards, any distribution
    common_cards = get_cards("https://api.scryfall.com/cards/search?q=set:{}+rarity:common".format(set))
    pack.extend(random.choices(common_cards, k=10))

    # (3): Uncommons, in any color combo.
    uncommon_cards = get_cards("https://api.scryfall.com/cards/search?q=set:{}+rarity:uncommon".format(set))
    pack.extend(random.choices(uncommon_cards, k=3))

    # (1): Land
    land_cards = get_cards("https://api.scryfall.com/cards/search?q=set:{}+type:land".format(set))
    pack.append(random.choice(land_cards))

    pack = random.shuffle(pack)

    return pack

try:
    parser = argparse.ArgumentParser(description="Start a new draft.")
    parser.add_argument('-s', '--set', help="set for the target draft", required=True)
    args = parser.parse_args()

    # we may have different constructors for the various sets. Open a normal pack otherwise
    pack = normal_pack(args.set)

except Exception as err:
    print(err)
    # output a blank pack if something went wrong
    pack = []

finally:
    print(json.dumps(pack))

