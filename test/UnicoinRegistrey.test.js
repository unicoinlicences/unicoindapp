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
    const examplePProfileURI = "QmPF7eAtGoaEgSAt9XCP2DuWfc8sbtQfraffDsx3svu4Ph"


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
    });

    beforeEach(async function () {
        registry = await UnicoinRegistry.new({
            from: registryOwner
        });
    })

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

        //next, check user cant register twice. first add a valid user
        await registry.registerUser(exampleUserProfileURI, {
            from: publisher
        })

        //then check reverts if same user tries to register
        await assertRevert(registry.registerUser(exampleUserProfileURI, {
            from: publisher
        }), EVMRevert)
    });
    it("Fund created correctly", async () => {
        assert(true, true)
    });
})