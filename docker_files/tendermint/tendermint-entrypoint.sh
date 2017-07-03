#!/bin/bash
set -e

if [ "$1" = 'postgres' ]; then
    echo "TOTO"

    if [ -z "$(ls -A "$PGDATA")" ]; then
        gosu postgres initdb
    fi

    exec gosu postgres "$@"
fi

exec "$@"