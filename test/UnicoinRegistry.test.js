//tests helpers
const {
    EVMRevert
} = require('./helpers/EVMRevert');
const {
    assertRevert
} = require('./helpers/assertRevert');
const {
    sendTransaction
} = require('./helpers/sendTransaction');
const advanceBlock = require("./helpers/advanceToBlock");
const {
    increaseTimeTo,
    duration
} = require('./helpers/increaseTime');
const latestTime = require("./helpers/latestTime");
const _ = require("lodash");
const BigNumber = web3.BigNumber;

//libraries
require("chai")
    .use(require("chai-as-promised"))
    .use(require("chai-bignumber")(BigNumber))
    .should();

//contracts
const UnicoinRegistry = artifacts.require("./UnicoinRegistry.sol");
const Erc20 = artifacts.require("./ERC20.sol");

contract("Unicoin Registry", (accounts) => {
    const registryOwner = accounts[0]
    const tokenOwner = accounts[1]
    const publisher = accounts[2]
    const buyer = accounts[3]
    const randomAddress = accounts[4]

    const exampleUserProfileURI = "QmeWUs9YdymQVpsme3MLQdWFW5GjdM4XDFYMi3YJvUFiaq"
    const examplePublicationURI = "QmPF7eAtGoaEgSAt9XCP2DuWfc8sbtQfraffDsx3svu4Ph"

    const validPublication = {
        publication_uri: examplePublicationURI,
        isAuction: false,
        isRunning: true,
        sellPrice: 100,
        contributors: [1, 2, 3],
        contributorsWeighting: [20, 30, 20]
    }


    before(async function () {
        //deploy an instance of the registry


        //Creates ERC20s to use in testing
        daiContract = await Erc20.new({
            from: tokenOwner
        });

        //Mints tokens in a modified ERC20 for the fund
        await daiContract.mint(buyer, 100, {
            from: tokenOwner
        });

        let balance = await daiContract.balanceOf(buyer);

        //Checks that the balance of the fund is correct
        assert.equal(balance.toNumber(), 100, "Balance not set");
        registry = await UnicoinRegistry.new({
            from: registryOwner
        });

    });

    beforeEach(async function () {

    })
    context("Register User", function () {
        it("Can register a new user", async () => {
            await registry.registerUser(exampleUserProfileURI, {
                from: publisher
            })

            let userNumber = (await registry.userAddresses(publisher)).toNumber()
            assert(userNumber, 1, "Initial user number not set correctly")

            let addedUser = await registry.users(userNumber)
            assert(addedUser.owned_address, publisher, "Publisher address not set")
            assert(addedUser.profile_uri, exampleUserProfileURI, "Profile URI not set")
        });
        it("Reverts if invalid user added", async () => {
            //should fail if no user name added
            await assertRevert(registry.registerUser("", {
                from: publisher
            }), EVMRevert)

            //then check reverts if same user tries to register
            await assertRevert(registry.registerUser(exampleUserProfileURI, {
                from: publisher
            }), EVMRevert)
        });
    })
    context("Create Publication", function () {
        it("Can correctly add new publication", async () => {
            await registry.createPublication(validPublication.publication_uri,
                validPublication.isAuction,
                validPublication.isRunning,
                validPublication.sellPrice,
                validPublication.contributors,
                validPublication.contributorsWeighting, {
                    from: publisher
                })
            let publication = await registry.publications(0)

            assert(publication.author_Id.toNumber(), 1, "Author Id not set")
            assert(publication.publication_uri, examplePublicationURI, "Publication URI not set")
            assert(publication.isAuction == validPublication.isAuction, "isAuction not set")
            assert(publication.isRunning == validPublication.isRunning, "isRunning not set")
            assert(publication.sell_price.toNumber(), validPublication.sellPrice, "sellPrice not set")
        });

        it("Reverts if bad user input", async () => {
            // should revert if sale method is auction but a price is specified
            await assertRevert(registry.createPublication(validPublication.publication_uri,
                true, validPublication.isRunning, validPublication.sellPrice, validPublication.contributors, validPublication.contributorsWeighting, {
                    from: publisher
                }), EVMRevert)

            // should revert if sale method is flat price but no price specified
            await assertRevert(registry.createPublication(validPublication.publication_uri,
                validPublication.isAuction, validPublication.isRunning, 0, validPublication.contributors, validPublication.contributorsWeighting, {
                    from: publisher
                }), EVMRevert)

            // should revert if the uri is blank
            await assertRevert(registry.createPublication("",
                validPublication.isAuction, validPublication.isRunning, validPublication.sellPrice, validPublication.contributors, validPublication.contributorsWeighting, {
                    from: publisher
                }), EVMRevert)

            // should revert if user is unregistered
            await assertRevert(registry.createPublication("",
                validPublication.isAuction, validPublication.isRunning, validPublication.sellPrice, validPublication.contributors, validPublication.contributorsWeighting, {
                    from: randomAddress
                }), EVMRevert)
        });
    })

    context("Make a bid", function () {
        it("Can correctly create a bid", async () => {
            // register the buyer
            await registry.registerUser(exampleUserProfileURI, {
                from: buyer
            })

            // register the publication
            await registry.createPublication(validPublication.publication_uri,
                true,
                validPublication.isRunning,
                0,
                validPublication.contributors,
                validPublication.contributorsWeighting, {
                    from: publisher
                })
            let publication = await registry.publications(0)

            // make the bid
            await registry.makeBid(100, 0, {
                from: buyer
            })
            let bid = await registry.bids(0)

            assert(bid.offer.toNumber(), 100, "Bid price incorrect")
            assert(bid.status, "Pending", "Bid status incorrect")
            assert(bid.publication_Id, 0, "Publication ID incorrect")
            assert(bid.owner_Id, 1, "Buyer ID incorrect")

        });

        it("Can correctly make a sale", async () => {

            await registry.createPublication(validPublication.publication_uri,
                validPublication.isAuction,
                validPublication.isRunning,
                validPublication.sellPrice,
                validPublication.contributors,
                validPublication.contributorsWeighting, {
                    from: publisher
                })
            let publication = await registry.publications(1)

            await registry.makeBid(101, 1, {
                from: buyer
            })
            let bid = await registry.bids(1)

            // should now assert that status is sale
            assert(bid.offer.toNumber(), 101, "Bid price incorrect")
            assert(bid.status, "Sale", "Bid status incorrect")
            assert(bid.publication_Id, 1, "Publication ID incorrect")
            assert(bid.owner_Id, 1, "Buyer ID incorrect")
        })

        it("Reverts if bad user input", async () => {
            // if bids with a non-running auction
            await registry.createPublication(validPublication.publication_uri,
                validPublication.isAuction,
                false,
                validPublication.sellPrice,
                validPublication.contributors,
                validPublication.contributorsWeighting, {
                    from: publisher
                })
            let publication = await registry.publications(3)

            await assertRevert(registry.makeBid(101, 3), {
                from: buyer
            }, EVMRevert)

            // if sends incorrect funds to flat-rate publication
            await assertRevert(registry.makeBid(101, 0, {
                from: buyer
            }), EVMRevert)

            // if bidder is unregistered
            await assertRevert(registry.makeBid(100, 0, {
                from: randomAddress
            }), EVMRevert)

            // if publication isn't listed
            // need to do this - see line 83 of UnicoinRegistry.sol

        })
    })

    context("Accepting/rejecting/cancelling a bid", function () {
        it("Can accept a bid", async () => {
            await registry.acceptBid(1, {
                from: publisher
            })
            let bid = await registry.bids(1)
            assert(bid.status, "Accepted", "Bid status not changed")
            let nftTokenBalance = await registry.balanceOf(buyer)
            assert(nftTokenBalance.toNumber(), 1, "Token balance not set correctly")
        })

        it("Can reject a bid", async () => {
            await registry.createPublication(validPublication.publication_uri,
                true,
                true,
                0,
                validPublication.contributors,
                validPublication.contributorsWeighting, {
                    from: publisher
                })
            let publication = await registry.publications(4)
            await registry.makeBid(102, 4, {
                from: buyer
            })
            await registry.rejectBid(2, {
                from: publisher
            })
            let bid = await registry.bids(2)
            assert(bid.status, "Rejected", "Bid status not changed")
        })

        it("Can cancel a bid", async () => {
            await registry.createPublication(validPublication.publication_uri,
                true,
                true,
                0,
                validPublication.contributors,
                validPublication.contributorsWeighting, {
                    from: publisher
                })
            let publication = await registry.publications(5)
            await registry.makeBid(103, 5, {
                from: buyer
            })
            await registry.cancelBid(3, {
                from: publisher
            })
            let bid = await registry.bids(3)
            assert(bid.status, "Cancelled", "Bid status not changed")
        })

        it("Reverts if bad user input", async () => {
            await registry.createPublication(validPublication.publication_uri,
                false,
                true,
                100,
                validPublication.contributors,
                validPublication.contributorsWeighting, {
                    from: publisher
                })
            let publication = await registry.publications(6)
            await registry.makeBid(100, 6, {
                from: buyer
            })
            assertRevert(registry.acceptBid(3, {
                from: publisher
            }), EVMRevert)
            assertRevert(registry.rejectBid(3, {
                from: publisher
            }), EVMRevert)
            assertRevert(registry.cancelBid(3, {
                from: publisher
            }), EVMRevert)
        })
    })
    context("Changing a publications status", function () {
        it("Can reject a bid", async () => {
            await registry.createPublication(validPublication.publication_uri,
                true,
                true,
                0,
                validPublication.contributors,
                validPublication.contributorsWeighting, {
                    from: publisher
                })
            assert(true,true)
        })
    })
    
})