module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    coverage: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8555, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
      gas: 0xfffffffffff,
      gasPrice: 0x01
    },
  },
  mocha: {},
  // Configure your compilers
  compilers: {
    solc: {

    }
  }
}