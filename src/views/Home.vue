<template>
  <div class="home">
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-5 md-medium-hide" />
      <div class="md-layout-item" style="padding-top:100px;">
        <span class="md-display-3">Unlock the value in academic research</span>
        <p style="padding-top:20px">
          <br />Introducing a new research marketplace to empower academics to benefit from commercially viable work.
          <br />Connecting researchers and companies since 2019.
          <br />
          <br />
          <md-button class="md-raised md-primary" @click style="margin-top:25px" href="/CreateProfile">Begin</md-button>
          <md-button class="md-raised" @click style="margin-top:25px" href="https://github.com/unicoinlicences/unicoindapp">Learn More</md-button>
          <md-button class="md-raised" @click style="margin-top:25px" href="/ContactUs">GET IN TOUCH</md-button>
        </p>
      </div>

      <div class="md-layout-item md-size-40 md-small-size-100">
        <img
          class="text-center"
          alt="step logo"
          style="width:100%;"
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
            src="../assets/003-search.png"
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
            src="../assets/001-statistics.png"
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
            src="../assets/002-wallet.png"
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
            src="../assets/005-test-tube.png"
          />
          <p
            class="text-center"
          >Companies can access world-class research and only licence it if it totally suits their intended use-case. The open research movement prevails, while ensuring research is justly acknowledged.</p>
        </div>
        <div class="md-layout-item md-size-20 md-medium-hide" />
      </div>
      </md-content>
      <div>
        <div>
          <div style="padding-top:50px">
            <h1>How does <span>UniCoin</span> work?</h1>
            <div class="container">

              <div class="timeline-block timeline-block-right">
                  <div class="marker"></div>
                  <div class="timeline-content">
                    <h3>Step 1</h3>
                    <p>Researchers register on the platform, with their identities attested to by ORCID, a digital identifier for academics</p>
                  </div>
              </div>

              <div class="timeline-block timeline-block-left">
                  <div class="marker"></div>
                  <div class="timeline-content">
                    <h3>Step 2</h3>
                    <p>Research is uploaded to the platform, available freely for download, with a <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0</a></p>
                  </div>
              </div>

              <div class="timeline-block timeline-block-right">
                  <div class="marker"></div>
                  <div class="timeline-content">
                    <h3>Step 3</h3>
                    <p>Entities wishing to use any research for commercial purposes can browse the platform and purchase a <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a> licence, giving them permission to utilize the research for commercial purposes</p>
                  </div>
              </div>

              <div class="timeline-block timeline-block-left">
                  <div class="marker"></div>
                  <div class="timeline-content">
                    <h3>Step 4</h3>
                    <p>Funds securely transferred to researchers through an Ethereum smart contract can be automatically distrubuted to influential works of research, ensuring foundational research is recognized and compensated</p>
                  </div>
              </div>

              <div class="timeline-block timeline-block-right">
                  <div class="marker"></div>
                  <div class="timeline-content">
                    <h3>Step 5</h3>
                    <p>Researchers can use UniCoin as a platform for funding their research! Institutions wanting to allocate funds towards specific research topics can use UniCoin to fund research in advance, ensuring that all the right parties receive an allocation of that funding as well</p>
                  </div>
              </div>

            </div>
          </div>
        </div>
      </div>
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


