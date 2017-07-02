# 1. build the docker image (build github program_name)

./build  github.com/multiverseHQ/abci_sample abci_counter

# 2. create instances

./create NODE1
./create NODE2

# 3. enable communication between nodes and launch tendermint instances in screen

./enableCommunication NODE1 NODE2
 
# 4. create genesis file 

./genesis NODE1 NODE2

------

> To clean the instance  (if you want to run create again)

./clean NODE1 NODE2 NODE3
