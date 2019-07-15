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

            // should revert if the url is blank
            await assertRevert(registry.createPublication("",
                validPublication.isAuction, validPublication.isRunning, validPublication.sellPrice, validPublication.contributors, validPublication.contributorsWeighting, {
                from: publisher
                }), EVMRevert)
            
            // should revert if user is unregistered
        });
    })
})