<template>
  <md-content>{{publicationInformation}}</md-content>
</template>

<script>
// @ is an alias to /src

export default {
  name: "browsePublicationRowItem",
  props: {
    publicationInformation: {
      type: Object,
      required: true
    }
  }
};
</script>
