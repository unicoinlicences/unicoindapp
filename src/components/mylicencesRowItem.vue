<template>
  <md-card style="padding:30px">
    <div  class="md-layout">
      <div class="md-layout-item">
        <h2>{{licenceInformation.publicationInformation[0].title}}</h2>
        <p>
          <b>Published by: </b>
          <b>
            <i>{{licenceInformation.publicationInformation[0].authorFirstName}} {{licenceInformation.publicationInformation[0].authorLastName}}</i> </b>, {{licenceInformation.publicationInformation[0].authorUniversity}}
          <a
            v-bind:href="'https://orcid.org/'+licenceInformation.publicationInformation[0].authorOrcid"
            target="_blank"
          >
            <img class="text-right" alt="ORCID logo" style="width: 16px" src="../assets/orcid.png" />
            https://orcid.org/{{licenceInformation.publicationInformation[0].authorOrcid}}
          </a>
        </p>
        <p>
          <b>Abstract:</b>
          {{licenceInformation.publicationInformation[0].abstract}}
        </p>
        <p>
          <b>Keywords:</b>
          {{licenceInformation.publicationInformation[0].keyword.toString()}}
        </p>
        <p>
          <b>Fee Paid:</b>
          {{licenceInformation.publicationInformation[0].bids[0].offer}} USD
        </p>
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank">
          <img
            alt="Creative Commons License"
            style="border-width:0"
            src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
          />
        </a>

        <md-card-actions>
            <md-button
              class="md-primary md-raised"
              download
              :href="licenceInformation.publicationInformation[0].pdfFile"
            >DOWNLOAD PDF</md-button>
          <md-button type="submit" class="md-raised md-accent" :disabled="sending" @click="DOWNLOAD_LICENCE">DOWNLOAD LICENCE</md-button>
          <md-button type="submit" class="md-raised md-accent" :disabled="sending" @click="TRANSFER_TOKEN">TRANSFER TOKEN</md-button>
        </md-card-actions> 
      
      
      </div>
      <div class="md-layout-item md-size-20">
        <md-card v-if="licenceInformation.publicationInformation[0].pdfFile!=null" style="width:auto">
          <pdf :src="licenceInformation.publicationInformation[0].pdfFile" :page="1" :resize="true">
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
  name: "myLicencesRowItem",
  components: { pdf },
  data: () => ({ offer: 0 }),
  props: {
    licenceInformation: {
      type: Object,
      required: true
    },
  },
  name: "ButtonVsLink",
  computed: {
    pageUrl() {
      return window.location.href;
    }
  },  
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>
