# UniCoin Technical Architecture

This document outlines the technical design details of the UniCoin research marketplace. Smart contract design broken down, the overall technology stack is discussed and then dev-ops and server hosting is considered.

## High level design

Unicoin consists of four main components that build out the full technology stack.
1) Ethereum Smart contracts for fund processing and issuing of NFT licences.
2) IPFS for account management, chat and file storage
3) Orchid API to provide OffChain Account verification for publishers & companies
4) Dapp front end and landing page for publishers and companies

These four components come together to build out the full application. The diagram below outlines this design.

<img src="./images/HighLevelDesign.jpg">

## Smart contract design

The smart contracts implement price discovery logic for bid & offer creation and acceptance. They are also responsible for dealing with creation of NFT based licences. All smart contracts are written in Solidity and tested using Javascript tests with the Truffle testing framework.

### User, bidding and publication management

The smart contracts store information about all the users of the system apon creating an account. The process of registration is important to correctly vert the researches and companies to ensure that researches are indeed the authors of the content they are trying to monetize and that companies are indeed who they say they are. All details for a user account are stored on IPFS and the hash of the content is stored within the smart contract. Each user is given a unique user number which identifies their account. The only information stored on chain is an array of users and their associated IPFS `profile_url`.

```
struct User {
    address owned_address;
    string profile_url;
}
User[] public users;
mapping (address => uint256) public userAddresses ;
```

Bids are stored and processed within the smart contract. A buyer can create a bid to buy a licence for a paper and the researcher can choose whether or not to accept the bid. All payments happen through the smart contract and are processed using the Dai stablecoin. Instant payout to all contributors is therefore posible.

```
struct Bid {
    uint256 offer;
    bytes8 status;
    uint256 publication_Id;
    uint256 owner_Id;
}
Bid[] public bids;
mapping(uint256 => uint256) public bidOwners;
```

The ultimate vision sees the ability to attribute contributions to researchers that are not yet part of the platform. and they can retroactively login and claim their contributions. This process would also be stored within the smart contract.

Key information on each publication is also stored within the smart contract. As with the user profiles as much of the storage requirements as possible are delegated to IPFS through the `publication_url`. Diffrent bid configurations are also stored, such as if the auction is running, if it has a predefined sell price and who owns the publication.
```
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
```

### Non-Fungable token licences

Each licence is represented through the use of a non-fungible token (NFT). This makes each licence cryptographically unique. the NFT associates key information about that licences with the owner. For example, the price purchase, date and unique licence fingerprint. Using NFT's enables us to leverage existing standards such as Zepplin solidity which decreases the surface area of vulnerabilities within our application. Additionally NTFs enable transferability and interoperability with other platforms.

Note that when a licence NFT is created it is associated with exactly one seller and one buyer. The seller gives explicit consent for the buyer to use their Intellectual property in a commercial context. Of the company transfers this NFT to another wallet it does not mean that they've transferred the rights of the licence as it was created with permissions for one specific company to use. 

### Smart contract upgradability

Upgradability in smart contract systems is very important when considering the rapid iterative nature of the development process. To this end our architecture leverages ZeplinOS to provide upgradability. This makes the process of rolling out updates far easier than needing to roll our own upgradability system using eternal storage and proxy contracts.

## User profiles management and authentication

Every user within the system requires to register to preform a KYC process. This is delegated to existing academic publications such as [OrchID](<https://members.orcid.org/api/oauth/get-oauthauthorize>) and [arxiv](https://arxiv.org/). Upon registration and validation of profile legitimacy claim a [3box](https://3box.io/) account is created which is stored within [OrbitDB](https://github.com/orbitdb/orbit-db) on [IPFS](https://ipfs.io/).

OrchID has an auth0 based login system which we can leverage to attest the validity of researchers profiles. This process involves getting the researcher to login to their OrchID account and then attest ownership of an Ethereum wallet address. Once they’ve done this we link the two via 3box. 3box is a system for creating user profiles which are stored within OrbitDB (a no-sql like data store that is hosted on IPFS). When a publisher creates a new listing for research this will be associated with their Ethereum wallet, which in tern is associated with their 3box account and finally their OrchID. This process provides the platform with the ability to vet all publishers to ensure that they are indeed the creators of the content.

This account validation process occurs through an API which authenticates OrchID claims and interns makes a change within the smart contract to validate the user.

## IPFS storage for academic papers

Each and every paper is stored within our platform via IPFS. This is required in addition to existing hosting solutions like Arxiv as we require to embed a water mark onto of the publications to signify the licences pertaining to that specific academic research. 

## Front end technology stack

The front end application is built using Vuejs, material UI and web3.js.

## Hosting and Devops

Both the Front end and API are hosted on Zeit.co. CI is done through their built in CI solution. Cloudflare is used for DNS and CDN.

### 