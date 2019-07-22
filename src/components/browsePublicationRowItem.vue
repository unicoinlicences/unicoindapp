<template>
  <md-card style="padding:30px">
    {{publicationInformation}}
    <h2>{{publicationInformation.title}}</h2>
    <p>Published by: <b>{{publicationInformation.authorFirstName}} {{publicationInformation.authorLastName}}</b>, 
      {{publicationInformation.authorUniversity}}. 
        <a href='https://orcid.org/'><img
          class="text-right"
          alt="ORCID logo"
          style = "width: 16px"
          src="../assets/orcid.png"
        /> https://orcid.org/{{publicationInformation.authorOrcid}}</a> </p>
    <p><b>Abstract: </b>{{publicationInformation.abstract}}</p>
    <md-field>
      <label>Bid amount (USD)</label>
      <md-input v-model="offer" type="number"></md-input>
    </md-field>
    <md-button @click="makeBid">Bid</md-button>
  </md-card>
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
