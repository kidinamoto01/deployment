## This dockerfile is not working, we need to make it work
# get the github repo of the ABCi app developer as Parameter
# and build and run into a container
FROM golang:1.8.3

RUN go get -v github.com/tendermint/abci/cmd/...

EXPOSE 46658

CMD ["counter"]