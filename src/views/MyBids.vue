<template>
  <div class="page-container">
    <div class="md-layout">
      <div class="md-layout">
        <div class="md-layout-item">
          <md-content style="padding: 20px;">
            <md-card-header>
              <div class="md-title">View all pending, cancelled, or accepted bids and purchases here</div>
            </md-card-header>

            <browse-bids-row-item
            v-for="bid in userBids"
            :bidInformation="bid"
            style="margin:20px"
            :key="bid"
          />

          </md-content>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import browseBidsRowItem from "@/components/browseBidsRowItem.vue";
import browsePublicationRowItem from "@/components/browsePublicationRowItem.vue";


export default {
  name: "view",
  data: () => ({ }),
  components: { 
    browseBidsRowItem, 
    browsePublicationRowItem
  },
  methods: {
    ...mapActions(["GET_USER_BIDS", "GET_ALL_PUBLICATIONS"])
  },
  mounted() {
    this.GET_USER_BIDS();
    this.GET_ALL_PUBLICATIONS();

  },
  computed: {
    ...mapState(["userBids"]),
    ...mapState(["numberOfPublications", "listedPublications"])

  },
};
</script>
