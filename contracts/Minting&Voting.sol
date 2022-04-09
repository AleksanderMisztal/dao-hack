// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.0 (proxy/transparent/TransparentUpgradeableProxy.sol)

pragma solidity ^0.8.0;

import {DataTypes} from './libraries/DataTypes.sol';
import {LensHub} from './core/LensHub.sol';
import {ReactionsModule} from './core/modules/reference/ReactionsModule.sol';
import {AuctionCollectModule} from './core/modules/collect/AuctionCollectModule.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

contract Minter is ProfileHolder {


  constructor() ERC721("Social DAO", "SD") {}


  using Counters for Counters.Counter;
  
  using Strings for uint256;
  
  Counters.Counter _tokenIds;
  
  

  struct RenderNFT {
    string uri;
  }
  
  mapping(uint256 => RenderNFT) _tokenDetails;
  mapping(address => uint256) public nftHolderCount;
  mapping(uint256 => address) public nftToHolder;

  

  function mint(string memory uri, uint hp, uint attackDamage) public returns (uint256) {
    uint256 newId = _tokenIds.current();
    _tokenDetails[newId] = RenderNFT(uri, hp, attackDamage);
    nftHolderCount[msg.sender] = nftHolderCount[msg.sender] + 1;
    nftToHolder[newId] = msg.sender;
    _mint(msg.sender, newId);
    _setTokenURI(newId, uri);
    _tokenIds.increment();
    return newId;
  }


  function getNFTsByOwner(address _owner) external view returns(uint[] memory) {
        uint256 lastestId = _tokenIds.current();
        uint[] memory result = new uint[](nftHolderCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < lastestId; i++) {
        if (nftToHolder[i] == _owner) {
            result[counter] = i;
            counter++;
        }
        }
        return result;
  }


  function getNFTsById(uint256 _tokenId) public view returns(RenderNFT memory){

      return _tokenDetails[_tokenId];
  }}


}