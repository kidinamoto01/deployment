# Deployment of an ABCi app + Tendermint on AWS

Create the Genesis command sequence Orchestration without ABCi proxy (2 dockers containers per nodes)

Each node is composed of 2 dockers containers (tendermint + application)
- Create a Dockerfile for the Tendermint Golang Consensus version 0.10.0 (from https://github.com/tendermint/tendermint/blob/develop/DOCKER/Dockerfile)
- Create the Dockerfile for the ABCI Application (from 1.8.3 Go Dockerfile https://hub.docker.com/_/golang/)

After the container is properly setup	
- Run a script to import the Counter ABCI github repo into the container (https://github.com/tendermint/abci/tree/master/example/counter) example here https://blog.docker.com/2016/09/docker-golang/
https://blog.codeship.com/building-minimal-docker-containers-for-go-applications/
- Run the Counter ABCI app when the container is UP
- Deploy X nodes in Amazon EC2 with one command line (minimum 4 nodes)

Create a deploy script (with terraform, ecs, docker)
