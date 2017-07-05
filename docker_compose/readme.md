# Docker-Compose

## 1) Go to Each Amazon EC2 Instance or Digital Ocean Bucket with Docker Installed

## 2) Copy Docker-compose.yml into your servers

curl -o docker-compose.yaml https://raw.githubusercontent.com/multiverseHQ/deployment/master/docker_files/docker-compose.yaml

## 3) Launch each Tendermint node + ABCi app 

docker-compose up
