<template>

  <md-card style="padding:30px">
    <div class="md-layout">
      <div class="md-layout-item">
        <h2>{{publicationInformation.title}}</h2>
        <p>{{publicationInformation.bids}}</p>
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
          <b>Contributors:</b>
          {{publicationInformation.contributors.toString()}}
        </p>        

        <p>
          <b>Abstract:</b>
          {{publicationInformation.abstract}}
        </p>
        <p>
          <b>Keywords:</b>
          {{publicationInformation.keyword.toString()}}
        </p>
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank">
          <img
            alt="Creative Commons License"
            style="border-width:0"
            src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
          />
        </a>
        <br />

          
        <div v-for="bid in publicationInformation.bids" :key="bid">
          <p><b>Bid offer:</b> {{bid.offer}} USD </p>
          <p><b>Offered by:</b> {{bid.bidderFirstName}} {{bid.bidderLastName}}{{bid.bidderCompanyName}}</p>
          <!-- <p v-if="bid.bidderAccountType='company'"><b>Offered by:</b> {{bid.bidderCompanyName}}</p> -->
          <md-dialog :md-active.sync="showDialog1">
            <md-tabs md-dynamic-height>
              <md-tab md-label="Confirmation">
                <p>Are you sure you want to accept this bid?</p>
              </md-tab>
            </md-tabs>

            <md-dialog-actions>
              <md-button class="md-primary" @click="showDialog1 = false">Close</md-button>
              <md-button class="md-primary md-raised" @click="acceptBid">Yes</md-button>
            </md-dialog-actions>
          </md-dialog>

          <md-dialog :md-active.sync="showDialog2">
            <md-tabs md-dynamic-height>
              <md-tab md-label="Confirmation">
                <p>Are you sure you want to reject this bid?</p>
              </md-tab>
            </md-tabs>
            <md-dialog-actions>
              <md-button class="md-primary" @click="showDialog2 = false">Close</md-button>
              <md-button class="md-primary md-raised">Yes</md-button>
            </md-dialog-actions>
          </md-dialog>


          <md-button @click="showDialog1 = true">Accept</md-button>
          <md-button v-if="publicationInformation.isAuction" @click="showDialog2 = true">Reject</md-button>
        </div>
        <p v-if="publicationInformation.isAuction">
          <b>Commercial licencing details:</b> You have elected to sell commercial licences to your work through an auction.        
        </p>
        <p v-if="!publicationInformation.isAuction">
          <b>Commercial licencing details:</b> You have elected to sell commercial licences at a flat rate.
          <br />
          <b>Flat rate:</b>
          {{publicationInformation.sellPrice}} USD</p>
        <md-button v-if="!publicationInformation.isAuction">CHANGE TO AUCTION</md-button>
        <md-button v-if="publicationInformation.isAuction" @click="showDialog3=true">CHANGE TO SALE</md-button>

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
            <md-button class="md-primary md-raised">Submit price</md-button>
          </md-dialog-actions>
        </md-dialog>


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
  data: () => ({ offer: 0 }),
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
    showDialog3: false
  }),
  name: "ButtonVsLink",
  computed: {
    pageUrl() {
      return window.location.href;
    }
  },

  methods: {
    ...mapActions(["ACCEPT_BID", "REJECT_BID","GET_USER_PROFILE"]),
    acceptBid() {
      this.ACCEPT_BID({
        bidId: this.publicationInformation.bids.bidId,
      });
    },
    // rejectBid() {
    //   this.REJECT_BID();
    // }
  }
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>
