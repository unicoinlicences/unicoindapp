pragma solidity^0.5.0;

/// @title UniCoin smart contract
/// @author Chris Maree, Helda Mandlate, Luke Meiklejohn 

/// @dev import contracts from openzeppelin related to ownable and ERC20, ERC721 tokens
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";

/// @notice contract begins here
contract UnicoinRegistry is ERC721Metadata {
    /// @notice Creates a struct for users of the plaform, needs their Ethereum address and profile URL
    struct User {
        address owned_address;
        string profile_uri;
    }
    /// @notice Creates an array of users that a registered
    User[] public users;

    /// @notice The mapping below maps all users' addresses to their userID
    mapping (address => uint256) public userAddresses ;

    enum bidStatus {Pending, Accepted, Rejected, Sale, Cancelled}

    /// @notice Creates a struct for all bids, takes in the offer (amount of the bid), one of the enum parameters, publication Id and owner Id
    struct Bid {
        uint256 offer;
        bidStatus status;
        uint256 publication_Id;
        uint256 owner_Id; /// @dev owner of the bid
    }
    /// @notice Creates an array of bids that have been placed
    Bid[] public bids;

    /// @notice The mapping below maps all bidders' IDs to their userID
    mapping(uint256 => uint256[]) public bidOwners;

    /// @notice Creates a struct for all publications
    struct Publication {
        uint256 author_Id;
        string publication_uri;
        uint256[] publication_bids;
        bool isAuction;
        bool isRunning;
        uint256 sell_price;
        uint256[] contributors;
        uint256[] contributors_weightings;
    }
    /// @notice Creates an array of publications for every published document
    Publication[] public publications;
    
    /// @notice The mapping below will map the addresses of all the successful bidders' addresses to the ID of their owned publications
    mapping(uint256 => uint256[]) public publicationOwners;
    
    /// @notice Creates a struct for licencing
    struct LicenceDesign {
        uint256 buyer_Id;
        uint256 Publication_Id;
        uint256 bid_Id;
    }
    /// @notice Creates an array of purchased licences
    LicenceDesign[] public licences;
    /// @notice Mapping of licence Id to get the licence owners
    mapping(uint256 => uint256) public licenceOwners;
    /// @notice Mapping of licence Id to get the publication Id
    mapping(uint256 => uint256[]) public publicationLicences;

    /// @dev ERC20 is now daiContract
    ERC20 daiContract;
    /// @dev The constructor below reserves user 0 for all unregistered users
    constructor(address _daiContractAddress) public ERC721Metadata("UniCoin Licence", "UNIC"){
        users.push(User(address(0), ""));
        licences.push(LicenceDesign(0, 0, 0));

        daiContract = ERC20(_daiContractAddress);
    }

    /// @notice This function registers a user on the platform by taking in their profile URL
    /// @dev If the user's address is in position 0 of the userAddresses array, they are unregistered
    /// @dev Create an instance of the user and add the Id to their address
    function registerUser(string memory _profile_uri) public {
        require(bytes(_profile_uri).length > 0, "Profile URI should not be empty.");
       require(userAddresses[msg.sender]==0,"User already registered.");
        uint256 id = users.push(User(msg.sender,_profile_uri));
        userAddresses[msg.sender] = id - 1;
    }

    /// @notice This function creates a publication on the system, with blank arrays for publication bids and owners,
    /// @notice since no one has bidded for or bought a licence yet
    /// @dev The researcher only specifies the flat rate if they have chosen not to auction the work
    /// @dev Add instance to the respective arrays
    function createPublication(string memory _publication_uri, bool _isAuction, bool _isRunning, uint256 _sell_price, uint256[] memory _contributors, uint256[] memory _contributors_weightings) public {
        require(bytes(_publication_uri).length > 0, "Publication URI should not be empty.");
        require(userAddresses[msg.sender] != 0, "User address is not registered.");
        if(_isAuction) {
            require(_sell_price == 0, "Should not specify sell price for auction.");
        }
        else {
            require(_sell_price > 0, "Sell price not specified.");
        }
        uint256 _author_Id = userAddresses[msg.sender];
        uint256[] memory _publication_bids;
        Publication memory _publication = Publication(_author_Id, _publication_uri, _publication_bids, _isAuction, _isRunning, _sell_price, _contributors, _contributors_weightings);
        uint256 _id = publications.push(_publication);
        publicationOwners[_author_Id].push(_id - 1);
    }

    /// @notice This function creates a new bid for a particular publication
    /// @dev The bidder should only be able to submit a bid if the publication's pricing structure is an auction and the auction is running
    /// @dev By default the bid will have a status of Pending until it is accepted or rejected by the author
    /// @dev If the author has specified a flat rate, the buyer doesn't submit a bid but just sends the funds.
    /// @dev The funds sent should match the sale price specified by the author.
    /// @dev This 'bid' has a status of sale because the author does not need to evaluate and accept/reject these bids.
    /// @dev Transfer Dai from buyer to seller
    /// @dev parameters of licence design: buyer_id, publication id, bid_id
    function makeBid(uint256 _offer, uint256 _publication_Id) public {
        require(publications[_publication_Id].author_Id != 0, "Publication not enlisted.");
        require(userAddresses[msg.sender] != 0, "Bidder address is not registered.");
        if(publications[_publication_Id].isAuction) {
            require(publications[_publication_Id].isRunning, "Auction is not running.");
            uint256 _id = bids.push(Bid(_offer, bidStatus.Pending, _publication_Id, userAddresses[msg.sender]));
            publications[_publication_Id].publication_bids.push(_id - 1);
            bidOwners[userAddresses[msg.sender]].push(_id - 1);
        }
        if(!publications[_publication_Id].isAuction) {
            require(_offer == publications[_publication_Id].sell_price, "Incorrect funds sent.");
            uint256 _id = bids.push(Bid(_offer, bidStatus.Sale, _publication_Id, userAddresses[msg.sender])) - 1;
            publications[_publication_Id].publication_bids.push(_id);
            bidOwners[userAddresses[msg.sender]].push(_id);

            // require(daiContract.allowance(msg.sender, address(this)) >= _offer, "Insufficient fund allowance");
            // address publisherAddress = users[publications[_publication_Id].author_Id].owned_address;
            // daiContract.transferFrom(msg.sender, publisherAddress, _offer);

            uint256 _licence_Id = licences.push(LicenceDesign(bids[_id].owner_Id, _publication_Id, _id));
            licenceOwners[bids[_id].owner_Id] = _licence_Id;
            publicationLicences[_publication_Id].push(_licence_Id);
            _mint(users[bids[_id].owner_Id].owned_address, _licence_Id);
        }
    }
        
    /// @notice This function allows the auctioneer to accept the bids
    /// @dev parameters of licence design: buyer_id, publication id, bid_id
    /// @notice This function allows the auctioneer to reject the bids
    function acceptBid(uint256 _id) public {
        uint256 _publication_Id = bids[_id].publication_Id;
        require(userAddresses[msg.sender] == publications[_publication_Id].author_Id, "User not the author of this publication");
        require(publications[_publication_Id].isAuction, "Publication not an auction.");
        require(publications[_publication_Id].isRunning, "Auction is not running.");
        bids[_id].status = bidStatus.Accepted;
        
        uint256 _licence_Id = licences.push(LicenceDesign(bids[_id].owner_Id, _publication_Id, _id));
        licenceOwners[bids[_id].owner_Id] = _licence_Id;
        publicationLicences[_publication_Id].push(_licence_Id);
        _mint(users[bids[_id].owner_Id].owned_address, _licence_Id);
    }

    function rejectBid(uint256 _id) public {
        uint256 _publication_Id = bids[_id].publication_Id;
        require(userAddresses[msg.sender] == publications[_publication_Id].author_Id, "User not the author of this publication");
        require(publications[_publication_Id].isAuction, "Publication not an auction.");
        require(publications[_publication_Id].isRunning, "Auction not running.");
        bids[_id].status = bidStatus.Rejected;
    }

    /// @notice This function allows the auctioneer to cancel the bids
    function cancelBid(uint256 _id) public {
        uint256 _publication_Id = bids[_id].publication_Id;
        require(userAddresses[msg.sender] == publications[_publication_Id].author_Id, "User not the author of this publication");
        require(publications[_publication_Id].isAuction, "Publication not an auction.");
        require(publications[_publication_Id].isRunning, "Auction not running.");
        bids[_id].status = bidStatus.Cancelled;
    }
    
    /// @notice This function allows the auctioneer to change from an auction to a sale
    function changeToSale(uint256 _publication_Id, uint256 _sell_price) public {
        require(userAddresses[msg.sender] == publications[_publication_Id].author_Id, "User not the author of this publication");
        require(publications[_publication_Id].isAuction, "Publication is not an auction");
        publications[_publication_Id].sell_price = _sell_price;
        publications[_publication_Id].isAuction = false;
    }

    /// @notice This function allows the auctioneer to change from a sale to an auction
    function changeToAuction(uint256 _publication_Id) public {
        require(userAddresses[msg.sender] == publications[_publication_Id].author_Id, "User not the author of this publication");
        require(!publications[_publication_Id].isAuction, "Publication is already on auction");
        publications[_publication_Id].sell_price = 0;
        publications[_publication_Id].isAuction = true;
    }

    /// @notice This function allows the auctioneer to change the sell price
    function changeSellPrice(uint256 _publication_Id, uint256 _sell_price) public {
        require(userAddresses[msg.sender] == publications[_publication_Id].author_Id, "User not the author of this publication");
        require(!publications[_publication_Id].isAuction, "Publication is on auction.");
        publications[_publication_Id].sell_price = _sell_price;
    }
    /// @notice This function allows the auctioneer to change the running status
    function changeRunningStatus(uint256 _publication_Id) public {
        require(userAddresses[msg.sender] == publications[_publication_Id].author_Id, "User not the author of this publication");
        publications[_publication_Id].isRunning = !publications[_publication_Id].isRunning;
    }

    /// @return This function allows anyone to get the list of publications based on the address of the publisher
    function getPublications(address _address) public view returns(uint256[] memory) {
        uint256 _author_Id = userAddresses[_address];
        return publicationOwners[_author_Id];
    }

    /// @return This function allows anyone to get the list of bids based on address of the user
    function getBids(address _address) public view returns(uint256[] memory) {
        uint256 _userAddress = userAddresses[_address];
        return bidOwners[_userAddress];
    }

    // From the user ID, get a list of all publications owned by the user ()
    // function getPublications(uint256 _user_Id) public view returns(uint256[] memory) {
    //     return publicationOwners[_user_Id];
    // }

    // function getBids(uint256 _user_Id) public view returns(uint256[] memory) {
    //     return bidOwners[_user_Id];
    // }

    /// @return This function allows anyone to get list of bids per publication
    function getPublicationBids(uint256 _publication_Id) public view returns(uint256[] memory) {
        return publications[_publication_Id].publication_bids;
    }


    /// @return This function allows the return of the total number of publications
    function getPublicationLength() public view returns(uint count) {
        return publications.length;
    }

    function getPublication(uint256 _publication_Id) public view returns(uint256, string memory, uint256[] memory, bool, bool, uint256, uint256[] memory, uint256[] memory){
        Publication memory _publication = publications[_publication_Id];
        return (
        _publication.author_Id,
        _publication.publication_uri,
        _publication.publication_bids,
        _publication.isAuction,
        _publication.isRunning,
        _publication.sell_price,
        _publication.contributors,
        _publication.contributors_weightings);
    }

    function name() external view returns (string) {
        return tokenName;
    }

    function symbol() external view returns (string) {
        return tokenSymbol;
    }
}