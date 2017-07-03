#!/usr/bin/python
import json,sys

validator_file = "priv_validator.json"
genesis_file = "genesis.json"


#path = "/var/lib/docker/volumes/tendermintData1/_data/"
#path = sys.argv[1] + "/_data/"

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

sys.argv.pop(0)
chain_id = sys.argv.pop(0)
validators = get_validators( sys.argv )

for i,v in enumerate(sys.argv):
    if True:
        genesis_full_path  = "{}/{}".format(v,genesis_file)
        with open(genesis_full_path) as json_data:
            genesis = json.load(json_data)

	genesis['validators'] = validators
	genesis['chain_id'] = chain_id
        # print(json.dumps(genesis))
        # print(genesis_full_path)
        open(genesis_full_path, 'w').close()
        open(genesis_full_path, 'w').write(json.dumps(genesis))
