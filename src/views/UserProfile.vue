<template>
  <div class="page-container">
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-5 md-medium-hide" />
      <div class="md-layout-item" style="padding-top:40px;">
        <md-content style="padding: 40px">
          <div class="md-title">Profile Information</div>
          <br />
          <strong>First name:</strong>
          {{userProfile.firstName}}
          <br />
          <strong>Last name:</strong>
          {{userProfile.lastName}}
          <br />
          <strong>University name:</strong>
          {{userProfile.university}}
          <br />
          <strong>Email address:</strong>
          {{userProfile.email}}
          <br />
          <strong>Orcid Profile:</strong>
          <a v-bind:href="'https://orcid.org/'+userProfile.authorOrcid" target="_blank">
            <img class="text-right" alt="ORCID logo" style="width: 16px" src="../assets/orcid.png" />
            https://orcid.org/{{userProfile.orcid}}
            <br />
          </a>
          <strong>Date Created:</strong>
          {{userProfile.timestamp}}
          {{userProfile}}
        </md-content>
      </div>
      <div class="md-layout-item md-size-20 md-small-size-100">
        <img
          class="text-center"
          alt="step logo"
          style="height:250px; padding-top:30px"
          src="../assets/unicorn_dabbing.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "manage profile",
  computed: {
    ...mapState(["userProfile"])
  }
};
</script>
