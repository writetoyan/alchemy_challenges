import { ethers } from "hardhat";
import * as dotenv from 'dotenv'
import { NFT__factory } from "../typechain-types";
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

async function main() {
  //The arguments passed to the constructor are from the cli
  const args = process.argv;
  const nftCollectionName = args[2]
  const nftCollectionSymbol = args[3]
  const nftCollectionTotalSupply = args[4]
  const maxMintPerWallet = args[5]

  //Setting up the provider and the wallet
  const provider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY)
  if(!PRIVATE_KEY || PRIVATE_KEY.length <= 0) {
    throw new Error("Private key missing");
  }
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const deployer = wallet.connect(provider)

  //Deploying the contract
  const contractFactory = new NFT__factory(deployer);
  console.log("Deploying contract ...")
  const nft = await contractFactory.deploy(nftCollectionName, nftCollectionSymbol, nftCollectionTotalSupply, maxMintPerWallet);
  await nft.deployed()
  console.log(`Contract deployed at address: ${nft.address}`)
  
  //Reading from the blockchain that every parameters passed to the constructor is correctly implemented
  const totalSupply = await nft.MAX_SUPPLY();
  const name = await nft.name();
  const symbol = await nft.symbol();
  console.log(`The name of this collection is "${name}" with a token symbol "${symbol}" and has a total supply of ${totalSupply} NFT`)
  const maxMint = await nft.MAX_MINT();
  console.log(`Each wallet are allowed to mint ${maxMint} NFT`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

