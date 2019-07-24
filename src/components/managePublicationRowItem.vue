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


        <p v-if="publicationInformation.isAuction">
          <b>Commercial licencing details:</b> You have elected to sell commercial licences to your work through an auction. Please accept or reject bid below.
        </p>
        <p v-else>
          <b>Commercial licencing details:</b> You have elected to sell commercial licences at a flat rate.
          <br />
          <b>Flat rate:</b>
          {{publicationInformation.sellPrice}} USD
        </p>
        <md-field v-if="!publicationInformation.isAuction" >
          <label>Licencing fee (USD)</label>
          <md-input v-model="offer" type="number"></md-input>
        </md-field>

        <p>
          <b>Bid Offer:</b>
          {{publicationInformation.offer}}
        </p>

        <md-dialog :md-active.sync="showDialog1">
          <md-tabs md-dynamic-height>
            <md-tab md-label="Confirmation">
              <p>Are you sure you want to accept this bid?</p>
            </md-tab>
          </md-tabs>

          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog1 = false">Close</md-button>
            <md-button class="md-primary md-raised" @click="acceptBid(bid.bidId)">Yes</md-button>
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
            <md-button class="md-primary md-raised" @click="rejectBid(bid.bidId)">Yes</md-button>
          </md-dialog-actions>
        </md-dialog>

        <md-dialog :md-active.sync="showDialog3">
          <md-tabs md-dynamic-height>
            <md-tab md-label="Confirmation">
              <p>Are you sure you want to sell this licence?</p>
            </md-tab>
          </md-tabs>

          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog3 = false">Close</md-button>
            <md-button class="md-primary md-raised" @click="acceptBid(bid.bidId)">Yes</md-button>
          </md-dialog-actions>
        </md-dialog>


        <md-button @click="showDialog1 = true">Accept</md-button>
        <md-button v-if="publicationInformation.isAuction" @click="showDialog2 = true">Reject</md-button>
        <md-button v-if="!publicationInformation.isAuction" @click="showDialog3 = true">Sell</md-button>

        <md-dialog :md-active.sync="showDialog4">
          <md-tabs md-dynamic-height>
            <md-tab md-label="Confirmation">
              <p>Change your key settings to:</p>
            </md-tab>
          </md-tabs>

          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog4 = false">Auction</md-button>
            <md-button class="md-primary" @click="showDialog4 = false">Sale</md-button>
            <md-button class="md-primary" @click="showDialog4 = false">Not Running</md-button>
            <md-button class="md-primary" @click="showDialog4 = false">Running</md-button>
          </md-dialog-actions>
        </md-dialog>
        <md-button type="submit" class="md-raised md-accent" :disabled="sending" @click="CHANGE">CHANGE STATUS</md-button>
      </div>
    </div>

  </md-card>

</template>

<script>
import { mapActions, mapState } from "vuex";


export default {
  name: "managePublicationRowItem",
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
    ...mapActions(["ACCEPT_BID", "REJECT_BID","CHANGE"]),
    acceptBid(_bidId) {
      console.log(_bidId);
      this.ACCEPT_BID(_bidId);
    },
    rejectBid(_bidId) {
      this.REJECT_BID(_bidId);
    },
    CHANGE() {
    }
    // makeBid() {
    //   console.log("Making bid boiiii");
    //   this.MAKE_BID({
    //     publicationId: this.publicationInformation.publicationId,
    //     offer: this.offer
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>
