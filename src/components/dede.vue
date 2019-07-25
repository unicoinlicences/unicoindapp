<template>

  <md-card style="padding:30px">
    <div class="md-layout">
      <div class="md-layout-item">
        <h2>{{licenceInformation.publicationTitle}}</h2>
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
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank">
          <img
            alt="Creative Commons License"
            style="border-width:0"
            src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
          />
        </a>
        <br />
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
  name: "browseBidsRowItem",
  components: { pdf },
  data: () => ({ offer: 0 }),
  props: {
    licenceInformation: {
      type: Object,
      required: true
    },
  },
  methods: {
    ...mapActions(["CANCEL_BID"]),
    cancelBid() {
      this.CANCEL_BID({
        licenceId: this.licenceInformation.id
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
