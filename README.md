[//]: # (SPDX-License-Identifier: CC-BY-4.0)

# Hyperledger Fabric Samples (Commercial Paper Demo)

## About
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
* Start the fabric-test network by going inside test-network/ and run `./network.sh`
* Navigate inside `./configuration/cli/` and run `monitordocker.sh`
* #### Preparing the issuance (Magnetocorp)
