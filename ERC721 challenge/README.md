# ERC721 Challenge 01

This project consist of creating an ERC721 using openzeppelin standards. And storing the metadata on Filebase.
The NFT can be minted by everyone and there is a maximum of 5 NFT mint per wallet.              
<br>

### What this project contain
<br>

- The smart contract 'NFT.sol'
- A script to deploy the smart-contract on Goerli 'deploy.ts'
- A script to mint a NFT 'mint.ts'

<br>

### How to deploy the contract
<br>

The constructor of the smart contract need 4 args: 
- The name of the collection
- The symbol
- The total supply
- The maximum number of NFT a wallet can mint

We pass those arguments on the CLI when deploying the script.
<br>

```shell
$ yarn run ts-node --files ./scripts/deploy.ts "Alchemy" "ALC" 10000 5
```
<br>

The result of the script deploy.ts
```shell
Deploying contract ...
Contract deployed at address: 0x2265eCeE566CF32dd7d34070cA7D6F87E0A04527
The name of this collection is "Alchemy" with a token symbol "ALC" and has a total supply of 10000 NFT
Each wallet are allowed to mint 5 NFT
Done in 30.34s.
```
<br>

### How to mint a NFT
<br>
To use the script to mint, we need to pass 4 arguments to the CLI:

<br>

- The address of the deployed contract
- The address that will receive the NFT
- The URI 
- The number of NFT to mint

<br>

```shell
$ yarn run ts-node --files ./scripts/mint.ts 0x2265eCeE566CF32dd7d34070cA7D6F87E0A04527 0x1CB1728e675A14Ded41049dF3da7304AAF8aa01c "ipfs://QmWxPFA4NmJZDA4c2PPPceSfuNApJcnnNYqcgJKHZk62B5" 2
```
<br>

The result of the script mint.ts

```shell
Minting 2 NFT to 0x1CB1728e675A14Ded41049dF3da7304AAF8aa01c
Done in 5.17s.
```
<br>
The result if we want to mint 5 more NFT

<br>

```shell
You cannot mint more than 5 per wallet
The address 0x1CB1728e675A14Ded41049dF3da7304AAF8aa01c have 3 NFT left to mint. Minting them now ...
Mint done! Don't forget to flex your NFT!
Done in 7.31s.

```