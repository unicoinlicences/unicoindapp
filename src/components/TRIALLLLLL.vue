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



manage only
<template>
  <div class="page-container">
    <div class="md-layout">
      <div class="md-layout">
        <div class="md-layout-item">
          <md-content style="padding: 20px;">
            <md-card-header>
              <div class="md-title">Manage your publications</div>
            </md-card-header>
            <p>View all your deployed publications and change their key settings.</p>
          </md-content>
          <manage-publication-row-item
            v-for="publication in listedPublications"
            v-if="publication.authorNumber == userNumber"
            :publicationInformation="publication"
            style="margin:20px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import managePublicationRowItem from "@/components/managePublicationRowItem";

export default {
  name: "manage",
  components: { managePublicationRowItem },
  computed: {
    ...mapState(["numberOfPublications", "listedPublications", "userNumber"])
  }
};
</script>
