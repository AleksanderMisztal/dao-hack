// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {DataTypes} from '../libraries/DataTypes.sol';
import {LensHub} from '../core/LensHub.sol';
import {ReactionsModule} from '../core/modules/reference/ReactionsModule.sol';
import {AuctionCollectModule} from '../core/modules/collect/AuctionCollectModule.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ProfileHolder is ERC721 {
    using SafeERC20 for IERC20;

    LensHub lensHub;
    address currency;
    address lensHubAddress;
    address auctionCollectModuleAddress;
    address emptyCollectModuleAddress;
    address referenceModuleAddress;
    address followModuleAddress;

    address owner;

    uint256 public profileId; //lens protocol does not mint NFTs with 0, it's used to signify an uninitialized variable.
    string public handle;

    string RequestPostURI;
    string chosenNewsURI;
    uint256 lastPostTime;
    uint256 postCooldown;

    //NFTs:
     using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("FakeNews DAO", "FD") public {
    }

    function awardItem(address recipient, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
    //NFTS

    //PROPOSALS:
    using SafeMath for uint256;
    uint public constant ELECTION_DEADLINE = 1606249800; //1604448000
    string constant TOKEN_URI = "https://ropsten.etherscan.io/tx/";

    // OZ access control
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");

    // Events
    event Voted(uint propNumber, address indexed voter, uint256 newNFT);
    event ChangedVote(uint propNumber, address indexed voter);

    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        bool hasChangedVote; // user can change vote only once
        address delegate; // person delegated to
        uint vote;   // index of the voted proposal
    }

    struct Proposal {
        string news;   // short name
        uint voteCount; // number of accumulated votes
    }

    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    /// Create a new ballot to choose one of proposal News.
    constructor() public {
        _setupRole(ADMIN_ROLE, _msgSender());
        _setupRole(VOTER_ROLE, _msgSender());
        voters[_msgSender()].weight = 1;

        proposals.push(Proposal({news: "COVID19 - COVID19 killed 190.033.2212 people", voteCount: 0}));
        proposals.push(Proposal({news: "FOOTBALL - Inter have won the world championship in 2006", voteCount: 0}));
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, _msgSender()), "DOES_NOT_HAVE_ADMIN_ROLE");
        _;
    }

    modifier onlyVoter() {
        require(hasRole(VOTER_ROLE, _msgSender()), "DOES_NOT_HAVE_VOTER_ROLE");
        _;
    }

    /**
     * @dev Give `voter` the right to vote on this ballot.
     * @param voter address to grant voting access
     */
    function giveRightToVote(address voter) public onlyAdmin {
        require(!voters[voter].voted, "Address has already voted");
        voters[voter].weight = 1;
        _setupRole(VOTER_ROLE, voter);
    }

    /**
     * @dev Delegate to `to` the weight of another valid voter's vote
     * @param to delegate address
     */
    function delegateVote(address to) public onlyVoter {
        // Check that addr delegate has right to vote
        require(hasRole(VOTER_ROLE, to), "DOES_NOT_HAVE_VOTER_ROLE");

        Voter storage sender = voters[_msgSender()];
        require(!sender.voted, "Address has already voted");

        // Forward the delegation if `to` also delegated.
        while (voters[to].delegate != address(0) &&
            voters[to].delegate != _msgSender()) {
            to = voters[to].delegate;
        }

        require(to != _msgSender(), "Delegation can not be to self");

        // Update `sender`
        sender.voted = true;
        sender.delegate = to;

        Voter storage delegate = voters[to];
        if (delegate.voted) {
            // If delegate already voted, directly add to the number of votes
            proposals[delegate.vote].voteCount += sender.weight;
            // Add sender weight to delegate as well in case delegate changes vote
            delegate.weight += sender.weight;
            emit Voted(delegate.vote, _msgSender(), 0); //not rewarding NFT for delegation
        } else {
            // If delegate did not vote yet, add to weight.
            delegate.weight += sender.weight;
        }
    }

    /**
     * @dev Vote on a given proposal
     * @param proposal number of proposal
     */
    function vote(uint proposal) public onlyVoter {
        require(now < ELECTION_DEADLINE, "Voting deadline has expired");
        Voter storage sender = voters[_msgSender()];
        require(!sender.voted, "Address has already voted");
        // Only two choices in the election
        require(proposal < 2, "Invalid proposal number");

        sender.voted = true;
        sender.vote = proposal;

        proposals[proposal].voteCount += sender.weight;
        //Reward proposer with NFT
        uint256 NFT_ID = awardItem(_msgSender(), TOKEN_URI);
        emit Voted(proposal, _msgSender(), NFT_ID);
    }

   

        // Add vote to new proposal
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;
        sender.hasChangedVote = true;
        emit ChangedVote(proposal, _msgSender());
    }

    /**
     * @dev Computes then returns the winning proposal, taking all previous votes into account.
     */
    function winningProposal() internal view returns (uint) {
        uint winningVoteCount = 0;
        uint wProposal;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                wProposal = p;
            }
        }
        return wProposal;
    }

    /**
     * @dev Calls winningProposal() function to get the index of winner and then returns the News
     */
    function winnerNews() public view returns (string memory) {
        require(now > ELECTION_DEADLINE, "Have not reached election deadline");
        return proposals[winningProposal()].news;
    }

    /**
     * @dev Gets current vote count of a given proposal
     * @return uint current vote count
     */
    function getProposalVoteCount(uint proposal) public view returns (uint) {
        return proposals[proposal].voteCount;
    }

    /**
     * @dev Check if a given address has voted
     * @return bool has the address voted
     */
    function hasAddressVoted(address voter) public view returns (bool) {
        return voters[voter].voted;
    }
    //PROPOSALS








    modifier onlyOwner() {
        require(msg.sender == owner, 'Forbidden');
        _;
    }

    modifier onlyOnceCreated() {
        require(profileId != 0, 'No profile has been created');
        _;
    }

    modifier onlyMember() {
        require(true); // TODO
        _;
    }

    constructor(
        address _LensHub,
        address _currency,
        address _auctionCollectModule,
        address _emptyCollectModule,
        address _referenceModule,
        address _followModule,
        uint256 _postCooldown,
        string memory _handle
    ) {
        owner = msg.sender;
        lensHubAddress = _LensHub;
        currency = _currency;
        auctionCollectModuleAddress = _auctionCollectModule;
        emptyCollectModuleAddress = _emptyCollectModule;
        referenceModuleAddress = _referenceModule;
        followModuleAddress = _followModule;
        lensHub = LensHub(lensHubAddress);
        handle = _handle;
        postCooldown = _postCooldown;
        lastPostTime = 0;
        profileId = 0;
    }

    function createProfile() public onlyOwner {
        require(profileId == 0, 'The profile has already been created');
        uint256 membershipFee = 1e18;
        lensHub.createProfile(
            DataTypes.CreateProfileData(
                address(this),
                handle,
                'https://gijn.org/wp-content/uploads/2018/08/Fact-checking-fakes1.png', 
                followModuleAddress,
                abi.encode(membershipFee, currency, address(this)),
                'https://gijn.org/wp-content/uploads/2018/08/Fact-checking-fakes1.png'
            )
        );
        profileId = lensHub.getProfileIdByHandle(handle);
        _postPrivatePostRequest();
    }

    //This need to be modify for our project.
    //using the reaction module for getting the news with more likes
    function _setPost() private onlyOnceCreated {
        ReactionsModule reactionsModule = ReactionsModule(referenceModuleAddress);
        uint256 pubId = lensHub.getPubCount(profileId);
        uint256 nRef = reactionsModule.getNumberOfReferences(profileId, pubId);

        uint256 winningNewsRefAuthor = 0;
        uint256 winningNewsRefId = 0;
        uint256 maxLikes = 0;
        for (uint256 i = 0; i < nRef; i++) {
            (uint256 refAuthor, uint256 refId) = reactionsModule.getReferences(profileId, pubId, i);
            uint256 nLikes = reactionsModule.getNumberOfReactions(
                refAuthor,
                refId,
                'reactions://like'
            );
            // In a tide, last News wins (got more likes in less time)
            if (nLikes >= maxLikes) {
                maxLikes = nLikes;
                winningNewsRefAuthor = refAuthor;
                winningNewsRefId = refId;
            }
        }

        if (winningNewsRefAuthor == 0 || winningNewsRefId == 0) {
            chosenNewsURI = '';
        } else {
            chosenNewsURI = lensHub.getContentURI(winningNewsRefAuthor, winningNewsRefId);
        }
    }
    
    function _postingPost(string _name) public{
        proposals.push(Proposal({news: _name, voteCount: 0}));
    }

    function _postPost() private onlyOnceCreated {
        lensHub.post(
            DataTypes.PostData(
                profileId,
                chosenNewsURI,
                auctionCollectModuleAddress, // auctionCollectModule
                abi.encode(currency, address(this), address(this)), // currency, receiver, auctioneer
                referenceModuleAddress,
                '' // referenceModuleData,
            )
        );
        lastPostTime = block.timestamp;
    }

    function _postPrivatePostRequest() private onlyOnceCreated {
        lensHub.post(
            DataTypes.PostData(
                profileId,
                RequestPostURI,
                emptyCollectModuleAddress, // emptyCollectModule, TODO
                '', // collectModuleData,
                referenceModuleAddress,
                '' // referenceModuleData,
            )
        );
    }

    function setRequestPostURI(string memory _newURI) public onlyOwner {
        RequestPostURI = _newURI;
    }

    // Chainlink Upkeep
    function checkUpkeep(bytes calldata checkData) public view returns (bool, bytes memory) {
        return (block.timestamp - lastPostTime > postCooldown, bytes(''));
    }

    function performUpkeep(bytes calldata performData) external {
        require(
            block.timestamp - lastPostTime > postCooldown,
            'Wait until the post cooldown is reached'
        );
        // Close the previous post's auction
        uint256 pubId = lensHub.getPubCount(profileId) - 1;
        if (pubId != 0) {
            AuctionCollectModule(auctionCollectModuleAddress).closeAuction(profileId, pubId);
        }
        _setPost();
        if (keccak256(abi.encode(chosenNewsURI)) != keccak256(abi.encode(''))) {
            _postPost(); // We're not posting empty publications
        }
        _postPrivatePostRequest();
    }

    // Setting addresses for modules
    function setAuctionCollectModuleAddress(address _newAddress) public onlyOwner {
        auctionCollectModuleAddress = _newAddress;
    }

    function setEmptyCollectModuleAddress(address _newAddress) public onlyOwner {
        emptyCollectModuleAddress = _newAddress;
    }

    function setFollowModuleAddress(address _newAddress) public onlyOwner {
        followModuleAddress = _newAddress;
    }

    function setReferenceModuleAddress(address _newAddress) public onlyOwner {
        referenceModuleAddress = _newAddress;
    }

    // Managing balance and withdrawal
    function currencyBalance() public view returns (uint256) {
        return IERC20(currency).balanceOf(address(this));
    }

    function withdrawFunds() external onlyOwner {
        IERC20(currency).transfer(owner, currencyBalance());
    } // TODO
}
