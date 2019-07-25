<template>
  <div class="page-container">
    <div class="md-layout">
      <div class="md-layout">
        <div class="md-layout-item">
          <md-content style="padding: 20px;">
            <md-card-header>
              <div class="md-title"><h1>Manage your publications</h1></div>
            </md-card-header>
            <p><h2 class="text-center">View all of your uploaded publications, review bids for your licences, and change your key settings.</h2></p>
          </md-content>
          <manage-publication-row-item
            v-for="publication in listedPublications"
            v-if="publication.authorNumber == userNumber"
            :publicationInformation="publication"
            :key="publication"
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
  data: () => ({}),
  methods: {
    ...mapActions(["GET_ALL_PUBLICATIONS"])
  },
  mounted() {
    this.GET_ALL_PUBLICATIONS();
  },

  computed: {
    ...mapState(["numberOfPublications", "listedPublications", "userNumber"])
  }
};
</script>
