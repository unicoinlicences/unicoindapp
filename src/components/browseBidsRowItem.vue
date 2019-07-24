<template>
  <md-card style="padding:30px">
    <div class="md-layout">
      <div class="md-layout-item">
        <h2>{{bidInformation.publicationTitle}}</h2>
        <p><b>Bid ID: {{bidInformation.id}}</b></p>
        <p><b>Your offer:</b> {{bidInformation.offer}} USD</p>
        <p v-if="bidInformation.bidStatus==0"><b>Bid status: </b>Pending</p>
        <p v-if="bidInformation.bidStatus==1"><b>Bid status: </b>Your bid was accepted. View your licence on your <a href="/MyLicences">Licences</a> page</p>
        <p v-if="bidInformation.bidStatus==2"><b>Bid status: </b>Rejected</p>
        <p v-if="bidInformation.bidStatus==3"><b>Bid status: </b>Sale (successfully purchased). View your licence on your <a href="/MyLicences">Licences</a> page.</p>
        <p v-if="bidInformation.bidStatus==4"><b>Bid status: </b>Cancelled</p>

        <md-button v-if="bidInformation.bidStatus == 1"
          class="md-primary"
          download
          :href="bidInformation.pdfFile"
          >Download paper
        </md-button>
        <md-button v-else-if="bidInformation.bidStatus == 3"
          class="md-primary md-raised"
          download
          :href="bidInformation.pdfFile"
          >Download paper
        </md-button>
        <md-button class="md-primary" v-if="bidInformation.bidStatus == 1">Download licence</md-button>
        <md-button class="md-primary" v-else-if="bidInformation.bidStatus == 3">Download licence</md-button>
        <md-button class="md-primary md-raised" v-if="bidInformation.bidStatus == 0" @click="cancelBid">Cancel bid</md-button>

        <!-- {{bidInformation}} -->
      </div>
    
      <div class="md-layout-item md-size-20">
        <md-card v-if="bidInformation.pdfFile != null" style="width:auto">
          <pdf :src="bidInformation.pdfFile" :page="1" :resize="true">
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
    bidInformation: {
      type: Object,
      required: true
    },
  },
  methods: {
    ...mapActions(["CANCEL_BID"]),
    cancelBid() {
      this.CANCEL_BID({
        bidId: this.bidInformation.id
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
