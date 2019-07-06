pragma solidity^0.5.0;
import "github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract UnicoinRegistry {

    struct User {
        address owned_address;
        string profile_url;
    }
    User[] public users;
    mapping (address => uint256) public userAddresses ;

    struct Bid {
        uint256 offer;
        bytes8 status;
        uint256 publication_Id;
        uint256 owner_Id;
    }
    Bid[] public bids;
    mapping(uint256 => uint256) public bidOwners;

    struct Publication {
        uint256 publication_Id;
        uint256 author_Id;
        string publication_url;
        uint256[] publication_bids;
        bool isAuction;
        bool isRunning;
        uint256 sell_price;
    }
    Publication[] public publications;
    
    mapping(address => uint256[]) public publicationOwners;
    
    constructor() public {
        users.push(User(address(0),""));
    }

    function registerUser(string memory _profile_url) public {
        require(bytes(_profile_url).length > 0, "Profile URL should not be empty.");
        require(userAddresses[msg.sender]==0,"User already registered.");
        uint256 id = users.push(User(msg.sender,_profile_url));
        userAddresses[msg.sender] = id - 1; 
    }

    function createPublication(string memory _publication_url, bool _isAuction, bool _isRunning, uint256 _sell_price) public {
        require(bytes(_publication_url).length > 0, "Publication URL should not be empty.");
        require(userAddresses[msg.sender] != 0, "User address is not registered.");
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
    function makeBid(uint256 _offer, uint256 _publication_Id) public {
        require(publications[_publication_Id].author_Id != 0, "Publication not enlisted.");
        require(userAddresses[msg.sender] != 0, "Bidder address is not registered.");
        if(publications[_publication_Id].isAuction) {
            require(publications[_publication_Id].isRunning, "Auction is not running.");
            uint256 _id = bids.push(Bid(_offer, "Pending", _publication_Id, userAddresses[msg.sender]));
            publications[_publication_Id].publication_bids.push(_id - 1);
        }
        if(!publications[_publication_Id].isAuction) {
            require(_offer == publications[_publication_Id].sell_price, "Incorrect funds sent.");
            uint256 _id = bids.push(Bid(_offer, "Sale", _publication_Id, userAddresses[msg.sender]));
            publications[_publication_Id].publication_bids.push(_id - 1);
        }
        
    }

}
