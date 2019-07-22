<template>
  <div class="page-container">
    <div class="md-layout">
      <div class="md-layout">
        <div class="md-layout-item">
          <md-content style="padding: 20px;">
            <md-card-header>
              <div class="md-title">View all publications within the marketplace</div>
            </md-card-header>
            <p>Table with all of them. search and filter</p>
          </md-content>

          <browse-publication-row-item
            v-for="publication in listedPublications"
            :publicationInformation="publication"
            style="margin:20px"
            :key="publication"
          />
          <!-- {{publication}} -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import browsePublicationRowItem from "@/components/browsePublicationRowItem.vue";

export default {
  name: "manage",
  components: { browsePublicationRowItem },
  data: () => ({}),
  methods: {
    ...mapActions(["GET_ALL_PUBLICATIONS"])
  },
  mounted() {
    this.GET_ALL_PUBLICATIONS();
  },
  computed: {
    ...mapState(["numberOfPublications", "listedPublications"])
  }
};
</script>
