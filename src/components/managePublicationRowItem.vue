<template>
  <md-content>
    {{publicationInformation}}
    <br />
    <hr />
    <div v-for="bid in publicationInformation.bids">
      {{bid}}
      <md-button @click="acceptBid(bid.bidId)">Accept</md-button>
      <md-button @click="rejectBid(bid.bidId)">Reject</md-button>
    </div>
  </md-content>
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
  methods: {
    ...mapActions(["ACCEPT_BID", "REJECT_BID"]),
    acceptBid(_bidId) {
      console.log(_bidId);
      this.ACCEPT_BID(_bidId);
    },
    rejectBid() {
      this.REJECT_BID(_bidId);
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
