[//]: # (SPDX-License-Identifier: CC-BY-4.0)

# Hyperledger Fabric Samples 

## Commercial Paper Demo
This repository is cloned for recording developer's personal learning curves and solution.

### Introduction:
There are two organizations namely Magnetocorp & Digibank and two individuals both representing respective organizations namely Isabella & Balaji.

Roles:- 
 * Magnetocorp - CP holder
 * Digibank - CP underwriter
 * Isabella - Magnetocorp representative and admin for Magnetocorp (issuer).
 * Balaji - Digibank representative and admin for Digibank for CP (buyer/redeem). 

### Solutions:
 #### Configure The Network
* Start the fabric-test network by going inside test-network/ and run `./network-starter.sh`
* Navigate inside `./configuration/cli/` and run `monitordocker.sh`. Parameter <network_name> can also be supplied to monitor specific network otherwise all docker networks will be monitored and this terminal will be used to monitor all transactional and debug logs.
* #### Preparing the issuance (Magnetocorp)
In general there are severals variable paths have to be set in order to prepare the organizations. An organization requires:

1. `PATH=` set to `/bin`
2. `FABRIC_CFG_PATH=` set to `/config`
3. `CORE_PEER_TLS_ENABLED=` set to `true`
4. `CORE_PEER_LOCALMSPID=` set to organization MSP
5. `CORE_PEER_TLS_ROOTCERT_FILE=` set to the location of certificate authority .crt file
6. `CORE_PEER_MSPCONFIGPATH=` set to `user/OrgAdmin/msp `folder
7. `CORE_PEER_ADDRESS=` set to organization `address:port`

In this demo, run the script to source all the relevant paths.
`source magnetocorp.sh`

* #### Generating chaincode package

The chaincode has to be packaged before being installed.
`peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0`

* #### Installing the chaincode package

`peer lifecycle chaincode install cp.tar.gz`

* #### (Optional) Query the installed package

`peer lifecycle chaincode queryinstalled`

* #### Source the chaincode package
Set the `PACKAGE_ID=` to the package ID that was just installed.

* #### Chaincode approval
Depending on thee business logics, the smart contract will be required to be approved by both or singular organization(s)

`peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name papercontract -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA `

* #### Preparing the issuance (Digibank)

The process of generating, installing, sourcing of chaincode will be the same for Digibank.

* #### Chaincode aporoval

`peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name papercontract -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA `

* #### Chaincode commit
Now that both organizations has approved the contract, Digibank will proceed to commit the chaincode into the network.

`peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_ORG1_CA} --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} --channelID mychannel --name papercontract -v 0 --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent`

### Issuance

Once the smart contract has been configured and deployed into the network, a representative / admin will be assigned to conduct the issuance process. This will be done on behalf of Magnetocorp. 

Nonetheless, I think in real world the issuance of corporate bond is usually done by the financial institution once both parties has agreed on the contract terms.

Anyways..

#### Wallet 

As Isabella has been appointed to conduct the issuance, she will first need to generate an identity / credential and stored it inside her wallet. The scripts are provided inside `application/` of each organization.

Since the process of enrolling, creating and storing wallet and identity for her is written in Javascript, hence an installation of required dependencies will be required. For that, runs:

`npm install && npm audit fix`

Then Isabella is now ready to be enrolled as the issuer of the CP here.

`./enrollUser.js`

Isabella now have her own credential / identity which is now stored inside her wallet. 

`/magnetocorp/user/isabella/wallet` inside the file `isabella.id`


#### Issue

Now Isabella can issue to commercial paper.
`node issue.js`

The details of the issuance such as bond face value etc should be displayed.


### Buy the bond

Come to the role of Balaji as the buyer of bond, he will buy the bond subsequently redeem the bond and end the lifecycle of the contract. So navigate into `digibank/application` directory and install the NodeJS dependencies (if haven't), and run:

`node enrolluser.js`

Just like Isabella, Balaji is now has been enrolled as the representative to buy the bond. To buy the bond run:

`node buy.js`

### Redeem the bond

Finally, the final lifecyle of the CP is by redemption of the CP itself. For that, runs:

`node redeem.js`

The lifecycle of the bond is now ended.

#### Shutting down the network

navigate back to `/commercial-paper` and run 

`./network-cleaner.sh`



