# Usage tendermintGenerator


```
	tendermintGenerator --help
```


## Examples 

1. Create a blockchain with three nodes

```
./tendermintGenerator --nodesName=Node1,Node2,Node3 --chainId=PrivateBlockchain create
```
2. Delete the corresponding blockchain

```
./tendermintGenerator --nodesName=Node1,Node2,Node3 --chainId=PrivateBlockchain delete
```


# Docker naming convention 

- Inter node : network name : `[CHAIN_ID]`
- Intra node : network name : `[CHAIN_ID][NODE]`
- Intra node : volume name : `[CHAIN_ID][NODE]`
- Intra node : tendermint instance name : `tendermint[CHAIN_ID][NODE]`
- Intra node : proxy instance name : `proxy[CHAIN_ID][NODE]`
- Intra node : app instance name : `app[CHAIN_ID][NODE]`



# Usage (deprectade better use tendermintGenerator)



1. build the docker image (build github program_name)

```
./build  github.com/multiverseHQ/abci_sample abci_counter
```

2. create instances

```
./create NODE1
./create NODE2
```

3. enable communication between nodes and launch tendermint instances in screen

```
./enableCommunication CHAIN_ID NODE1 NODE2
``` 

4. create genesis file 

```
./genesis CHAIN_ID NODE1 NODE2 ...
```

------

> To clean the instance  (if you want to run create again)

./clean NODE1 NODE2 NODE3



