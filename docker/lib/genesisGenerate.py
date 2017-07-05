#!/usr/bin/python
import json,sys
from utils import get_validators, validator_file, genesis_file

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
        open(genesis_full_path, 'w').close()
        open(genesis_full_path, 'w').write(json.dumps(genesis))

