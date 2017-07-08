FROM golang:1.8

# We need the IP of the App.
ENV APP_IP 0.0.0.0

# RUN apk add --no-cache bash
RUN go get -v github.com/multiverseHQ/abci_proxy/abci_proxy/...

EXPOSE 46659

EXPOSE 46660

CMD abci_proxy -proxy=tcp://${APP_IP}:46658
