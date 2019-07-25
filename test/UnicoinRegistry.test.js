// Tests helpers
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

// Libraries
require("chai")
    .use(require("chai-as-promised"))
    .use(require("chai-bignumber")(BigNumber))
    .should();

// Contracts
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

    // Initialize publication and bid counts
    let noPublications = 0;
    let noBids = 0;

    before(async function () {
        // Deploy an instance of the registry
        // Creates ERC20s to use in testing
        daiContract = await Erc20.new({
            from: tokenOwner
        });

        // Mints tokens in a modified ERC20 for the fund
        await daiContract.mint(buyer, 10000, {
            from: tokenOwner
        });

        let balance = await daiContract.balanceOf(buyer);
        // Checks that the balance of the fund is correct
        assert.equal(balance.toNumber(), 10000, "Balance not set");
        registry = await UnicoinRegistry.new(daiContract.address, {
            from: registryOwner
        });

    });

    beforeEach(async function () {

    })
    // Tests correct registration of users
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
            // Should fail if no user name added
            await assertRevert(registry.registerUser("", {
                from: publisher
            }), EVMRevert)

            // Then check reverts if same user tries to register
            await assertRevert(registry.registerUser(exampleUserProfileURI, {
                from: publisher
            }), EVMRevert)
        });
    })

    //Tests correct creation of publications
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
            noPublications += 1;
            let publication = await registry.publications(noPublications - 1)

            assert(publication.author_Id.toNumber(), 1, "Author Id not set")
            assert(publication.publication_uri, examplePublicationURI, "Publication URI not set")
            assert(publication.isAuction == validPublication.isAuction, "isAuction not set")
            assert(publication.isRunning == validPublication.isRunning, "isRunning not set")
            assert(publication.sell_price.toNumber(), validPublication.sellPrice, "sellPrice not set")

            let allPublicationInfo = await registry.getPublication(noPublications - 1)
            // console.log("HERE")
            // console.log(allPublicationInfo)

        });

        it("Reverts if bad user input", async () => {
            // Should revert if sale method is auction but a price is specified
            await assertRevert(registry.createPublication(validPublication.publication_uri,
                true, validPublication.isRunning, validPublication.sellPrice, validPublication.contributors, validPublication.contributorsWeighting, {
                    from: publisher
                }), EVMRevert)

            // Should revert if sale method is flat price but no price specified
            await assertRevert(registry.createPublication(validPublication.publication_uri,
                validPublication.isAuction, validPublication.isRunning, 0, validPublication.contributors, validPublication.contributorsWeighting, {
                    from: publisher
                }), EVMRevert)

            // Should revert if the uri is blank
            await assertRevert(registry.createPublication("",
                validPublication.isAuction, validPublication.isRunning, validPublication.sellPrice, validPublication.contributors, validPublication.contributorsWeighting, {
                    from: publisher
                }), EVMRevert)

            // Should revert if user is unregistered
            await assertRevert(registry.createPublication("",
                validPublication.isAuction, validPublication.isRunning, validPublication.sellPrice, validPublication.contributors, validPublication.contributorsWeighting, {
                    from: randomAddress
                }), EVMRevert)
        });
    })

    // Tests for correct bid allocation
    context("Make a bid", function () {
        it("Can correctly create a bid", async () => {
            // Register the buyer
            await registry.registerUser(exampleUserProfileURI, {
                from: buyer
            })

            // Register the publication: publication 2 (index 1)
            await registry.createPublication(validPublication.publication_uri,
                true,
                validPublication.isRunning,
                0,
                validPublication.contributors,
                validPublication.contributorsWeighting, {
                    from: publisher
                })
            noPublications += 1;
            let publication = await registry.publications(noPublications - 1)

            // Make the bid
            await registry.makeBid(100, noPublications - 1, {
                from: buyer
            })
            noBids += 1;
            let bid = await registry.bids(noBids - 1)

            assert(bid.offer.toNumber(), 100, "Bid price incorrect")
            assert(bid.status, "Pending", "Bid status incorrect")
            assert(bid.publication_Id, noPublications - 1, "Publication ID incorrect")
            assert(bid.owner_Id, noBids - 1, "Buyer ID incorrect")

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
            // noPublications = 3
            noPublications += 1;
            let publication = await registry.publications(noPublications - 1)
            // Successfully mint a token
            let nftTokenBalance = await registry.balanceOf(buyer)

            // Increasing allowance
            await daiContract.approve(registry.address, 1000000, {
                from: buyer
            })

            let balanceBefore = await daiContract.balanceOf(buyer);
            // breaks on line below
            await registry.makeBid(100, 2, {
                from: buyer
            })

            let balanceAfter = await daiContract.balanceOf(buyer);
            assert(balanceAfter,balanceBefore-100,"ERC20 token balance not changed correctly")

            noBids += 1;
            let bid = await registry.bids(noBids - 1)

            // should now assert that status is sale
            assert(bid.offer.toNumber(), 100, "Bid price incorrect")
            assert(bid.status, "Sale", "Bid status incorrect")
            assert(bid.publication_Id, noPublications - 1, "Publication ID incorrect")
            assert(bid.owner_Id, 1, "Buyer ID incorrect")
            let nftTokenBalance2 = await registry.balanceOf(buyer)
            assert(nftTokenBalance2, nftTokenBalance + 1, "NFT balance not correct")
        })

        it("Reverts if bad user input", async () => {
            // If bids with a non-running auction
            await registry.createPublication(validPublication.publication_uri,
                true,
                false,
                0,
                validPublication.contributors,
                validPublication.contributorsWeighting, {
                    from: publisher
                })
            noPublications += 1;
            let publication = await registry.publications(noPublications - 1)

            await assertRevert(registry.makeBid(100, noPublications - 1, {
                from: buyer
            }), EVMRevert)

            // If sends incorrect funds to flat-rate publication
            await assertRevert(registry.makeBid(101, 0, {
                from: buyer
            }), EVMRevert)

            // If bidder is unregistered
            await assertRevert(registry.makeBid(100, 1, {
                from: randomAddress
            }), EVMRevert)

            // if publication isn't listed
            // need to do this - see line 83 of UnicoinRegistry.sol

        })
    })

    // Tests for correct implementation of bid acceptance/rejections or cancellation
    context("Accepting/rejecting/cancelling a bid", function () {
        it("Can accept a bid", async () => {
            // Allocation of token to buyer, if token balance is not adjusted then rejects
            let nftTokenBalance = await registry.balanceOf(buyer)
            await registry.acceptBid(0, {
                from: publisher
            })
            let bid = await registry.bids(0)
            assert(bid.status, "Accepted", "Bid status not changed")
            let nftTokenBalance2 = await registry.balanceOf(buyer)
            assert(nftTokenBalance2, nftTokenBalance + 1, "Token balance not set correctly")
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
            // Rejects bid if status is not changed
            noPublications += 1;
            let publication = await registry.publications(noPublications - 1)
            await registry.makeBid(102, noPublications - 1, {
                from: buyer
            })
            noBids += 1;
            await registry.rejectBid(noBids - 1, {
                from: publisher
            })
            let bid = await registry.bids(noBids - 1)
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
            // Tests if user successfully cancels their bid status
            noPublications += 1;
            let publication = await registry.publications(noPublications - 1)
            await registry.makeBid(103, noPublications - 1, {
                from: buyer
            })
            noBids += 1;
            await registry.cancelBid(noBids - 1, {
                from: publisher
            })
            let bid = await registry.bids(noBids - 1)
            assert(bid.status, "Cancelled", "Bid status not changed")
        })

        it("Reverts if publisher tries to accept/reject/cancel a sale", async () => {
            // await registry.createPublication(validPublication.publication_uri,
            //     false,
            //     true,
            //     100,
            //     validPublication.contributors,
            //     validPublication.contributorsWeighting, {
            //         from: publisher
            //     })
            // noPublications += 1;
            // let publication = await registry.publications(noPublications - 1)
            // await registry.makeBid(100, noPublications - 1, {
            //     from: buyer
            // })
            // noBids += 1;
            // await assertRevert(registry.acceptBid(noBids - 1, {
            //     from: publisher
            // }), EVMRevert)
            // await assertRevert(registry.rejectBid(noBids - 1, {
            //     from: publisher
            // }), EVMRevert)
            // await assertRevert(registry.cancelBid(noBids - 1, {
            //     from: publisher
            // }), EVMRevert)
        })
    })

    // Tests if publication status is correctly changed
    context("Changing a publications status", function () {
        it("Can change from auction to sale", async () => {
            await registry.createPublication(validPublication.publication_uri,
                true,
                true,
                0,
                validPublication.contributors,
                validPublication.contributorsWeighting, {
                    from: publisher
                })
            noPublications += 1;
            // Should not go through if status is not changed and a flat price is not allocated
            await registry.changeToSale(noPublications - 1, 107, {
                from: publisher
            })
            let publication = await registry.publications(noPublications - 1)
            assert(publication.isAuction == false, "Auction status not changed")
            assert(publication.sell_price.toNumber() == 107, "Price not changed")
        })

        // The correct user should change status
        it("Reverts if unauthorized user modifies auction", async () => {
            await assertRevert(registry.changeToAuction(noPublications - 1, {
                from: buyer
            }), EVMRevert)
        })

        // Should not allow a price different from 0 if auction is enabled
        it("Can change from sale to auction", async () => {
            await registry.changeToAuction(noPublications - 1, {
                from: publisher
            })
            let publication = await registry.publications(noPublications - 1)
            assert(publication.isAuction == true, "Auction status not changed")
            assert(publication.sell_price.toNumber() == 0, "Price not removed")
        })

        // Only authorized user can change this functionality
        it("Reverts if unauthorized user modifies sale", async () => {
            await assertRevert(registry.changeToSale(noPublications - 1, 107, {
                from: buyer
            }), EVMRevert)
        })

        // Sell price should be changed and only the user can do so
        it("Correctly changes sell price", async () => {
            await registry.changeToSale(noPublications - 1, 109, {
                from: publisher
            })
            await registry.changeSellPrice(noPublications - 1, 110, {
                from: publisher
            })
            let publication = await registry.publications(noPublications - 1)
            assert(publication.sell_price.toNumber(), 110, "Price not changed")
        })

        it("Reverts if unauthorized user modifies sell price", async () => {
            await assertRevert(registry.changeSellPrice(noPublications - 1, 109, {
                from: buyer
            }), EVMRevert)
        })

        // Running status should be changed and only by the user
        it("Changes running status", async () => {
            await registry.changeRunningStatus(noPublications - 1, {
                from: publisher
            })
            let publication = await registry.publications(noPublications - 1)
            assert(publication.isRunning == false, "Status not changed")
        })

        it("Reverts if unauthorized user changes status", async () => {
            await assertRevert(registry.changeRunningStatus(noPublications - 1, {
                from: buyer
            }), EVMRevert)
        })
    })

    // Get the correct number of publication arrays, number of bids, bids to the publication  and total number of publications
    context("'Getter' functions work correctly", function () {
        it("Gets publications correctly", async () => {
            let publicationArray = await registry.getPublications(publisher)
            //Ensure that number of publications is equal to total number of publications
            assert(publicationArray.length == noPublications, "Number of publications not correct")
        })

        it("Gets bids correctly", async () => {
            let bidArray = await registry.getBids(buyer)

            assert(bidArray.length == noBids, "Number of bids not correct")
        })

        it("Gets publication's bids correctly", async () => {
            let publicationBidArray = await registry.getPublicationBids(1)

            let bid_Id = publicationBidArray[0].toNumber()

            bid = await registry.bids(bid_Id)
            assert(bid.offer.toNumber(), 100, "Bid price not correct")
            assert(bid.status, "Pending", "Bid status not correct")
            assert(bid.publication_Id, 1, "Publication ID not correct")
            assert(bid.owner_Id, 3, "Bid owner ID not correct")

        })

        it("Gets number of publications correctly", async () => {
            let publicationLength = await registry.getPublicationLength()
            // Ensure that number of publications is equal to total number of publications
            assert(publicationLength.toNumber() == noPublications, "Number of publications not correct")
        })



    })

})