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

    struct Publication {
        uint256 publication_Id;
        uint256 author_Id;
        string publication_url;
        uint256[] publication_bids;
    }
    Publication[] public publications;
    
    constructor() public {
        users.push(User(address(0),""));
    }

    function registerUser(string memory _profile_url) public {
        require(bytes(_profile_url).length > 0, "Profile URL should not be empty.");
        require(userAddresses[msg.sender]==0,"User already registered.");
        uint256 id = users.push(User(msg.sender,_profile_url));
        userAddresses[msg.sender] = id - 1; 
    }

    function createPublication(string memory _publication_url) public {
        require(bytes(_publication_url).length > 0, "Publication URL should not be empty.");
        require(userAddresses[msg.sender] != 0, "User address is not registered.");
        uint256 _author_Id = userAddresses[msg.sender];
        uint256 _publication_Id = publications.length + 1;
        uint256[] memory _publication_bids;
        Publication memory _publication = Publication(_publication_Id, _author_Id, _publication_url, _publication_bids);
        publications.push(_publication);
    }

}
