FROM golang:1.8

ENV GITHUB_REPO github.com/multiverseHQ/abci_sample/abci_counter/...

ENV COMMAND abci_counter

EXPOSE 46659

COPY ./app-entrypoint.sh /

RUN chmod 777 /app-entrypoint.sh

CMD ["/app-entrypoint.sh"]