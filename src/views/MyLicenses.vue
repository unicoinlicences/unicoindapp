<template>
  <div class="page-container">
    <div class="md-layout">
      <div class="md-layout">
        <div class="md-layout-item">
          <md-content style="padding: 20px;">
            <md-card-header>
              <div class="md-title">View all owned licences here</div>
            </md-card-header>

            <br-licences-row-item
            v-for="licence in userLicences"
            :licenceInformation="licence"
            style="margin:20px"
            :key="licence"
          />

          </md-content>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import mylicencesRowItem from "@/components/mylicencesRowItem.vue";

export default {
  name: "licences",
  data: () => ({ }),
  components: { 
    mylicencesRowItem
  },
  methods: {
    ...mapActions(["GET_USER_LICENCES"])
  },
  mounted() {
    this.GET_USER_LICENCES();

  },
  computed: {
    ...mapState(["userLicences"])
   // ...mapState(["numberOfPublications", "listedPublications"])

  },
};
</script>
