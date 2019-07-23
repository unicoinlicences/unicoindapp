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
          <md-button
            class="md-raised md-primary"
            @click
            style="margin-top:25px"
            href="/CreateProfile"
          >Begin</md-button>
          <md-button
            class="md-raised"
            @click
            style="margin-top:25px"
            href="https://github.com/unicoinlicences/unicoindapp"
          >Learn More</md-button>
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
          <h1>
            How does
            <span>UniCoin</span> work?
          </h1>
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
                <p>
                  Research is uploaded to the platform, available freely for download, with a
                  <a
                    href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
                  >Creative Commons Attribution-NonCommercial-NoDerivatives 4.0</a>
                </p>
              </div>
            </div>

            <div class="timeline-block timeline-block-right">
              <div class="marker"></div>
              <div class="timeline-content">
                <h3>Step 3</h3>
                <p>
                  Entities wishing to use any research for commercial purposes can browse the platform and purchase a
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                  >Creative Commons Attribution 4.0 International</a> licence, giving them permission to utilize the research for commercial purposes
                </p>
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
    <div>
      <md-content style="padding:50px;padding-bottom:60px">
        <h1>The <span>technology</span> behind UniCoin</h1>
        <br />
        <div class="md-layout">
          <div class="md-layout-item">
            <md-card>
              <md-card-media>
                <img
                  src="../assets/ethereum.png"
                  alt="ethereum logo"
                  class="text-center"
                  style="height:200px;width:auto;padding-top:20px"
                />
              </md-card-media>

              <md-card-header>
                <div class="md-title">Ethereum smart contracts</div>
                <div class="md-subhead">
                  <br />Immutable fund processing and issuing of non-fungible token licences.
                </div>
              </md-card-header>

              <md-card-expand>
                <md-card-actions md-alignment="space-between">
                  <md-card-expand-trigger>
                    <md-button class="md-icon-button">
                      <md-icon>keyboard_arrow_down</md-icon>
                    </md-button>
                  </md-card-expand-trigger>
                </md-card-actions>

                <md-card-expand-content>
                  <md-card-content>Through our smart contract, written in Solidity and tested in JavaScript using Truffle, we issue licences to commercial rights through the issuance of an NFT. Licences are cryptographically unique and only allow the buyer to those commercial rights.</md-card-content>
                </md-card-expand-content>
              </md-card-expand>
            </md-card>
          </div>
          <div class="md-layout-item">
            <md-card>
              <md-card-media>
                <img
                  src="../assets/ipfs.png"
                  alt="IPFS logo"
                  class="text-center"
                  style="height:200px;width:auto;padding-top:20px"
                />
              </md-card-media>

              <md-card-header>
                <div class="md-title">InterPlanetary File System</div>
                <div class="md-subhead">
                  <br />We utilize this peer-to-peer network for distributed storage of accounts and research files.
                </div>
              </md-card-header>

              <md-card-expand>
                <md-card-actions md-alignment="space-between">
                  <md-card-expand-trigger>
                    <md-button class="md-icon-button">
                      <md-icon>keyboard_arrow_down</md-icon>
                    </md-button>
                  </md-card-expand-trigger>
                </md-card-actions>

                <md-card-expand-content>
                  <md-card-content>To avoid as many slow transactions with the blockchain as possible, we make use of IPFS for the storage of all research media on our platform. Data is hashed and spread across a wide network, allowing efficient access and ensuring security of material on the platform.</md-card-content>
                </md-card-expand-content>
              </md-card-expand>
            </md-card>
          </div>
          <div class="md-layout-item">
            <md-card>
              <md-card-media>
                <img
                  src="../assets/orcid_logo.png"
                  alt="ORCID logo"
                  class="text-center"
                  style="height:200px;width:auto;padding-top:70px;padding-bottom:70px"
                />
              </md-card-media>

              <md-card-header>
                <div class="md-title">Integration with ORCID</div>
                <div class="md-subhead">
                  <br />We leverage the
                  <i>de facto</i> digital academic identifier to prove researchers' identity.
                </div>
              </md-card-header>

              <md-card-expand>
                <md-card-actions md-alignment="space-between">
                  <md-card-expand-trigger>
                    <md-button class="md-icon-button">
                      <md-icon>keyboard_arrow_down</md-icon>
                    </md-button>
                  </md-card-expand-trigger>
                </md-card-actions>

                <md-card-expand-content>
                  <md-card-content>ORCID is the leading standard for digital identities for academics, so we leverage their existing auth0 system to validate researchers' profiles. Researchers attest to the ownership of an Ethereum wallet, which can only be done on successful ORCID validation of their identity.</md-card-content>
                </md-card-expand-content>
              </md-card-expand>
            </md-card>
          </div>
          <div class="md-layout-item">
            <md-card>
              <md-card-media>
                <img
                  src="../assets/metamaskPortis.png"
                  alt="ORCID logo"
                  class="text-center"
                  style="height:200px;width:auto;padding-top:30px;padding-bottom:30px"
                />
              </md-card-media>

              <md-card-header>
                <div class="md-title">MetaMask and Portis web3 injection</div>
                <div class="md-subhead">
                  <br />Both one-click access to the blockchain, and a frictionless user experience.
                </div>
              </md-card-header>

              <md-card-expand>
                <md-card-actions md-alignment="space-between">
                  <md-card-expand-trigger>
                    <md-button class="md-icon-button">
                      <md-icon>keyboard_arrow_down</md-icon>
                    </md-button>
                  </md-card-expand-trigger>
                </md-card-actions>

                <md-card-expand-content>
                  <md-card-content>Clients can access web3 through MetaMask if installed, which allows the direct interaction with Ethereum dApps without running a full Ethereum node. Portis aims to ensure a frictionless experience for users without a wallet, and will allow a much broader class of users to interact with us.</md-card-content>
                </md-card-expand-content>
              </md-card-expand>
            </md-card>
          </div>
        </div>
      </md-content>
    </div>
      <div style="padding:50px;padding-bottom:60px">
        <h1>The <span>people</span> behind UniCoin</h1>
      </div>
  </div>
</template>
<style lang="scss" scoped>
.card-expansion {
  height: 480px;
}

.md-card {
  width: 320px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}
</style>

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


