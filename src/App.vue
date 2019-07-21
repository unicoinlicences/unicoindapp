<template>
  <md-app id="app" md-mode="reveal" style="min-height: 100vh;">
    <md-app-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">{{$route.name}}</span>

      <!-- <logo style="margin-left:600px"/> -->

      <div class="md-toolbar-section-end">
        <div
          class="md-layout md-gutter md-alignment-center-right"
          style="text-align:right; width:500px"
        >
          <div class="md-layout-item">
            <div class="md-subheading">Dr Frankenstein</div>
          </div>
          <div class="md-layout-item">
            <div class="md-subheading">
              <clickable-address :light="true" :eth-address="account" />
            </div>
          </div>
        </div>
      </div>
    </md-app-toolbar>

    <md-app-drawer :md-active.sync="menuVisible">
      <md-list>
        <md-list-item>
          <md-icon>home</md-icon>
          <span class="md-list-item-text">
            <router-link to="/">Home</router-link>
          </span>
        </md-list-item>
        <md-list-item>
          <md-icon>account_box</md-icon>
          <span class="md-list-item-text">
            <router-link to="/Profile">Profile</router-link>
          </span>
        </md-list-item>

        <md-list-item>
          <md-icon>person_add</md-icon>
          <span class="md-list-item-text">
            <router-link to="/CreateProfile">Create New User</router-link>
          </span>
        </md-list-item>

        <md-list-item>
          <md-icon>search</md-icon>
          <span class="md-list-item-text">
            <router-link to="/BrowsePublications">Browse Publications</router-link>
          </span>
        </md-list-item>

        <md-divider></md-divider>
        <md-list-item>
          <md-icon>create</md-icon>
          <span class="md-list-item-text">
            <router-link to="/ListPublication">List New Publication</router-link>
          </span>
        </md-list-item>

        <md-list-item>
          <md-icon>format_list_bulleted</md-icon>
          <span class="md-list-item-text">
            <router-link to="/ManagePublications">Manage Publications</router-link>
          </span>
        </md-list-item>

        <md-divider></md-divider>

        <md-list-item>
          <md-icon>attach_money</md-icon>
          <span class="md-list-item-text">
            <router-link to="/MyBids">My Bids</router-link>
          </span>
        </md-list-item>

        <md-list-item>
          <md-icon>vpn_key</md-icon>
          <span class="md-list-item-text">
            <router-link to="/MyLicenses">My Licenses</router-link>
          </span>
        </md-list-item>
        <md-divider></md-divider>

        <md-list-item>
          <md-icon>code</md-icon>
          <span class="md-list-item-text">
            <a href="https://github.com/unicoinlicences/unicoindapp" target="__blank">Github</a>
          </span>
        </md-list-item>

        <md-list-item>
          <md-icon>chat</md-icon>
          <span class="md-list-item-text">
            <a
              href="https://github.com/unicoinlicences/unicoindapp/tree/master/Documentation"
              target="__blank"
            >Documentation</a>
          </span>
        </md-list-item>
      </md-list>
    </md-app-drawer>

    <md-app-content style="background-color: #F5F9F9; padding-left:0px; padding-right:0px">
      <router-view />
      <div style="padding-top:20px;padding-left:20px; padding-right:20px">
        <span class="md-subheading"><a href="/TermsOfService">Terms Of Service</a></span>
        <span class="md-caption" style="float: right;">
          {{currentNetwork}}
          <clickable-address :light="false" :icon="false" :eth-address="account" />
        </span>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
/* global web3:true */

import Web3 from "web3";
import * as actions from "@/store/actions";
import * as mutations from "@/store/mutation-types";
import ClickableAddress from "@/components/widgets/ClickableAddress";
import { mapActions, mapState } from "vuex";
import router from "@/router";

export default {
  name: "app",
  components: { ClickableAddress },
  data() {
    return {
      web3Detected: true,
      menuVisible: false
    };
  },
  methods: {
    ...mapActions(["INIT_APP"]),
    redirect(_path) {
      router.push({ name: _path });
    }
  },
  async mounted() {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      console.log("web3 provider detected!");
      console.log(window.web3);

      // Request account access if needed
      ethereum
        .enable()
        .then(value => {
          console.log("Bootstrapping web app - provider acknowedgled", value);
          this.INIT_APP(window.web3);
        })
        .catch(error => {
          console.log(
            "User denied access, boostrapping application using infura",
            error
          );
          window.web3 = new Web3(
            new Web3.providers.HttpProvider(
              "https://ropsten.infura.io/v3/fb32a606c5c646c7932e43cfaf6c39df"
            )
          );
          this.INIT_APP(window.web3);
        });
    } else if (window.web3) {
      console.log("Running legacy web3 provider");
      window.web3 = new Web3(web3.currentProvider);
      this.INIT_APP(window.web3);
    } else {
      window.web3 = new Web3(
        new Web3.providers.HttpProvider(
          "https://ropsten.infura.io/v3/fb32a606c5c646c7932e43cfaf6c39df"
        )
      );
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      this.INIT_APP(window.web3);
    }
  },
  computed: {
    ...mapState(["currentNetwork", "account"])
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Space+Mono");
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme(
  "default",
  (
    primary: #828ec6,
    // The primary color of your brand
      accent: #dd688c // The secondary color of your brand
  )
);

@import "~vue-material/dist/theme/all"; // Apply the theme

html,
body {
  font-family: "Space Mono", sans-serif;
}

#app {
  /* text-align: center; */
  color: #454a50;
}

#app {
  font-family: "Space Mono", sans-serif;
}
nav li:hover,
nav li.router-link-active,
nav li.router-link-exact-active {
  background-color: indianred;
  cursor: pointer;
}

.text-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
