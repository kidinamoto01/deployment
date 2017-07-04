# Usage tendermintGenerator


```
	tendermintGenerator --help
```


## Examples 

1. Create a blockchain 

Example with three nodes:

```

./tendermintGenerator --nodesName=1,2,3 --chainId=abcd create -t=46658,46659,46660 -p=46558,46559,46560 -a=401,402,403

```

2. Delete the corresponding blockchain

```
./tendermintGenerator --nodesName=1,2,3 --chainId=abcd delete


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



