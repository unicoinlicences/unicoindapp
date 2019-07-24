<template>


  <md-content>
    {{licenceInformation}}
    <br />
    <hr />
  </md-content>

</template>

<script>
import { mapActions, mapState } from "vuex";


export default {
  name: "mylicencesRowItem",
  data: () => ({ }),
  props: {
    licenceInformation: {
      type: Object,
      required: true
    }
  },

//   methods: {
//     ...mapActions(["ACCEPT_BID", "REJECT_BID","CHANGE"]),
//     acceptBid(_bidId) {
//       console.log(_bidId);
//       this.ACCEPT_BID(_bidId);
//     },
//     rejectBid(_bidId) {
//       this.REJECT_BID(_bidId);
//     },
//     CHANGE() {
//     }
    // makeBid() {
    //   console.log("Making bid boiiii");
    //   this.MAKE_BID({
    //     publicationId: this.publicationInformation.publicationId,
    //     offer: this.offer
    //   });
    // }
//  }

};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>
