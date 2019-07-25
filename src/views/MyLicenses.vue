<template>
  <div class="page-container">
    <div class="md-layout">
      <div class="md-layout">
        <div class="md-layout-item">
          <md-content style="padding: 20px;">
            <md-card-header>
              <div class="md-title">View all owned licences here</div>
            </md-card-header>
          </md-content>

            <br/>
          <my-licences-row-item
            v-for="licence in userLicences"
            :licenceInformation="licence"
            style="margin:20px"
          />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import myLicencesRowItem from "@/components/myLicencesRowItem.vue";

export default {
  name: "licences",
  data: () => ({ }),
  components: { 
    myLicencesRowItem
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
