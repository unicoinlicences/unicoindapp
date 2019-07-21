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
