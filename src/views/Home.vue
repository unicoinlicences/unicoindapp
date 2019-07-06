<template>
  <div class="home">
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-5 md-medium-hide" />
      <div class="md-layout-item" style="padding-top:100px;">
        <span class="md-display-3">Unlock the value in academic research</span>
        <p style="padding-top:20px">
          <br />Introducing a new research marketplace to empower academics to benefit from commercially viable work.
          <br />Connecting researchers and Companies since 2019.
          <br />
          <br />
          <md-button class="md-raised md-primary" @click style="margin-top:25px">Begin</md-button>
          <md-button class="md-raised" @click style="margin-top:25px">Learn More</md-button>
        </p>
      </div>
      <div class="md-layout-item md-size-40 md-small-size-100">
        <img
          class="text-center"
          alt="step logo"
          style="height:500px;"
          src="../assets/unicorn_running.gif"
        />
      </div>
      <div class="md-layout-item md-size-5 md-medium-hide" />
    </div>
    <md-content style="padding-top:100px; padding-bottom:50px">
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-20 md-medium-hide" />
        <div class="md-layout-item md-small-size-100">
          <img
            class="text-center"
            alt="step logo"
            style="height:85px;"
            src="../assets/005-rising.png"
          />
          <p
            class="text-center"
          >Researchers can share their work for free download for non-commercial purposes. They can licence it to companies who want to implement their work commercially.</p>
        </div>
        <div class="md-layout-item md-small-size-100">
          <img
            class="text-center"
            alt="step logo"
            style="height:85px;"
            src="../assets/010-profits.png"
          />
          <p
            class="text-center"
          >Researchers have the flexibility to choose how and when to licence their work – putting the power of their IP truly in their hands.</p>
        </div>
        <div class="md-layout-item md-size-20 md-medium-hide" />
      </div>
      <br />
      <br />
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-20 md-medium-hide" />
        <div class="md-layout-item md-small-size-100">
          <img
            class="text-center"
            alt="step logo"
            style="height:85px;"
            src="../assets/004-wallet.png"
          />
          <p
            class="text-center"
          >Companies wanting to fund research or purchase rights to intellectual property now have one easily accessible marketplace.</p>
        </div>
        <div class="md-layout-item md-small-size-100">
          <img
            class="text-center"
            alt="step logo"
            style="height:85px;"
            src="../assets/008-ethereum.png"
          />
          <p
            class="text-center"
          >Companies can access world-class research and only licence it if it totally suits their intended use-case. The open research movement prevails, while ensuring research is justly acknowledged.</p>
        </div>
        <div class="md-layout-item md-size-20 md-medium-hide" />
      </div>
    </md-content>
    <div style="padding-top:20px;padding-left:20px; padding-right:20px">
      <span class="md-subheading">Terms Of Service</span>
      <span class="md-caption" style="float: right;">
        {{currentNetwork}}
        <clickable-address :light="false" :icon="false" :eth-address="account" />
      </span>
    </div>
  </div>
</template>

<script>
import ClickableAddress from "@/components/widgets/ClickableAddress";
import { mapState } from "vuex";
import router from "@/router";
export default {
  name: "home",
  components: { ClickableAddress },
  methods: {
    goToBegin() {
      router.push({ name: "create" });
    }
  },
  computed: {
    ...mapState(["currentNetwork", "account"])
  }
};
</script>


