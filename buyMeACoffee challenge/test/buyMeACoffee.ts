import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { BuyMeACoffee, BuyMeACoffee__factory } from '../typechain-types'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe('BuyMeACoffee', () => {

  let buyMeACoffeeContract: BuyMeACoffee
  let deployer: SignerWithAddress;
  let buyer: SignerWithAddress;
  let COFFEE_PRICE: BigNumber;

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners()
    const BuyMeACoffeeFactory = new BuyMeACoffee__factory(deployer);
    COFFEE_PRICE = ethers.utils.parseEther('0.01')
    buyMeACoffeeContract = await BuyMeACoffeeFactory.deploy(COFFEE_PRICE);
    await buyMeACoffeeContract.deployed();
  })

  describe('Deployment', () => {

    it('Should set the owner of the contract', async () => {
      expect(await buyMeACoffeeContract.owner()).to.eq(deployer.address)
    });
    it('Should set the COFFEE_PRICE correctly', async () => {
      expect(await buyMeACoffeeContract.getCoffeePrice()).to.eq(COFFEE_PRICE)
    })
  });

  describe('Buy Coffee', async () => {

    it('Should be able to receive paiement in eth', async () => {
      const balanceBefore = await ethers.provider.getBalance(buyMeACoffeeContract.address)
      const buyCoffeeTx = await buyMeACoffeeContract.connect(buyer).buyCoffee('Bob', 'Thanks for the work', {value: COFFEE_PRICE})
      await buyCoffeeTx.wait()
      const balanceAfter = await ethers.provider.getBalance(buyMeACoffeeContract.address);
      expect(balanceAfter).to.eq(balanceBefore.add(COFFEE_PRICE))
    })
    it('Should revert if the amount send is less than the coffee price', async () => {
      await expect(buyMeACoffeeContract.connect(buyer).buyCoffee('Bob', 'Thanks for the work', {value: COFFEE_PRICE.sub(1)}))
      .to.be.revertedWithCustomError(buyMeACoffeeContract, 'BuyMeACoffee__AmountTooLow')
    })
    it('Should set the memo with a name and message', async () => {
      const buyCoffeeTx = await buyMeACoffeeContract.connect(buyer).buyCoffee('Bob', 'Thanks for the work', {value: COFFEE_PRICE});
      await buyCoffeeTx.wait()
      const memo = await buyMeACoffeeContract.memos(0);
      expect(memo.name).to.eq('Bob');
      expect(memo.message).to.eq('Thanks for the work')
    })
    it('Should emit an event', async () => {
      await expect(buyMeACoffeeContract.connect(buyer).buyCoffee('Bob', 'Thanks for the work', {value: COFFEE_PRICE}))
        .to.emit(buyMeACoffeeContract, "newMemo").withArgs(buyer.address, anyValue, 'Bob', 'Thanks for the work' )
    })
  })

  describe('should be able to withdraw funds', () => {

    let balanceContractBefore: BigNumber
    let balanceDeployerBefore: BigNumber
    let gasPaid: BigNumber

    beforeEach( async () => {
      const buyCoffeeTx = await buyMeACoffeeContract.connect(buyer).buyCoffee('Bob', 'Thanks for the work', {value: COFFEE_PRICE});
      await buyCoffeeTx.wait();
      balanceContractBefore = await ethers.provider.getBalance(buyMeACoffeeContract.address);
      balanceDeployerBefore = await ethers.provider.getBalance(deployer.address);
      const withdrawTx = await buyMeACoffeeContract.withdrawFunds();
      const withdrawTxReceipt = await withdrawTx.wait();
      gasPaid = withdrawTxReceipt.gasUsed.mul(withdrawTxReceipt.effectiveGasPrice);
    })
    it('Should set the balance of the contract to zero', async () => {
      const balanceContractAfter = await ethers.provider.getBalance(buyMeACoffeeContract.address);
      expect(balanceContractAfter).to.eq('0')
    })
    it('Should add the funds to the owner address', async () => {
      const balanceDeployerAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceDeployerAfter).to.eq(balanceDeployerBefore.add(balanceContractBefore).sub(gasPaid))
    })
  })

})
