#!/bin/bash
set -e

if [ -z "$(ls -A "$PGDATA")" ]; then
    tendermint init --home=$TMHOME --log_level "debug" 
fi

exec tendermint node --proxy_app=tcp://${PROXY_IP}:46658 --home=$TMHOME --log_level "debug"
