#!/bin/bash
set -e

## DO TENDERMINT INIT IF WE NEED TO GENERATE PUB_KEY/PRIVATE AND GENESIS FILE
if [ -z "$(ls -A "$PGDATA")" ]; then
    tendermint init --home=$TMHOME --log_level "debug" 


## COPY THE PUB KEY INTO THE NGINX SERVER FOLDER
cp /tendermint/PUB_KEY_HERE.json /pubkey

## CREATE THE GENESIS FILE 
# fill genesis file with validators

#IFS=',' read -ra VALS_ARR <<< "$VALIDATORS"
#fqdn_suffix=$(hostname -f | sed 's#[^.]*\.\(\)#\1#')
#for v in "${VALS_ARR[@]}"; do
#  # wait until validator generates priv/pub key pair
#  set +e

#  curl -s "http://$v.$fqdn_suffix/pub_key.json" > /dev/null
#  ERR=$?
#  while [ "$ERR" != 0 ]; do
#    sleep 5
#    curl -s "http://$v.$fqdn_suffix/pub_key.json" > /dev/null
#    ERR=$?
#  done
#  set -e

#  # add validator to genesis file along with its pub_key
#  curl -s "http://$v.$fqdn_suffix/pub_key.json" | jq ". as \$k | {pub_key: \$k, amount: $VALIDATOR_POWER, name: \"$v\"}" > pub_validator.json
#  cat /tendermint/genesis.json | jq ".validators |= .+ [$(cat pub_validator.json)]" > tmpgenesis && mv tmpgenesis /tendermint/genesis.json
#  rm pub_validator.json
#done

fi

## CREATE construct seeds
#IFS=',' read -ra SEEDS_ARR <<< "$SEEDS"
#seeds=()
#for s in "${SEEDS_ARR[@]}"; do
#  seeds+=("$s.$fqdn_suffix:46656")
#done
#seeds=$(IFS=','; echo "${seeds[*]}")

exec tendermint node --proxy_app=tcp://${PROXY_IP}:46658 --home=$TMHOME --log_level "debug"
