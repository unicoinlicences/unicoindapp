<template>
  <md-content>
    {{licenceInformation}}
        <p>
          <b>Bid Offer:</b>
          {{licenceInformation}}
        </p>


  <md-card style="padding:30px">
        <h2>{{licenceInformation.publicationTitle}}</h2>
        <p> hi world </p>

  </md-card>
  </md-content>

</template>

<script>
import { mapActions, mapState } from "vuex";
import pdf from "pdfvuer";



export default {
  name: "licences",
  components: { pdf },
  data: () => ({ offer: 0 }),
  props: {
    licenceInformation: {
      type: Object,
      required: true
    },
  },
  // methods: {
  //   ...mapActions(["CANCEL_BID"]),
  //   cancelBid() {
  //     this.CANCEL_BID({
  //       licenceId: this.licenceInformation.id
  //     });
  //   }
  // }
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>
