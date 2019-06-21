pragma solidity^0.5.0;
contract UnicoinRegistry {

    struct User {
        address owned_address;
        string profile_url;
    }
User[] users;

    struct Bid {
        uint256 offer;
        bytes8 status;
        uint256 publication_Id;
        uint256 owner_Id;
    }
    Bid[] bids;
    
    struct Publication {
        uint256 publication_Id;
        uint256 author_Id;
        string publication_url;
        uint256[] publication_bids;
    }
    Publication[] publications;
        
}