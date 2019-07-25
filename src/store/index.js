import Web3 from "web3";
import Vuex from "vuex";
import Vue from "vue";
import createPersistedState from "vuex-persistedstate";
import moment from "moment";

import {
  getEtherscanAddress,
  getNetIdString,
}
from "@/utils/lookupTools";

import {
  uploadFile,
  viewFile,
} from "@/utils/ipfsUploader";

// import getTokenInfo from "@/utils/TokenInfo.js"

import * as actions from "./actions";
import * as mutations from "./mutation-types";

import truffleContract from "truffle-contract";

import UnicoinRegistryABI from "../../build/contracts/UnicoinRegistry.json"

const Registry = truffleContract(UnicoinRegistryABI);

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    web3: null,
    account: null,
    currentNetwork: null,
    etherscanBase: null,
    registry: null,
    userNumber: 0,
    numberOfPublications: 0,
    listedPublications: [],
    contractAddress: null,
    userProfile: {},
    userBids: [],
    userLicences: [],
    miningTransactionObject: {
      status: 'mining',
      txHash: '0x9410654a5a07c07e13fa7c6ff8f96be0b1e37f91d9e858a2ac396f4b96a849d4'
    }

  },
  mutations: {
    //WEB3 Stuff
    [mutations.SET_ACCOUNT](state, account) {
      state.account = account;
    },
    [mutations.SET_USER_NUMBER](state, userNumber) {
      state.userNumber = userNumber;
    },
    [mutations.SET_USER_PROFILE](state, userProfile) {
      state.userProfile = userProfile;
    },
    [mutations.SET_USER_LICENCES](state, userLicences) {
      state.userLicences = userLicences; // helda
    },
    [mutations.SET_USER_BIDS](state, userBids) {
      state.userBids = userBids;
    },
    [mutations.SET_CURRENT_NETWORK](state, currentNetwork) {
      state.currentNetwork = currentNetwork;
    },
    [mutations.SET_ETHERSCAN_NETWORK](state, etherscanBase) {
      state.etherscanBase = etherscanBase;
    },
    [mutations.SET_CONTRACT_ADDRESS](state, contractAddress) {
      state.contractAddress = contractAddress;
    },
    [mutations.SET_WEB3]: async function (state, {
      web3,
      contract
    }) {
      state.web3 = web3;
      state.registry = contract;
    },
    [mutations.SET_NUMBER_OF_PUBLICATIONS](state, numberOfPublications) {
      state.numberOfPublications = numberOfPublications;
    },
    [mutations.SET_ALL_LISTED_PUBLICATIONS](state, listedPublications) {
      state.listedPublications = listedPublications;
    },
    [mutations.SET_MINING_TRANSACTION_OBJECT](state, miningTransactionObject) {
      state.miningTransactionObject = miningTransactionObject;
    },

  },
  actions: {
    [actions.GET_CURRENT_NETWORK]: function ({
      commit,
      dispatch,
      state
    }) {
      getNetIdString().then(currentNetwork => {
        commit(mutations.SET_CURRENT_NETWORK, currentNetwork);
      });
      getEtherscanAddress().then(etherscanBase => {
        commit(mutations.SET_ETHERSCAN_NETWORK, etherscanBase);
      });
    },

    [actions.INIT_APP]: async function ({
      commit,
      dispatch,
      state
    }, web3) {

      Registry.setProvider(web3.currentProvider)

      dispatch(actions.GET_CURRENT_NETWORK);

      let registry = await Registry.deployed();

      if (registry.address) {
        commit(mutations.SET_CONTRACT_ADDRESS, registry.address);
      }

      let accounts = await web3.eth.getAccounts();
      let account = accounts[0];
      if (account) {
        commit(mutations.SET_ACCOUNT, account);
      }

      commit(mutations.SET_WEB3, {
        web3,
        contract: registry
      })

      let userNumber = await registry.userAddresses(account)
      if (userNumber) {
        commit(mutations.SET_USER_NUMBER, userNumber.toNumber())
        if (userNumber != 0) {
          dispatch(actions.GET_USER_PROFILE)
          dispatch(actions.GET_USER_BIDS)
          dispatch(actions.GET_USER_LICENCES)
        }
      }

      let numberOfPublications = await registry.getPublicationLength()
      console.log("length", numberOfPublications.toNumber())
      if (numberOfPublications) {
        commit(mutations.SET_NUMBER_OF_PUBLICATIONS, numberOfPublications.toNumber());
        dispatch(actions.GET_ALL_PUBLICATIONS);
      }


    },
    [actions.CREATE_USER]: async function ({
      commit,
      dispatch,
      state
    }, params) {
      console.log("IN create user CALL")
      console.log(params)

      console.log("IPFS")
      let ipfsHash = await uploadFile(params)
      console.log(ipfsHash.toString())
      await state.registry.registerUser(ipfsHash.toString(), {
        from: state.account
      })
    },
    [actions.LIST_PUBLICATION]: async function ({
      commit,
      dispatch,
      state
    }, params) {
      console.log("IN list publication call")
      console.log(params)

      let ipfsBlob = params
      ipfsBlob['userNumber'] = state.userNumber
      console.log(ipfsBlob)
      let ipfsHash = await uploadFile(ipfsBlob)
      console.log(ipfsHash.toString())
      await state.registry.createPublication(ipfsHash.toString(), params.isAuction, true, params.sellPrice, params.contributors, params.contributorsWeightings, {
        from: state.account
      })
    },
    [actions.GET_ALL_PUBLICATIONS]: async function ({
      commit,
      dispatch,
      state
    }) {

      console.log("CALLING")
      let publicationsReturned = []
      for (let i = 0; i < state.numberOfPublications; i++) {
        console.log("loading publication: ", i)
        let publicationObject = await state.registry.getPublication(i)
        console.log("OBJECT")
        console.log(publicationObject)
        let publicationObjectProcessed = []
        publicationObjectProcessed[0] = publicationObject[0].toNumber()
        publicationObjectProcessed[1] = publicationObject[1]
        publicationObjectProcessed[2] = publicationObject[2].map(v => v.toNumber())
        publicationObjectProcessed[3] = publicationObject[3]
        publicationObjectProcessed[4] = publicationObject[4]
        publicationObjectProcessed[5] = publicationObject[5].toNumber()
        publicationObjectProcessed[6] = publicationObject[6].map(v => v.toNumber())
        publicationObjectProcessed[7] = publicationObject[7].map(v => v.toNumber())
        // console.log(publicationObject)
        // console.log(publicationObjectProcessed)


        let ipfsFile = await viewFile(publicationObjectProcessed[1])
        // console.log(ipfsFile)

        let authorBlob = await state.registry.users(publicationObjectProcessed[0])
        console.log(authorBlob)
        let authorProfile = await viewFile(authorBlob.profile_uri)
        console.log(authorProfile)

        let publicationBidsInformation = []

        for (let j = 0; j < publicationObjectProcessed[2].length; j++) {
          let bidId = publicationObjectProcessed[2][j]
          let bidInformation = await state.registry.bids(bidId)
          let bidderBlob = await state.registry.users(bidInformation.owner_Id)
          let bidderProfile = await viewFile(bidderBlob.profile_uri)
          console.log("FETCHING BIDDER PROFILE")
          console.log(bidderProfile)

          let ownerAddress = (await state.registry.users(bidInformation.owner_Id)).owned_address
          publicationBidsInformation.push({
            bidId: bidId,
            offer: bidInformation.offer,
            status: bidInformation.status,
            ownerId: bidInformation.owner_Id,
            ownerAddress: ownerAddress,
            bidderFirstName: bidderProfile.firstName,
            bidderLastName: bidderProfile.lastName,
            bidderAccountType: bidderProfile.accountType,
            bidderCompanyName: bidderProfile.name
          })
        }

        let finalPublicationObject = {}
        finalPublicationObject['publicationId'] = i
        finalPublicationObject['title'] = ipfsFile.title
        finalPublicationObject['abstract'] = ipfsFile.abstract
        finalPublicationObject['authorNumber'] = publicationObjectProcessed[0]
        finalPublicationObject['authorAddress'] = authorBlob.owned_address
        finalPublicationObject['authorFirstName'] = authorProfile.firstName
        finalPublicationObject['authorLastName'] = authorProfile.lastName
        finalPublicationObject['authorEmail'] = authorProfile.email
        finalPublicationObject['authorOrcid'] = authorProfile.orcid
        finalPublicationObject['authorUniversity'] = authorProfile.university
        finalPublicationObject['pdfFile'] = ipfsFile.pdfFile
        finalPublicationObject['keyword'] = ipfsFile.keyword
        finalPublicationObject['isAuction'] = publicationObjectProcessed[3]
        finalPublicationObject['isRunning'] = publicationObjectProcessed[4]
        finalPublicationObject['sellPrice'] = publicationObjectProcessed[5]
        finalPublicationObject['contributors'] = publicationObjectProcessed[6]
        finalPublicationObject['contributorsWeightings'] = publicationObjectProcessed[7]
        finalPublicationObject['bids'] = publicationBidsInformation


        publicationsReturned.push(finalPublicationObject)

      }
      console.log(publicationsReturned)
      commit(mutations.SET_ALL_LISTED_PUBLICATIONS, publicationsReturned);
    },
    [actions.GET_USER_PROFILE]: async function ({
      commit,
      dispatch,
      state
    }) {
      let userProfile = await state.registry.users(state.userNumber, {
        from: state.account
      })
      let ipfsBlob = await viewFile(userProfile.profile_uri)
      commit(mutations.SET_USER_PROFILE, ipfsBlob)
    },
    [actions.GET_USER_BIDS]: async function ({
      commit,
      dispatch,
      state
    }) {
      let usersBids = await state.registry.getBids(state.account, {
        from: state.account
      })
      console.log("fetching bids")
      console.log(usersBids)
      let userBids = []
      // bidInformation = {}
      console.log(usersBids.length)
      for (let j = 0; j < usersBids.length; j++) {
        let bidInformation = {}
        let bidId = usersBids[j]
        let bidArray = await state.registry.bids(bidId)
        let publicationObject = await state.registry.getPublication(bidArray.publication_Id)
        let ipfsFile = await viewFile(publicationObject[1])

        bidInformation['id'] = bidId.toNumber()
        bidInformation['offer'] = bidArray.offer.toNumber()
        bidInformation['bidStatus'] = bidArray.status
        bidInformation['publication_Id'] = bidArray.publication_Id
        bidInformation['publicationTitle'] = ipfsFile.title
        bidInformation['pdfFile'] = ipfsFile.pdfFile
        console.log("FETCHING BIDS")
        console.log(bidInformation)
        userBids.push(bidInformation)

      }

      commit(mutations.SET_USER_BIDS, userBids)
    },
    [actions.GET_USER_LICENCES]: async function ({
      commit,
      dispatch,
      state
    }) {
      let usersLicences = await state.registry.getLicence(state.account, {
        from: state.account
      })
      console.log("fetching licences")
      // console.log(userLicences)
      let userLicences = []

      console.log(userLicences.length)
      for (let j = 0; j < usersLicences.length; j++) {
        let licenceId = usersLicences[j]
        let licenceArray = await state.registry.licences(licenceId)

        let licenceInformation = {}
        licenceInformation['buyer_Id'] = licenceArray.buyer_Id
        licenceInformation['Publication_Id'] = licenceArray.Publication_Id
        licenceInformation['bid_Id'] = licenceArray.bid_Id
        licenceInformation['publicationTitle'] = ipfsFile.title
        licenceInformation['pdfFile'] = ipfsFile.pdfFile  
        console.log("FETCHING Licences")
        // console.log(bidInformation)
        userLicences.push(licenceInformation)
      }
      commit(mutations.SET_USER_LICENCES, userLicences)
    },
    // [actions.GET_USER_LICENCES]: async function ({
    //   commit,
    //   dispatch,
    //   state
    // }) {
    //   let allLicences = await state.registry.licences
    //   let userLicences = []
    //   for (let j = 0; j < allLicences.length; j++) {
    //     let licence = allLicences[j]

    //     let licenceInformation = {}
    //     licenceInformation['buyer_Id'] = licence.buyer_Id
    //     licenceInformation['Publication_Id'] = licence.Publication_Id
    //     licenceInformation['bid_Id'] = licence.bid_Id

    //     userLicences.push(licenceInformation)
    //   }
    //   commit(mutations.SET_USER_LICENCES, userLicences)
    // },
    [actions.MAKE_BID]: async function ({
      commit,
      dispatch,
      state
    }, params) {
      console.log("IN MAKE BID CALL")
      console.log(params)
      await state.registry.makeBid(params.offer, params.publicationId, {
        from: state.account
      })
    },
    [actions.MAKE_DONATION]: async function ({
      commit,
      dispact,
      state
    }, params) {
      console.log("IN MAKE DONATION CALL")
      console.log(params)
      await state.registry.donate(params.publicationId, params.value, {
        from: state.account
      })
    },
    [actions.ACCEPT_BID]: async function ({
      commit,
      dispatch,
      state
    }, bidId) {
      console.log("IN ACCEPT BID CALL")
      console.log(bidId)
      await state.registry.acceptBid(bidId, {
        from: state.account
      })
    },
    [actions.REJECT_BID]: async function ({
      commit,
      dispatch,
      state
    }, bidId) {
      console.log("IN REJECT BID CALL")
      console.log(bidId)
      await state.registry.rejectBid(bidId, {
        from: state.account
      })
    },
    [actions.CANCEL_BID]: async function ({
      commit,
      dispatch,
      state
    }, param) {
      console.log("IN CANCEL BID CALL")
      console.log(param.bidId)
      await state.registry.cancelBid(param.bidId, {
        from: state.account
      })
    },
    [actions.CLOSE_MINING_DIALOG]: async function ({
      commit,
      dispatch,
      state
    }) {
      commit(mutations.SET_MINING_TRANSACTION_OBJECT, {
        status: null,
        txHash: ""
      })
    },
  }
})


// abstract: "abstract boi"
// contributors: (3)[1, "2", "4"]
// contributorsWeightings: (3)[27, 52, 21]
// isAuction: true
// keyword: ["rocket"]
// pdfFile: "dW5kZWZpbmVk"
// sellPrice: 0
// title: "this is the title"
// userNumber: 1