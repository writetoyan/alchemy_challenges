// SPDX-License-Identifier: UNLICENSED

import '@openzeppelin/contracts/access/Ownable.sol';

pragma solidity ^0.8.9;

error BuyMeACoffee__AmountTooLow();
error BuyMeACoffee__WithdrawFailed();

contract BuyMeACoffee is Ownable {
    
    event newMemo (
        address indexed from,
        uint timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint timestamp;
        string name;
        string message;
    }

    uint immutable private COFFEE_PRICE;
    Memo[] public memos;

    constructor(uint _COFFEE_PRICE) {
        COFFEE_PRICE = _COFFEE_PRICE;
    }

    function getCoffeePrice() public view returns(uint) {
        return COFFEE_PRICE;
    }

    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }


    function buyCoffee(string memory _name, string memory _message) payable external{
        if(msg.value < COFFEE_PRICE) {
            revert BuyMeACoffee__AmountTooLow();
        }
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));
        emit newMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message);
    }

    function withdrawFunds() external onlyOwner{
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        if(!success) {
            revert BuyMeACoffee__WithdrawFailed();
        }
    }

}
