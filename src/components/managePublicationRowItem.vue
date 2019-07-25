<template>

  <md-card style="padding:30px">
    <div class="md-layout">
      <div class="md-layout-item">
        <h2>{{publicationInformation.title}}</h2>
        <p> 
          <b>Published by: </b>
          <b>
            <i>{{publicationInformation.authorFirstName}} {{publicationInformation.authorLastName}}</i> </b>, {{publicationInformation.authorUniversity}}.
          <a
            v-bind:href="'https://orcid.org/'+publicationInformation.authorOrcid"
            target="_blank"
          >
            <img class="text-right" alt="ORCID logo" style="width: 16px" src="../assets/orcid.png" />
            https://orcid.org/{{publicationInformation.authorOrcid}}
          </a>
        </p>
       

        <p>
          <b>Abstract:</b>
          {{publicationInformation.abstract}}
        </p>
        <p>
          <b>Keywords:</b>
          {{publicationInformation.keyword.toString()}}
        </p>
        
        <br />

        <h3 v-if="publicationInformation.isAuction">Your pending bids are below: </h3>
        <div v-for="bid in publicationInformation.bids" :key="bid">
          <p v-if="publicationInformation.isAuction" ><b>Bid offer:</b> {{bid.offer}} USD </p>
          <p v-if="publicationInformation.isAuction" ><b>Offered by:</b> {{bid.bidderFirstName}} {{bid.bidderLastName}}{{bid.bidderCompanyName}}</p>
          <!-- <p v-if="bid.bidderAccountType='company'"><b>Offered by:</b> {{bid.bidderCompanyName}}</p> -->
          <md-dialog :md-active.sync="showDialog1">
            <md-tabs md-dynamic-height>
              <md-tab md-label="Confirmation">
                <p>Are you sure you would like to accept this bid?</p>
              </md-tab>
            </md-tabs>

            <md-dialog-actions>
              <md-button class="md-primary" @click="showDialog1 = false">Close</md-button>
              <md-button class="md-primary md-raised" @click="acceptBid(bid.bidId)">ACCEPT BID</md-button>
            </md-dialog-actions>
          </md-dialog>

          <md-dialog :md-active.sync="showDialog2">
            <md-tabs md-dynamic-height>
              <md-tab md-label="Confirmation">
                <p>Are you sure you would like to reject this bid?</p>
              </md-tab>
            </md-tabs>
            <md-dialog-actions>
              <md-button class="md-primary" @click="showDialog2 = false">Close</md-button>
              <md-button class="md-primary md-raised" @click="rejectBid(bid.bidId)">Reject bid</md-button>
            </md-dialog-actions>
          </md-dialog>


          <md-button v-if="publicationInformation.isAuction" @click="showDialog1 = true" class="md-primary md-raised">Accept</md-button>
          <md-button v-if="publicationInformation.isAuction" @click="showDialog2 = true" class="md-raised md-accent">Reject</md-button>
        </div>
        <br v-if="publicationInformation.isAuction" />
        <h3>You can review and change your publication's details below.</h3>
        <p v-if="publicationInformation.isAuction">
          <b>Commercial licencing details:</b> You have elected to sell commercial licences to your work through an auction.        
        </p>
        <p v-if="!publicationInformation.isAuction">
          <b>Commercial licencing details:</b> You have elected to sell commercial licences at a flat rate.
          <br />
          <b>Flat rate:</b>
          {{publicationInformation.sellPrice}} USD</p>
        
        <md-button v-if="!publicationInformation.isAuction" @click="showDialog5=true" class="md-primary md-raised">CHANGE LICENCE PRICE</md-button>
        <md-button v-if="!publicationInformation.isAuction" @click="showDialog4=true" class="md-primary md-raised">CHANGE TO AUCTION</md-button>
        <md-button v-if="publicationInformation.isAuction" @click="showDialog3=true" class="md-primary md-raised">CHANGE TO SALE</md-button>

        <md-dialog :md-active.sync="showDialog3">
          <md-tabs md-dynamic-height>
            <md-tab md-label="Change to flat rate">
              <p>Please enter the price you would like to charge for a licence to your research.</p>
            </md-tab>
          </md-tabs>
          <md-field style="padding-left:20px">
            <label style="padding-left:20px">New flat rate (USD)</label>
            <md-input style="padding:20px" v-model="price" type="number"></md-input>
          </md-field>
          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog3 = false">Close</md-button>
            <md-button class="md-primary md-raised" @click="changeToSale">Submit price</md-button>
          </md-dialog-actions>
        </md-dialog>

        <md-dialog :md-active.sync="showDialog4">
          <md-tabs md-dynamic-height>
            <md-tab md-label="Change to auction">
              <p>Your publication will now be for sale through an auction. Bidders will submit prices to you, which you will need to review and accept or reject.</p>
            </md-tab>
          </md-tabs>
  
          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog4 = false">Close</md-button>
            <md-button class="md-primary md-raised" @click="changeToAuction">Change to auction</md-button>
          </md-dialog-actions>
        </md-dialog>

        <md-dialog :md-active.sync="showDialog5">
          <md-tabs md-dynamic-height>
            <md-tab md-label="Change licence price">
              <p>Please enter the new price at which you would like to licence your work.</p>
            </md-tab>
          </md-tabs>

          <md-field style="padding-left:20px">
            <label style="padding-left:20px">New flat rate (USD)</label>
            <md-input style="padding:20px" v-model="price" type="number"></md-input>
          </md-field>

          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog5 = false">Close</md-button>
            <md-button class="md-primary md-raised" @click="changeSellPrice">Change licence price</md-button>
          </md-dialog-actions>
        </md-dialog>

        <p><b>Running status: </b> <md-chip v-if="publicationInformation.isRunning" class="md-primary">Running</md-chip><md-chip v-if="publicationInformation.isRunning" md-clickable @click="changeRunningStatus">Stop running</md-chip>
        <md-chip v-if="!publicationInformation.isRunning" class="md-accent">Not running</md-chip><md-chip v-if="!publicationInformation.isRunning" md-clickable @click="changeRunningStatus">Start running</md-chip>
        </p>


      </div>

      <div class="md-layout-item md-size-20">
        <md-card v-if="publicationInformation.pdfFile!=null" style="width:auto">
          <pdf :src="publicationInformation.pdfFile" :page="1" :resize="true">
            <template slot="loading">loading content here...</template>
          </pdf>
        </md-card>
      </div>
      
    </div>

  </md-card>

