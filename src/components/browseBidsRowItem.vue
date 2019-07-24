<template>
  <md-card style="padding:30px">
    <div class="md-layout">
      {{userBids}}
      
    </div>

  </md-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "browseBidsRowItem",
  components: { pdf },
  props: {
    userBids: {
      type: Object,
      required: true
    }
  },
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>
