pragma solidity^0.5.0;
import "github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract UnicoinRegistry {
    // Creates a struct for users of the plaform. 
    struct User {
        address owned_address;
        string profile_url;
    }
    User[] public users;

    // The mapping below maps all users' addresses to their userID
    mapping (address => uint256) public userAddresses ;

    // Creates a struct for all bids.
    struct Bid {
        uint256 offer;
        bytes8 status;
        uint256 publication_Id;
        uint256 owner_Id;
    }
    Bid[] public bids;

    // The mapping below maps all bidders' addresses to their userID
    mapping(uint256 => uint256) public bidOwners;

    struct Publication {
        uint256 publication_Id;
        uint256 author_Id;
        string publication_url;
        // The array below will contain all bids received for that work.
        uint256[] publication_bids;
        // If the researcher has chosen the auction pricing structure, the below is TRUE.
        bool isAuction;
        // If the auction is still running, the below is TRUE, because the researcher can choose to stop the auction at any point.
        bool isRunning;
        // If both of the booleans above are FALSE, the price below is the flat sale price of the work.
        uint256 sell_price;
    }
    Publication[] public publications;
    
    // The mapping below will map the addresses of all the successful bidders' addresses to their userID
    mapping(address => uint256[]) public publicationOwners;
    
    // The constructer below reserves user 0 for all unregistered users.
    constructor() public {
        users.push(User(address(0),""));
    }

    // This function registers a user on the platform.
    function registerUser(string memory _profile_url) public {
        require(bytes(_profile_url).length > 0, "Profile URL should not be empty.");
        // If the user's address is in position 0 of the userAddresses array, they are unregistered. 
        require(userAddresses[msg.sender]==0,"User already registered.");
        uint256 id = users.push(User(msg.sender,_profile_url));
        userAddresses[msg.sender] = id - 1; 
    }

    // This function creates a publication on the system, with blank arrays for publication bids and owners, 
    // since no one has bidded for or bought a licence yet.
    function createPublication(string memory _publication_url, bool _isAuction, bool _isRunning, uint256 _sell_price) public {
        require(bytes(_publication_url).length > 0, "Publication URL should not be empty.");
        require(userAddresses[msg.sender] != 0, "User address is not registered.");
        // The researcher only specifies the flat rate if they have chosen not to auction the work.
        if(_isAuction) {
            require(_sell_price == 0, "Should not specify sell price for auction.");
        }
        else {
            require(_sell_price > 0, "Sell price not specified.");
        }
        uint256 _author_Id = userAddresses[msg.sender];
        uint256 _publication_Id = publications.length + 1;
        uint256[] memory _publication_bids;
        Publication memory _publication = Publication(_publication_Id, _author_Id, _publication_url, _publication_bids, _isAuction, _isRunning, _sell_price);
        uint256 _id = publications.push(_publication);
        publicationOwners[msg.sender].push(_id - 1);
    }
    
    // makeBid function hasn't been fully tested
    // This function creates a new bid for a particular publication.
    function makeBid(uint256 _offer, uint256 _publication_Id) public {
        require(publications[_publication_Id].author_Id != 0, "Publication not enlisted.");
        require(userAddresses[msg.sender] != 0, "Bidder address is not registered.");
        // The bidder should only be able to submit a bid if the publication's pricing structure is an auction and the auction is running
        if(publications[_publication_Id].isAuction) {
            require(publications[_publication_Id].isRunning, "Auction is not running.");
            // By default the bid will have a status of Pending until it is accepted or rejected by the author
            uint256 _id = bids.push(Bid(_offer, "Pending", _publication_Id, userAddresses[msg.sender]));
            publications[_publication_Id].publication_bids.push(_id - 1);
        }
        // If the author has specified a flat rate, the buyer doesn't submit a bid but just sends the funds.
        if(!publications[_publication_Id].isAuction) {
            // The funds sent should match the sale price specified by the author.
            require(_offer == publications[_publication_Id].sell_price, "Incorrect funds sent.");
            // This 'bid' has a status of sale because the author does not need to evaluate and accept/reject these bids.
            uint256 _id = bids.push(Bid(_offer, "Sale", _publication_Id, userAddresses[msg.sender]));
            publications[_publication_Id].publication_bids.push(_id - 1);
        }
        
    }

}
