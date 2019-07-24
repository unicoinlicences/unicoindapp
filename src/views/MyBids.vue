<template>
  <div class="page-container">
    <div class="md-layout">
      <div class="md-layout">
        <div class="md-layout-item">
          <md-content style="padding: 20px;">
            <md-card-header>
              <div class="md-title">View all pending, cancelled, or accepted bids and purchases here</div>
            </md-card-header>
            <p>your bids here boi {{userBids}} {{bidsReturned}}</p>

            <!-- <browse-bids-row-item
            v-for="bid in userBids"
            :bidInformation="bid"
            style="margin:20px"
            :key="bid"
          /> -->

          </md-content>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
// import browseBidsRowItem from "@/components/browseBidsRowItem.vue";


export default {
  name: "view bids",
  computed: {
    ...mapState(["userBids"])
  }
};
</script>
