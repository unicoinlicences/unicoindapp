<template>
  <md-card style="padding:30px">
    {{publicationInformation}}
    <h2>{{publicationInformation.title}}</h2>
    <p><b>Published by: </b><b><i>{{publicationInformation.authorFirstName}} {{publicationInformation.authorLastName}}</i></b>, 
      {{publicationInformation.authorUniversity}}. 
        <a href='https://orcid.org/'><img
          class="text-right"
          alt="ORCID logo"
          style = "width: 16px"
          src="../assets/orcid.png"
        /> https://orcid.org/{{publicationInformation.authorOrcid}}</a> </p>
    <p><b>Abstract: </b>{{publicationInformation.abstract}}</p>
    <p><b>Keywords: </b>{{publicationInformation.keyword.toString()}}</p>
    <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>, and only personal, non-commercial, or academic usage is permitted. The commercial rights can be purchased according to the sales method specified below.</p>
    <md-field>
      <label>Bid amount (USD)</label>
      <md-input v-model="offer" type="number"></md-input>
    </md-field>
    <md-button>Download free copy</md-button>
    <md-button @click="makeBid">Bid for licence</md-button>
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
