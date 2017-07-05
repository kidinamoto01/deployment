#!/bin/bash
set -e

## DO TENDERMINT INIT IF PRIV_KEY DOESN"T EXIST /tendermint/priv_validator.json (We need to generate then priv/pub key & genenis.json)
if [ ! -f /tendermint/priv_validator.json ]; then

	tendermint init --home=$TMHOME --log_level "debug" 

	## COPY THE PUB KEY INTO THE NGINX SERVER FOLDER

	cat /tendermint/priv_validator.json | jq ".pub_key" > /tendermint/pub_key.json

	cp /tendermint/pub_key.json /pubkey
	
	## CREATE THE GENESIS FILE 
	# fill genesis file with validators
	IFS=',' read -ra VALS_ARR <<< "$VALIDATORS"
	fqdn_suffix=$(hostname -f | sed 's#[^.]*\.\(\)#\1#')
	for v in "${VALS_ARR[@]}"; do
	  # wait until validator generates priv/pub key pair
	  set +e
	
	  curl -s "http://$v/pub_key.json" > /dev/null
	  ERR=$?
	  while [ "$ERR" != 0 ]; do
	    sleep 5
	    curl -s "http://$v/pub_key.json" > /dev/null
	    ERR=$?
	  done
	  set -e
	
	  # add validator to genesis file along with its pub_key
	  curl -s "http://$v/pub_key.json" | jq ". as \$k | {pub_key: \$k, amount: 10, name: \"$v\"}" > pub_validator.json
	  cat /tendermint/genesis.json | jq ".validators |= .+ [$(cat pub_validator.json)]" > tmpgenesis && mv tmpgenesis /tendermint/genesis.json
	  rm pub_validator.json
	done

fi

## CREATE construct seeds
IFS=',' read -ra SEEDS_ARR <<< "$SEEDS"
seeds=()
for s in "${SEEDS_ARR[@]}"; do
  seeds+=("$s:46656")
done
seeds=$(IFS=','; echo "${seeds[*]}")

exec tendermint node --proxy_app=tcp://${PROXY_IP}:46658 --home=$TMHOME --p2p.seeds=$seeds --log_level "debug"
