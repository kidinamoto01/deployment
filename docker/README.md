SOME THINGS HARDCODED FOR HACKATHON

-> folder name of docker volumes
-> exposed port only works for one instance per node
-> no deletion of volumes when launching debug (easier to not mess up genesis during testing)

00:00 : request launched
01:30 : building and launching docker
03:30 : blockchain at block 30


USE THE TERRAFORM API 

1. Create a project : `http://url_tera_instance_api/create?nodes=[1,2]&project=31&git=github.com/multiverseHQ/abci_sample&app=abci_counter`
2. List details about project : `http://url_tera_instance_api/list?project=30`

3. 
init -g=github.com/multiverseHQ/abci_sample -a=abci_counter -p=007 -n=1 -i=34.230.35.150,54.175.25.187 --tendermintPort=46656 --proxyPort=46658 --appPort=46659
init -g=github.com/tendermint/basecoin/cmd -a=basecoin -b="--address=tcp://0.0.0.0:4665 start --without-tendermint" -p=007 -n=1 -i=34.230.35.150,54.175.25.187 --tendermintPort=46656 --proxyPort=46658 --appPort=46659


# Usage tendermintGenerator


```
	tendermintGenerator --help
```


## Examples 

0. Build the docker images

```
./build  github.com/multiverseHQ/abci_sample abci_counter
```

1. Create a blockchain 

Example with three nodes:

```

./tendermintGenerator --nodesName=1,2,3 --chainId=abcd create -t=46658,46659,46660 -p=46558,46559,46560 -a=401,402,403

```

2. Delete the corresponding blockchain

```
./tendermintGenerator --nodesName=1,2,3 --chainId=abcd delete


```

3. Debug the blockchain

The script launches a series of screen, you can open them with 

```
screen -R [tendermint/proxy/app//][CHAIN_ID][NODE]
```

# Docker naming convention 

- Inter node : network name : `[CHAIN_ID]`
- Intra node : network name : `[CHAIN_ID][NODE]`
- Intra node : volume name : `[CHAIN_ID][NODE]`
- Intra node : tendermint instance name : `tendermint[CHAIN_ID][NODE]`
- Intra node : proxy instance name : `proxy[CHAIN_ID][NODE]`
- Intra node : app instance name : `app[CHAIN_ID][NODE]`


http://ec2-54-172-87-22.compute-1.amazonaws.com:8080/create?nodes=[1]&project=1&git=git@github.com:multiverseHQ/abci_sample.git&app=abci_counter
