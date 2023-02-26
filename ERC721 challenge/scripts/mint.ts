import { ethers } from 'hardhat'
import * as dotenv from 'dotenv'
import { NFT__factory } from '../typechain-types';
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

async function main() {
    //The arguments passed to the constructor are from the cli
    const args = process.argv;
    const deployedContractAddress = args[2];
    const mintToAddress = args[3];
    const URI = args[4];
    const numberOfNftToMint = parseInt(args[5])

    //Setting up the provider and the wallet
    const provider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY)
    if(!PRIVATE_KEY || PRIVATE_KEY.length <= 0) {
        throw new Error("Private key missing");
    }
    const wallet = new ethers.Wallet(PRIVATE_KEY);
    const minter = wallet.connect(provider)

    //Minting the NFT
    const contractFactory = new NFT__factory(minter);
    const nft = contractFactory.attach(deployedContractAddress);
    const maxMintPerWallet = (await nft.MAX_MINT()).toNumber();
    const numberOfNftAlreadyMinted = (await nft.maxMintAddress(mintToAddress)).toNumber();
    if((numberOfNftToMint + numberOfNftAlreadyMinted) > maxMintPerWallet) {
        console.log(`You cannot mint more than ${maxMintPerWallet} per wallet`)
        console.log(`The address ${mintToAddress} have ${maxMintPerWallet - numberOfNftAlreadyMinted} NFT left to mint. Minting them now ...`)
    } else {
        console.log(`Minting ${numberOfNftToMint} NFT to ${mintToAddress}`)
    }
    for (let i = 0; i < numberOfNftToMint; i++) {
        try {
            await nft.safeMint(mintToAddress, URI)
        } catch (error) {
            console.log("Mint done! Don't forget to flex your NFT!")
            process.exit(0)
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})