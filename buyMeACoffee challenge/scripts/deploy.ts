import { ethers } from "hardhat";

const COFFEE_PRICE = ethers.utils.parseEther("0.01")

async function main() {
  const BuyMeACoffeeFactory = await ethers.getContractFactory('BuyMeACoffee');
  const buyMeACoffeeContract = await BuyMeACoffeeFactory.deploy(COFFEE_PRICE);;
  await buyMeACoffeeContract.deployed()
  console.log(`Contract deployed at address ${buyMeACoffeeContract.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
