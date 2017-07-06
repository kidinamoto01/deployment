#!/bin/bash
set -x

get get ${GITHUB_REPO}

exec ${COMMAND}

#exec tendermint node --proxy_app=tcp://${PROXY_IP}:46658 --home=$TMHOME --log_level "debug"
