var UnicoinRegistry = artifacts.require("UnicoinRegistry");

module.exports = function (deployer) {
    // Deploy the UniCoin Registry contract
    deployer.deploy(UnicoinRegistry, '0xC4375B7De8af5a38a93548eb8453a498222C4fF2');
};