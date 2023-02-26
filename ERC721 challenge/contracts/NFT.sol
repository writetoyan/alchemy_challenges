// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error NFT__AllTokenHaveBeenMinted();
error NFT__MaxTokenAlreadyMinted();

contract NFT is ERC721, ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint public MAX_SUPPLY;
    uint public MAX_MINT;
    mapping (address => uint) public maxMintAddress;

    constructor(string memory _name, string memory _symbol, uint _MAX_SUPPLY, uint _MAX_MINT) ERC721(_name, _symbol) {
        MAX_SUPPLY = _MAX_SUPPLY;
        MAX_MINT = _MAX_MINT;
    }

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        if(tokenId >= MAX_SUPPLY) {
            revert NFT__AllTokenHaveBeenMinted();
        }
        if(maxMintAddress[to] >= MAX_MINT) {
            revert NFT__MaxTokenAlreadyMinted();
        }
        maxMintAddress[to] += 1;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
