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
