# UniCoin Monorepo

[![Netlify Status](https://api.netlify.com/api/v1/badges/63c88402-22eb-4298-9a5b-0f661833414b/deploy-status)](https://app.netlify.com/sites/unicoin-dapp/deploys)

Unicoin is a decentralized, smart contract based non-custodial research marketplace which empowers academics to benefit from commercially viable work. Companies can buy direct access to ideas they want to implement and are issued an NFT based licence which represents their access to the papers content. Papers are free for non-compertial usage. Research is always free for open-source and other research projects.

# Documentation
This repo also contains a series of useful documents, including:

1) [Technical Architecture](./Documentation/TechnicalArchitecture.md)
2) [Pitch deck]([./Documentation/TechnicalArchitecture.md](https://docs.google.com/presentation/d/121boHtItNj7PwzCdGhnDnEfL1r_Td9rAW86ny1Dp914/edit?usp=sharing))
3) [Business Plan](https://docs.google.com/document/d/1iGCbeWvZtk4chdc_CnT9JuZWNwgtNJcFvyyo_UosyZA/edit?usp=sharing)
4) [Crypto Economics & auction design](https://docs.google.com/document/d/1vxKsFlcHTdUq5sstn3GrEQvWzB29eCa6mRR1Rm6oWps/edit?usp=sharing)
5) [User story maps](./Documentation/UserStoryMap.pdf)

This monorepo contains all code for the UniCoin ecosystem. 
## Front End
Front end application can be run as outlined below:

### Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

## Smart contracts
This repo also contains smart contracts to facilitate auction listing, licence minting and account management. 

### compile contracts
```
truffle compile
```

### compile contracts
```
truffle compile
```

### test contracts
```
truffle test

### deploy contracts to rinkeby
```
truffle migrate --network rinkeby
```
<img src="./src/assets/unicorn_running.gif">

