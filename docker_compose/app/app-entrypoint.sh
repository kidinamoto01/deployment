#!/bin/bash
set -x

go get -v ${GITHUB_REPO}

exec ${COMMAND}
