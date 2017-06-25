FROM golang:1.8.3

RUN go get -v github.com/tendermint/abci/tree/master/example/counter

EXPOSE 46658

CMD ["counter"]