import json

validator_file = "priv_validator.json"
genesis_file = "genesis.json"


def get_validator( path ):
    full_path = "{}/{}".format(path,validator_file)
    with open(full_path) as json_data:
        tbl = json.load(json_data)
        for t in tbl:
            if t == "pub_key":
                validator = {}
                validator['pub_key'] = tbl[t]
                validator['amount'] = 10
                validator['name'] = ''

    return validator


def get_validators( list ):
    validators = []
    for i,v in enumerate( list):
       # print v
       validators.append(get_validator(v))
    return validators

def get_pub_keys( list ):
    pub_keys = ','.join([v["pub_key"]["data"] for v in get_validators( list )])
    return pub_keys
