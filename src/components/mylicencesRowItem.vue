<template>
  <md-card>
    <div class="md-layout">
      <p>
        Licence info here: {{licenceInformation}}
      </p>
    </div>
  </md-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import pdf from "pdfvuer";



export default {
  name: "mylicencesRowItem",
  components: { pdf },
  data: () => ({ }),
  props: {
    licenceInformation: {
      type: Object,
      required: true
    },
  },
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>
