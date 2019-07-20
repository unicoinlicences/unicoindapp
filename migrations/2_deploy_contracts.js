var UnicoinRegistry = artifacts.require("UnicoinRegistry");

module.exports = function (deployer) {
    // Deploy the UniCoin Registry contract
    deployer.deploy(UnicoinRegistry, '0xaD6D458402F60fD3Bd25163575031ACDce07538D');
};