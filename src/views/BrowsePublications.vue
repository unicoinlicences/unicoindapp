<template>
  <div class="page-container">
    <div class="md-layout">
      <div class="md-layout">
        <div class="md-layout-item">
          <md-content style="padding: 20px;">
            <md-card-header>
              <div class="md-title">
                <h1>View all publications on the marketplace🦄</h1>
              </div>
            </md-card-header>
            <md-content style="padding:40px" class="text-center">
              <h2>All publications on UniCoin are available freely for download for academic or personal use. Please see individual publications for commercial licencing details.</h2>
            </md-content>
          </md-content>

          <transition-group name="fadeUp" tag="ul">
            <browse-publication-row-item
              v-for="publication in listedPublications"
              :publicationInformation="publication"
              style="margin:20px"
              :key="publication"
            />
          </transition-group>
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
