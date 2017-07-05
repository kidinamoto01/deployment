# Multiverse Deployment with Docker-Compose

## 1) To install Multiverse Demo on Local

1. Make sure you have docker and docker-compose installed in your computer

2. curl -o docker-compose.yaml https://raw.githubusercontent.com/multiverseHQ/deployment/master/docker_files/docker-compose.yaml

3. docker-compose up

## 2) To install Multiverse Demo on X Servers

1. For each Amazon EC2 Instance or Digital Ocean Bucket, make sure you have Docker & Docker-Compose Installed

2. Copy Docker-compose.yml into your servers: curl -o docker-compose.yaml https://raw.githubusercontent.com/multiverseHQ/deployment/master/docker_files/docker-compose.yaml

3. Edit the line with IP_address of your servers. 

- SEEDS=192.168.0.2,192.168.0.3
- VALIDATORS= 192.168.0.2,192.168.0.3

4. Launch each Tendermint node + ABCi app 

docker-compose up
