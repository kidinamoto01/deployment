#!/bin/bash
set -e

## YOU NEED TO DO THE TENDERMINT INIT TO GENERATE PUB_KEY/PRIVATE
if [ -z "$(ls -A "$PGDATA")" ]; then
    tendermint init --home=$TMHOME --log_level "debug" 
fi

## YOU NEED TO COPY THE PUB KEY INTO THE NGINX SERVER
cp /tendermint/genesis.json /pubkey

## YOU NEED TO CREATE THE GENESIS FILE 

exec tendermint node --proxy_app=tcp://${PROXY_IP}:46658 --home=$TMHOME --log_level "debug"
