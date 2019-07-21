<template>
  <md-content>
    {{publicationInformation}}
    <br />
    <md-field>
      <label>Bid amount (USD)</label>
      <md-input v-model="offer" type="number"></md-input>
    </md-field>
    <md-button @click="makeBid">Bid</md-button>
  </md-content>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "browsePublicationRowItem",
  data: () => ({ offer: 0 }),
  props: {
    publicationInformation: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions(["MAKE_BID"]),
    makeBid() {
      console.log("Making bid boiiii");
      this.MAKE_BID({
        publicationId: this.publicationInformation.publicationId,
        offer: this.offer
      });
    }
  }
};
</script>