</template>

<script>
import { mapActions, mapState } from "vuex";
import pdf from "pdfvuer";


export default {
  name: "managePublicationRowItem",
  components: { pdf },
  data: () => ({ offer: 0 , price: 0 }),
  props: {
    publicationInformation: {
      type: Object,
      required: true
    }
  },
  name: "DialogCustom",
  data: () => ({
    showDialog1: false,
    showDialog2: false,
    showDialog3: false,
    showDialog4: false,
    showDialog5: false
  }),
  name: "ButtonVsLink",
  computed: {
    pageUrl() {
      return window.location.href;
    }
  },

  methods: {
    ...mapActions(["ACCEPT_BID", "REJECT_BID","GET_USER_PROFILE", "CHANGE_TO_SALE", "CHANGE_TO_AUCTION", "CHANGE_RUNNING_STATUS", "CHANGE_SELL_PRICE"]),
    acceptBid(bidId) {
      console.log("Accepting bid...")
      this.ACCEPT_BID({
        bidId: bidId
       });
    },
    rejectBid(bidId) {
      console.log("Rejecting bid...")
      this.REJECT_BID({
        bidId: bidId
      });
    },
    changeToSale() {
      console.log("Changing to sale...")
      this.CHANGE_TO_SALE({
        publicationId: this.publicationInformation.publicationId,
        sellPrice: this.price
      })
    },
    changeToAuction () {
      console.log("Changing to auction...")
      this.CHANGE_TO_AUCTION({
        publicationId: this.publicationInformation.publicationId
      })
    },
    changeRunningStatus () {
      console.log("Changing running status...")
      this.CHANGE_RUNNING_STATUS({
        publicationId: this.publicationInformation.publicationId
      })
    },
    changeSellPrice () {
      console.log("Changing sell price...")
      this.CHANGE_SELL_PRICE({
        publicationId: this.publicationInformation.publicationId,
        sellPrice: this.price
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>
