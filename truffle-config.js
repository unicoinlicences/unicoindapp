const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = '323a28006e7f4470ae14d3670fe2e655';
let mnemonic = require('./mnemonic');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    coverage: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraApikey}`);
      },
      network_id: 3,
      gas: 7000000, // default = 4712388
      gasPrice: 6000000000 // default = 100 gwei = 100000000000
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${infuraApikey}`);
      },
      network_id: 42,
      gas: 7000000, // default = 4712388
      gasPrice: 6000000000 // default = 100 gwei = 100000000000
    },
  },
  mocha: {},
  // Configure your compilers
  compilers: {
    solc: {

    }
  }
}