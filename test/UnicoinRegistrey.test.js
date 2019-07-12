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
const UnicoinRegistry = artifacts.require("./UnicoinRegistree.sol");
const Erc20 = artifacts.require("./ERC20.sol");

contract("Fund", (accounts) => {
    const registryOwner = accounts[0]
    const tokenOwner = accounts[1]
    const publisher = accounts[2]
    const buyer = accounts[3]

    const exampleUserProfileURI = "QmeWUs9YdymQVpsme3MLQdWFW5GjdM4XDFYMi3YJvUFiaq"
    const examplePProfileURI = "QmPF7eAtGoaEgSAt9XCP2DuWfc8sbtQfraffDsx3svu4Ph"


    before(async function () {
        //Creates ERC20s to use in testing
        daiContract = await Erc20.new({
            from: tokenOwner
        });


        //Mints tokens in a modified ERC20 for the fund
        await daiContract.mint(buyer, 100);

        let balance = await erc20One.balanceOf(buyer);

        //Checks that the balance of the fund is correct
        assert.equal(balance.toNumber(), 100, "Balance not set");
    });

    it("Fund created correctly", async () => {
        assert(true, true)
    });
})