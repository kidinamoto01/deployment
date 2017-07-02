#!/usr/bin/python
import json,sys

def get_validator( node ):
    full_path = "{}{}".format(path.replace('__NODE__',node),validator_file)
    with open(full_path) as json_data:
        tbl = json.load(json_data)
        for t in tbl:
            if t == "pub_key":
                validator = {}
                validator['pub_key'] = tbl[t]
                validator['amount'] = 10
                validator['name'] = ''

    return validator



path = "/var/lib/docker/volumes/tendermintData__NODE__/_data/"

validator_file = "priv_validator.json"
genesis_file = "genesis.json"
genesis_full_path  = "{}{}".format(path.replace('__NODE__','1'),genesis_file)

with open(genesis_full_path) as json_data:
    genesis = json.load(json_data)


genesis['validators'] = []

for i,v in enumerate(sys.argv):
    if i != 0:
        genesis['validators'].append(get_validator(v))




print(json.dumps(genesis))

#{"genesis_time":"0001-01-01T00:00:00Z","chain_id":"test-chain-e8W3qd","validators":[
#{"pub_key":
#{"type":"ed25519","data":"EC821183046A81795F616627095B59FC079A51A559239EC35F19B62ABD8454BA"}
#,"amount":10,"name":""}
#,
#{"pub_key":
#{"type":"ed25519","data":"F1F1ED90D5F531FC51AB1CF3A778E9EF9DD40E86C8391B40ED83BAE29A38C6D6"}
#,"amount":10,"name":""}
#,
#{"pub_key":
#{"type":"ed25519","data":"474D42AA963B76493C90701B3B85FCED5DE83B9071979F01B91DF163BFC66159"}
#,"amount":10,"name":""}

