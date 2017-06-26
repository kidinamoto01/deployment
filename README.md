Deployment of an ABCi app + Tendermint on AWS (without ABCi proxy)
# 1st Goal 
Each node is composed of 2 dockers containers (tendermint + application)
- Create a Dockerfile for the Tendermint Golang Consensus version 0.10.0 (from https://github.com/tendermint/tendermint/blob/develop/DOCKER/Dockerfile)
- Create the Dockerfile for the ABCI Application (from 1.8.3 Go Dockerfile https://hub.docker.com/_/golang/)

After the container is properly setup	
- Run a script to build the Counter ABCI Goglang github repo into the  ABCI Application container (https://github.com/tendermint/abci/tree/master/example/counter) example here https://blog.docker.com/2016/09/docker-golang/
https://blog.codeship.com/building-minimal-docker-containers-for-go-applications/
- Run the Counter ABCI app docker
- Run the tendermint docker
==>  Make sure the 2 containes are talking to each other.
# 2nd Goal
Create the Genesis command sequence Orchestration  (2 dockers containers per nodes)
Create a deploy script (with terraform, ecs, docker)
- Deploy X nodes in Amazon EC2 with one command line ( 12 nodes for example)

