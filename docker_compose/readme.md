# Deploy your ABCi app in 1 click with Docker-Compose (Produced by the Multiverse Team)

Deploy in one command Tendermint + ABCi Proxy + ABCi App.

## To deploy on Local

1. Make sure you have docker and docker-compose installed in your computer

2. Run: 

- curl -o docker-compose.yaml https://raw.githubusercontent.com/multiverseHQ/deployment/master/docker_compose/docker-compose.yaml

3. Type in the shell 4 lines with the Github Repo of your App and the command of your app

- export MULTIVERSE_SEEDS=0.0.0.0
- export MULTIVERSE_VALIDATORS=
- export MULTIVERSE_GITHUB=github.com/multiverseHQ/abci_sample/abci_counter/...
- export MULTIVERSE_COMMAND=abci_counter

4. Run: 

- docker-compose up

## To deploy your ABCi app on X Servers

1. For each Amazon EC2 Instance or Digital Ocean Bucket, make sure you have Docker & Docker-Compose Installed

2. Copy Docker-compose.yml into your servers. Run: 

- curl -o docker-compose.yaml https://raw.githubusercontent.com/multiverseHQ/deployment/master/docker_compose/docker-compose.yaml

3. Type in the shell the 4 parameters with the Github Repo of your App,the command of your app and the IP address of your validators & seeds.

- export MULTIVERSE_GITHUB=github.com/multiverseHQ/abci_sample/abci_counter/...
- export MULTIVERSE_COMMAND=abci_counter
- export MULTIVERSE_SEEDS=192.168.0.2,192.168.0.3
- export MULTIVERSE_VALIDATORS=192.168.0.2,192.168.0.3

5. To launch each Tendermint node + ABCi proxy + ABCi app, Run:

- docker-compose up

6. Optionnal. You can launch the command in only one line

- export MULTIVERSE_GITHUB=github.com/multiverseHQ/abci_sample/abci_counter/... && export MULTIVERSE_COMMAND=abci_counter && export MULTIVERSE_SEEDS=192.168.0.2,192.168.0.3 && export MULTIVERSE_VALIDATORS=192.168.0.2,192.168.0.3 && docker-compose up
