# Our work about Tendermint Deployment

## At the beginning of the hackethon

 we wrote a first version of deployment with a Python Script and we wrote a Nodejs Server to orchestrate the deployment 
- Python Tendermint Blockchain Generator (https://github.com/multiverseHQ/deployment/tree/master/docker)
- Orchestration Server with Terraform (https://github.com/multiverseHQ/deployment/tree/master/server)


## Lately

We simplify the work and we use now only the docker-compose command (one line) and Digital Ocean API. 

We use the user-data command during creation so **we don't need to log into the machine after creation to deploy the node. That's very very cool.**

- Docker-Compose Deployment (https://github.com/multiverseHQ/deployment/tree/master/docker_compose)
- https://github.com/multiverseHQ/front-end/tree/digi (check the DIGI Branch)

For the fun, we show you the sample how we launch an application with docker-compose and digital ocean without the need to save a ssh_key

```
droplet = DropletKit::Droplet.new(name: "node#{self.id}", region: 'nyc3', size: '512mb', ssh_keys: [], image: @snapshot_id,
     user_data: "#!/bin/bash
        curl -o docker-compose.yaml https://raw.githubusercontent.com/multiverseHQ/deployment/master/docker_compose/docker-compose.yaml 
        echo -e 'MULTIVERSE_GITHUB=github.com/multiverseHQ/demo_app/abci_counter/...\nMULTIVERSE_COMMAND=abci_counter\nMULTIVERSE_VALIDATORS=#{address_validators}\nMULTIVERSE_SEEDS=#{address_seeds}' > .env
        docker-compose up")
```