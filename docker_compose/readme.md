# Multiverse Deployment with Docker-Compose

Deploy in one command Tendermint + ABCi Proxy + ABCi App.

## To install Multiverse Demo on Local

1. Make sure you have docker and docker-compose installed in your computer

2. Run: curl -o docker-compose.yaml https://raw.githubusercontent.com/multiverseHQ/deployment/master/docker_compose/docker-compose.yaml

3. Run: docker-compose up

## To install Multiverse Demo on X Servers

1. For each Amazon EC2 Instance or Digital Ocean Bucket, make sure you have Docker & Docker-Compose Installed

2. Copy Docker-compose.yml into your servers. Run: curl -o docker-compose.yaml https://raw.githubusercontent.com/multiverseHQ/deployment/master/docker_compose/docker-compose.yaml

3. Edit the line with IP_address of your servers separate by a comma

- SEEDS=192.168.0.2,192.168.0.3
- VALIDATORS=192.168.0.2,192.168.0.3

4. Launch each Tendermint node + ABCi app 

docker-compose up
