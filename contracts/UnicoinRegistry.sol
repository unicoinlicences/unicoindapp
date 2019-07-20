pragma solidity^0.5.0;

/// @title UniCoin smart contract
/// @author Chris Maree, Helda Mandlate, Luke Meiklejohn 

/// @dev import contracts from openzeppelin related to ownable and ERC20, ERC721 tokens
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

/// @notice contract begins here
contract UnicoinRegistry is ERC721 {
    /// @notice Creates a struct for users of the plaform, needs their Ethereum address and profile URL
    struct User {
        address owned_address;
        string profile_uri;
    }
    /// @notice Creates an array of users that a registered
    User[] public users;

    /// @notice The mapping below maps all users' addresses to their userID
    mapping (address => uint256) public userAddresses ;

    /// @param Creates user defined type
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
        /// @dev The array below will contain all bids received for that work.
        uint256[] publication_bids;
        /// @dev If the researcher has chosen the auction pricing structure, the below is TRUE.
        bool isAuction;
        /// @dev If the auction is still running, the below is TRUE, because the researcher can choose to stop the auction at any point.
        bool isRunning;
        /// @dev If both of the booleans above are FALSE, the price below is the flat sale price of the work.
        uint256 sell_price;
        /// @dev The value of the publication
        uint256[] contributors;
        /// @dev The co-authors/ contributors of the publication
        uint256[] contributors_weightings;
        /// @dev The contributor's respective weighting contributions
    }
    /// @notice Creates an array of publications for every published document
    Publication[] public publications;
    
    /// @notice The mapping below will map the addresses of all the successful bidders' addresses to the ID of their owned publications
    mapping(uint256 => uint256[]) public publicationOwners;
    
    /// @notice Creates a struct for licencing
    struct LicenceDesign {
        uint256 buyer_Id;
        /// @dev Id of each publication's buyer
        uint256 Publication_Id;
        /// @dev Id of the publication being bought
        uint256 bid_Id;
        /// @dev The bid's Id for the publication
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
    constructor(address _daiContractAddress) public ERC721(){
        users.push(User(address(0),""));
        daiContract = ERC20(_daiContractAddress);
    }

    /// @notice This function registers a user on the platform by taking in their profile URL
    function registerUser(string memory _profile_uri) public {
        require(bytes(_profile_uri).length > 0, "Profile URI should not be empty.");
        /// @dev If the user's address is in position 0 of the userAddresses array, they are unregistered
        require(userAddresses[msg.sender]==0,"User already registered.");
        /// @dev Create an instance of the user and add the Id to their address
        uint256 id = users.push(User(msg.sender,_profile_uri));
        userAddresses[msg.sender] = id - 1;
    }

    /// @notice This function creates a publication on the system, with blank arrays for publication bids and owners,
    /// @notice since no one has bidded for or bought a licence yet
    function createPublication(string memory _publication_uri, bool _isAuction, bool _isRunning, uint256 _sell_price, uint256[] memory _contributors, uint256[] memory _contributors_weightings) public {
        require(bytes(_publication_uri).length > 0, "Publication URI should not be empty.");
        require(userAddresses[msg.sender] != 0, "User address is not registered.");
        /// @dev The researcher only specifies the flat rate if they have chosen not to auction the work
        if(_isAuction) {
            require(_sell_price == 0, "Should not specify sell price for auction.");
        }
        else {
            require(_sell_price > 0, "Sell price not specified.");
        }
        /// @dev Add instance to the respective arrays
        uint256 _author_Id = userAddresses[msg.sender];
        uint256[] memory _publication_bids;
        Publication memory _publication = Publication(_author_Id, _publication_uri, _publication_bids, _isAuction, _isRunning, _sell_price, _contributors, _contributors_weightings);
        uint256 _id = publications.push(_publication);
        publicationOwners[_author_Id].push(_id - 1);
    }

    /// @notice This function creates a new bid for a particular publication
    function makeBid(uint256 _offer, uint256 _publication_Id) public {
        require(publications[_publication_Id].author_Id != 0, "Publication not enlisted.");
        require(userAddresses[msg.sender] != 0, "Bidder address is not registered.");
        /// @dev The bidder should only be able to submit a bid if the publication's pricing structure is an auction and the auction is running
        if(publications[_publication_Id].isAuction) {
            require(publications[_publication_Id].isRunning, "Auction is not running.");
            /// @dev By default the bid will have a status of Pending until it is accepted or rejected by the author
            uint256 _id = bids.push(Bid(_offer, bidStatus.Pending, _publication_Id, userAddresses[msg.sender]));
            publications[_publication_Id].publication_bids.push(_id - 1);
            bidOwners[userAddresses[msg.sender]].push(_id - 1);
        }
        /// @dev If the author has specified a flat rate, the buyer doesn't submit a bid but just sends the funds.
        if(!publications[_publication_Id].isAuction) {
            /// @dev The funds sent should match the sale price specified by the author.
            require(_offer == publications[_publication_Id].sell_price, "Incorrect funds sent.");
            /// @dev This 'bid' has a status of sale because the author does not need to evaluate and accept/reject these bids.
            uint256 _id = bids.push(Bid(_offer, bidStatus.Sale, _publication_Id, userAddresses[msg.sender])) - 1;
            publications[_publication_Id].publication_bids.push(_id);
            bidOwners[userAddresses[msg.sender]].push(_id);

            /// @dev Transfer Dai from buyer to seller
            // require(daiContract.allowance(msg.sender, address(this)) >= _offer, "Insufficient fund allowance");
            // address publisherAddress = users[publications[_publication_Id].author_Id].owned_address;
            // daiContract.transferFrom(msg.sender, publisherAddress, _offer);

            /// @dev parameters of licence design: buyer_id, publication id, bid_id
            uint256 _licence_Id = licences.push(LicenceDesign(bids[_id].owner_Id, _publication_Id, _id));
            licenceOwners[bids[_id].owner_Id] = _licence_Id;
            publicationLicences[_publication_Id].push(_licence_Id);
            _mint(users[bids[_id].owner_Id].owned_address, _licence_Id);
        }
    }
        
    /// @notice This function allows the auctioneer to accept the bids
    function acceptBid(uint256 _id) public {
        uint256 _publication_Id = bids[_id].publication_Id;
        require(userAddresses[msg.sender] == publications[_publication_Id].author_Id, "User not the author of this publication");
        require(publications[_publication_Id].isAuction, "Publication not an auction.");
        require(publications[_publication_Id].isRunning, "Auction is not running.");
        bids[_id].status = bidStatus.Accepted;
        
        /// @dev parameters of licence design: buyer_id, publication id, bid_id
        uint256 _licence_Id = licences.push(LicenceDesign(bids[_id].owner_Id, _publication_Id, _id));
        licenceOwners[bids[_id].owner_Id] = _licence_Id;
        publicationLicences[_publication_Id].push(_licence_Id);
        _mint(users[bids[_id].owner_Id].owned_address, _licence_Id);
    }

    /// @notice This function allows the auctioneer to reject the bids
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
    
}