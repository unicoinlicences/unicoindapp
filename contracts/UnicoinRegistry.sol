pragma solidity^0.5.0;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract UnicoinRegistry is ERC721 {
    // Creates a struct for users of the plaform.
    struct User {
        address owned_address;
        string profile_uri;
    }
    User[] public users;

    // The mapping below maps all users' addresses to their userID
    mapping (address => uint256) public userAddresses ;

    enum bidStatus {Pending, Accepted, Rejected, Sale, Cancelled}

    // Creates a struct for all bids.
    struct Bid {
        uint256 offer;
        bidStatus status;
        uint256 publication_Id;
        uint256 owner_Id; //owner of the bid
    }
    Bid[] public bids;

    // The mapping below maps all bidders' IDs to their userID
    mapping(uint256 => uint256[]) public bidOwners;

    struct Publication {
        uint256 author_Id;
        string publication_uri;
        // The array below will contain all bids received for that work.
        uint256[] publication_bids;
        // If the researcher has chosen the auction pricing structure, the below is TRUE.
        bool isAuction;
        // If the auction is still running, the below is TRUE, because the researcher can choose to stop the auction at any point.
        bool isRunning;
        // If both of the booleans above are FALSE, the price below is the flat sale price of the work.
        uint256 sell_price;
        uint256[] contributors;
        uint256[] contributors_weightings;
    }
    Publication[] public publications;
    
    // The mapping below will map the addresses of all the successful bidders' addresses to the ID of their owned publications
    mapping(uint256 => uint256[]) public publicationOwners;
    
    struct LicenceDesign {
        uint256 buyer_Id;
        uint256 Publication_Id;
        uint256 bid_Id;
    }

    LicenceDesign[] public licences;
    mapping(uint256 => uint256) public licenceOwners;
    mapping(uint256 => uint256[]) public publicationLicences;

    // The constructer below reserves user 0 for all unregistered users.
    constructor() public ERC721(){
        users.push(User(address(0),""));
    }

    // This function registers a user on the platform.
    function registerUser(string memory _profile_uri) public {
        require(bytes(_profile_uri).length > 0, "Profile URI should not be empty.");
        // If the user's address is in position 0 of the userAddresses array, they are unregistered.
        require(userAddresses[msg.sender]==0,"User already registered.");
        uint256 id = users.push(User(msg.sender,_profile_uri));
        userAddresses[msg.sender] = id - 1;
    }

    // This function creates a publication on the system, with blank arrays for publication bids and owners,
    // since no one has bidded for or bought a licence yet.
    function createPublication(string memory _publication_uri, bool _isAuction, bool _isRunning, uint256 _sell_price, uint256[] memory _contributors, uint256[] memory _contributors_weightings) public {
        require(bytes(_publication_uri).length > 0, "Publication URI should not be empty.");
        require(userAddresses[msg.sender] != 0, "User address is not registered.");
        // The researcher only specifies the flat rate if they have chosen not to auction the work.
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

    // This function creates a new bid for a particular publication.
    function makeBid(uint256 _offer, uint256 _publication_Id) public {
        require(publications[_publication_Id].author_Id != 0, "Publication not enlisted.");
        require(userAddresses[msg.sender] != 0, "Bidder address is not registered.");
        // The bidder should only be able to submit a bid if the publication's pricing structure is an auction and the auction is running
        if(publications[_publication_Id].isAuction) {
            require(publications[_publication_Id].isRunning, "Auction is not running.");
            // By default the bid will have a status of Pending until it is accepted or rejected by the author
            uint256 _id = bids.push(Bid(_offer, bidStatus.Pending, _publication_Id, userAddresses[msg.sender]));
            publications[_publication_Id].publication_bids.push(_id - 1);
            bidOwners[userAddresses[msg.sender]].push(_id - 1);
        }
        // If the author has specified a flat rate, the buyer doesn't submit a bid but just sends the funds.
        if(!publications[_publication_Id].isAuction) {
            // The funds sent should match the sale price specified by the author.
            require(_offer == publications[_publication_Id].sell_price, "Incorrect funds sent.");
            // This 'bid' has a status of sale because the author does not need to evaluate and accept/reject these bids.
            uint256 _id = bids.push(Bid(_offer, bidStatus.Sale, _publication_Id, userAddresses[msg.sender]));
            publications[_publication_Id].publication_bids.push(_id - 1);
            bidOwners[userAddresses[msg.sender]].push(_id - 1);
        }
    }
        
    // This function allows the auctioneer to accept the bids
    function acceptBid(uint256 _id) public {
        uint256 _publication_Id = bids[_id].publication_Id;
        require(publications[_publication_Id].isAuction, "Publication not an auction.");
        require(publications[_publication_Id].isRunning, "Auction is not running.");
        bids[_id].status = bidStatus.Accepted;
        
        //buyer_id, publication id, bid_id
        uint256 _licence_Id = licences.push(LicenceDesign(bids[_id].owner_Id, _publication_Id, _id));
        licenceOwners[bids[_id].owner_Id] = _licence_Id;
        publicationLicences[_publication_Id].push(_licence_Id);
        _mint(users[bids[_id].owner_Id].owned_address, _licence_Id);
    }

    // This function allows the auctioneer to reject the bids
    function rejectBid(uint256 _id) public {
        uint256 _publication_Id = bids[_id].publication_Id;
        require(publications[_publication_Id].isAuction, "Publication not an auction.");
        require(publications[_publication_Id].isRunning, "Auction not running.");
        bids[_id].status = bidStatus.Rejected;
    }

    // This function allows the auctioneer to cancel the bids
    function cancelBid(uint256 _id) public {
        uint256 _publication_Id = bids[_id].publication_Id;
        require(publications[_publication_Id].isAuction, "Publication not an auction.");
        require(publications[_publication_Id].isRunning, "Auction not running.");
        bids[_id].status = bidStatus.Cancelled;
    }
    
    function changeToSale(uint256 _publication_Id, uint256 _sell_price) public {
        require(publications[_publication_Id].isAuction, "Publication is not an auction");
        publications[_publication_Id].sell_price = _sell_price;
        publications[_publication_Id].isAuction = false;
    }
   
    function changeToAuction(uint256 _publication_Id) public {
        require(!publications[_publication_Id].isAuction, "Publication is already on auction");
        publications[_publication_Id].sell_price = 0;
        publications[_publication_Id].isAuction = true;
    }

    function changeSellPrice(uint256 _publication_Id, uint256 _sell_price) public {
        require(!publications[_publication_Id].isAuction, "Publication is on auction.");
        publications[_publication_Id].sell_price = _sell_price;
    }

    function changeRunningStatus(uint256 _publication_Id) public {
        publications[_publication_Id].isRunning = !publications[_publication_Id].isRunning;
    }

    function getPublications(address _address) public view returns(uint256[] memory) {
        uint256 _author_Id = userAddresses[_address];
        return publicationOwners[_author_Id];
    }

    function getBids(address _address) public view returns(uint256[] memory) {
        uint256 _userAddress = userAddresses[_address];
        return bidOwners[_userAddress];
    }

    function getPublications(uint256 _user_Id) public view returns(uint256[] memory) {
        return publicationOwners[_user_Id];
    }

    function getBids(uint256 _user_Id) public view returns(uint256[] memory) {
        return bidOwners[_user_Id];
    }

    function getPublicationBids(uint256 _publication_Id) public view returns(uint256[] memory) {
        return publications[_publication_Id].publication_bids;
    }
}
