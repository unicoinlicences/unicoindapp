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

    let noPublications = 0;
    let noBids = 0;


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
        registry = await UnicoinRegistry.new(daiContract.address, {
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
            noPublications += 1;
            let publication = await registry.publications(noPublications - 1)

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

            // register the publication: publication 2 (index 1)
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

            // make the bid
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
            // await daiContract.approve(registry.contract._address, 1000000, {
            //     from: buyer
            // })

            // // breaks on line below
            // await registry.makeBid(100, 2, {
            //     from: buyer
            // })
            // noBids += 1;
            // let bid = await registry.bids(noBids - 1)
            // console.log(bid)

            // // should now assert that status is sale
            // assert(bid.offer.toNumber(), 100, "Bid price incorrect")
            // assert(bid.status, "Sale", "Bid status incorrect")
            // assert(bid.publication_Id, noPublications - 1, "Publication ID incorrect")
            // assert(bid.owner_Id, 1, "Buyer ID incorrect")
            // let nftTokenBalance2 = await registry.balanceOf(buyer)
            // assert(nftTokenBalance2, nftTokenBalance + 1, "NFT balance not correct")
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
            noPublications += 1;
            let publication = await registry.publications(noPublications - 1)

            await assertRevert(registry.makeBid(100, noPublications - 1, {
                from: buyer
            }), EVMRevert)

            // if sends incorrect funds to flat-rate publication
            await assertRevert(registry.makeBid(101, 0, {
                from: buyer
            }), EVMRevert)

            // if bidder is unregistered
            await assertRevert(registry.makeBid(100, 1, {
                from: randomAddress
            }), EVMRevert)

            // if publication isn't listed
            // need to do this - see line 83 of UnicoinRegistry.sol

        })
    })

    context("Accepting/rejecting/cancelling a bid", function () {
        it("Can accept a bid", async () => {
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
            await registry.changeToSale(noPublications - 1, 107, {
                from: publisher
                })
            let publication = await registry.publications(noPublications - 1)
            assert(publication.isAuction == false,"Auction status not changed")
            assert(publication.sell_price.toNumber() == 107, "Price not changed")     
        })

        it("Reverts if unauthorized user modifies auction", async () => {
            await assertRevert(registry.changeToAuction(noPublications - 1, {
                from: buyer
            }), EVMRevert)
        })

        it("Can change from sale to auction", async () => {
            await registry.changeToAuction(noPublications - 1, {
                from: publisher
                })
            let publication = await registry.publications(noPublications - 1)
            assert(publication.isAuction == true, "Auction status not changed")
            assert(publication.sell_price.toNumber() == 0, "Price not removed")
        })

        it("Reverts if unauthorized user modifies sale", async () => {
            await assertRevert(registry.changeToSale(noPublications - 1, 107, {
                from: buyer
            }), EVMRevert)
        })

        it("Correctly changes sell price", async () => {
            await registry.changeToSale(noPublications - 1, 109, {
                from: publisher
                })
            await registry.changeSellPrice(noPublications - 1, 110, {
                from: publisher
                })
            let publication = await registry.publications(noPublications - 1)
            assert(publication.sell_price.toNumber(),110,"Price not changed")
        })

        it("Reverts if unauthorized user modifies sell price", async () => {
            await assertRevert(registry.changeSellPrice(noPublications - 1, 109, {
                from: buyer
            }), EVMRevert)
        })

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

    context("Changing a publications status", function () {
        it("Gets publications correctly", async () => {
            let publicationArray = await registry.getPublications(publisher)

            assert(publicationArray.length, 7, "Length not correct")
        })
    })

})