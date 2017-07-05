FROM golang:1.8

EXPOSE 46659

RUN go get -v github.com/multiverseHQ/abci_sample/abci_counter/...

CMD abci_counter

#docker build -t monday_app .
#docker run -it  monday_app