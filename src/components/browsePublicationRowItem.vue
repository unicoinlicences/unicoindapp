<template>
  <md-card style="padding:30px">
    <!-- {{publicationInformation}} -->
    <h2>{{publicationInformation.title}}</h2>
    <p><b>Published by: </b><b><i>{{publicationInformation.authorFirstName}} {{publicationInformation.authorLastName}}</i></b>, 
      {{publicationInformation.authorUniversity}}. 
        <a v-bind:href="'https://orcid.org/'+publicationInformation.authorOrcid"><img
          class="text-right"
          alt="ORCID logo"
          style = "width: 16px"
          src="../assets/orcid.png"
        /> https://orcid.org/{{publicationInformation.authorOrcid}}</a> </p>
    <p><b>Abstract: </b>{{publicationInformation.abstract}}</p>
    <p><b>Keywords: </b>{{publicationInformation.keyword.toString()}}</p>
    <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />
    <p v-if=publicationInformation.isAuction><b>Commercial licencing details:</b> The author has elected to sell commercial licences to their work through an auction. Please submit your bid below.</p>
    <p v-else><b>Commercial licencing details:</b> The author has elected to sell commercial licences at a flat rate.
    <br><b>Flat rate:</b> {{publicationInformation.sellPrice}} USD</p>

    <md-field v-if="publicationInformation.isAuction">
      <label>Bid amount (USD)</label>
      <md-input v-model="offer" type="number"></md-input>
    </md-field>
    <md-field v-if="!publicationInformation.isAuction">
      <label>Licencing fee (USD)</label>
      <md-input v-model="offer" type="number"></md-input>
    </md-field>

    <md-dialog :md-active.sync="showDialog">
      <md-tabs md-dynamic-height>
        <md-tab md-label="Copyright notice">
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
          <p>The full terms of this licence can be accessed at the link provided above.</p>
          <p>The following terms apply:</p>
          <ol>
            <li><b>Attribution</b> — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.</li>
            <li><b>NonCommercial</b> — You may not use the material for commercial purposes.</li>
            <li><b>NoDerivatives</b> — If you remix, transform, or build upon the material, you may not distribute the modified material.</li>
            <li><b>No additional restrictions</b> — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.</li>
          </ol>
        </md-tab>
      </md-tabs>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary md-raised" v-bind:href="'https://infura.ipfs.io/ipfs/'+publicationInformation.pdfFile">Download</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-button @click="showDialog = true">Download free copy</md-button>
    <md-button v-if="publicationInformation.isAuction" @click="makeBid">Bid for licence</md-button>
    <md-button v-if="!publicationInformation.isAuction" @click="makeBid">Purchase licence</md-button>
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
  name: 'DialogCustom',
  data: () => ({
    showDialog: false
  }),
  name: 'ButtonVsLink',
  computed: {
    pageUrl () {
      return window.location.href
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

<style lang="scss" scoped>
  .md-dialog {
    max-width: 768px;
  }
</style>
