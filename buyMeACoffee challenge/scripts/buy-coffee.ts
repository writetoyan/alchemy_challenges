import { ethers } from 'hardhat';
import { newMemoEventObject } from '../typechain-types/contracts/BuyMeACoffee'

const COFFEE_PRICE = ethers.utils.parseEther('1')

const getBalance = async (accounts: string[]) => {
    for (let account of accounts) {
        const balance = await ethers.provider.getBalance(account)
        console.log(`The balance of ${account} is: ${ethers.utils.formatEther(balance)} ETH`)
    }
}

const displayMemos = async (memos: newMemoEventObject[]) => {
    for (let memo of memos) {
        console.log(`${memo.name} bought a coffee at block ${memo.timestamp} with address ${memo.from} and left the message "${memo.message}"`)
    }
}

async function main() {
    const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();
    const BuyCoffeeFactory = await ethers.getContractFactory("BuyMeACoffee");
    const buyCoffeeContract = await BuyCoffeeFactory.deploy(COFFEE_PRICE);
    await buyCoffeeContract.deployed();
    console.log(`Contract deployed at address ${buyCoffeeContract.address}`)

    console.log("---------------- BALANCES AFTER DEPLOYMENT ----------------")
    const accounts = [owner.address, tipper.address, buyCoffeeContract.address];
    await getBalance(accounts)

    const tip = {value: ethers.utils.parseEther('1')}
    await buyCoffeeContract.connect(tipper).buyCoffee('Alice', 'Great works', tip);
    await buyCoffeeContract.connect(tipper2).buyCoffee('Bob', 'Amazing!', tip);
    await buyCoffeeContract.connect(tipper3).buyCoffee('Josh', 'Thanks!', tip);

    console.log("---------------- BALANCES AFTER BUYING COFFEE ----------------")
    await getBalance(accounts)

    console.log("---------------- BALANCES AFTER WITHDRAWING FUNDS ----------------")
    const withdrawTx = await buyCoffeeContract.withdrawFunds();
    await withdrawTx.wait();
    await getBalance(accounts);

    console.log("---------------- MEMOS ----------------")
    const memos = await buyCoffeeContract.getMemos()
    await displayMemos(memos);
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})