# Deploy your ABCi app in 1 click with Docker-Compose (Produced by the Multiverse Team)

Deploy in one command Tendermint + ABCi Proxy + ABCi App.

## To deploy on Local

1. Make sure you have docker and docker-compose installed in your computer

2. Run: 

- curl -o docker-compose.yaml https://raw.githubusercontent.com/multiverseHQ/deployment/master/docker_compose/docker-compose.yaml

3. Type in the shell thie lines with the 4 correct parameters: MULTIVERSE_SEEDS, MULTIVERSE_VALIDATORS MULTIVERSE_GITHUB, MULTIVERSE_COMMAND

- echo -e 'MULTIVERSE_GITHUB=github.com/multiverseHQ/demo_app/abci_counter/...\nMULTIVERSE_COMMAND=abci_counter\nMULTIVERSE_VALIDATORS=""\nMULTIVERSE_SEEDS=0.0.0.0' > .env && docker-compose up

## To deploy your ABCi app on X Servers

1. For each Amazon EC2 Instance or Digital Ocean Bucket, make sure you have Docker & Docker-Compose Installed

2. Copy Docker-compose.yml into your servers. Run: 

- curl -o docker-compose.yaml https://raw.githubusercontent.com/multiverseHQ/deployment/master/docker_compose/docker-compose.yaml

3. Type in the shell thie lines with the 4 correct parameters: MULTIVERSE_SEEDS, MULTIVERSE_VALIDATORS MULTIVERSE_GITHUB, MULTIVERSE_COMMAND for example

- echo -e 'MULTIVERSE_GITHUB=github.com/multiverseHQ/demo_app/abci_counter/...\nMULTIVERSE_COMMAND=abci_counter\nMULTIVERSE_VALIDATORS="192.168.0.2,192.168.0.3"\nMULTIVERSE_SEEDS=192.168.0.2,192.168.0.3' > .env && docker-compose up
