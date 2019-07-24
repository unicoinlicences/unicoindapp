<template>
  <div class="page-container">
    <div class="md-layout">
      <div class="md-layout">
        <div class="md-layout-item">
          <md-content style="padding: 20px;">
            <md-card-header>
              <div class="md-title">View all pending, cancelled, or accepted bids and purchases here</div>
            </md-card-header>
            <p>your bids here boi {{userBids}}</p>
          </md-content>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "view bids",
  computed: {
    ...mapState(["userBids"])
  }
};
</script>
