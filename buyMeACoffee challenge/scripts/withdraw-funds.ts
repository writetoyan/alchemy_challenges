import { ethers } from 'hardhat';
import { BuyMeACoffee__factory } from '../typechain-types';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const CONTRACT_ADDRESS = "0x340579dD35C4207EBf9F9490f577EA83F230b574"

async function main() {

    const provider = new ethers.providers.AlchemyProvider('goerli', ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    
    const BuyMeACoffeeFactory = new BuyMeACoffee__factory(signer);
    const buyMeACoffeeContract = BuyMeACoffeeFactory.attach(CONTRACT_ADDRESS);

    const balanceOwnerBefore = await ethers.provider.getBalance(signer.address);
    const balanceContractBefore = await ethers.provider.getBalance(CONTRACT_ADDRESS);
    console.log(`The owner has a balance of ${ethers.utils.formatEther(balanceOwnerBefore)} ETH`);
    console.log(`The contract has a balance of ${ethers.utils.formatEther(balanceContractBefore)} ETH`);

    if (balanceContractBefore.toString() !== "0") {
        console.log("Withdrawing funds ...")
        const withdrawTx = await buyMeACoffeeContract.withdrawFunds();
        await withdrawTx.wait()
        const balanceOwnerAfter = await ethers.provider.getBalance(signer.address);
        console.log(`The balance of the owner after withdraw is ${ethers.utils.formatEther(balanceOwnerAfter)} ETH`)
    } else {
        console.log('The contract has no balance')
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})