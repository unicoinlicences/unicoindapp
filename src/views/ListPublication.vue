<template>
  <div class="page-container">
    <md-steppers style="margin: 20px;" :md-active-step.sync="active" md-linear>
      <md-step
        id="first"
        md-label="Information and setup"
        :md-done.sync="first"
        style="background: #F5F9F9; padding-left:0px; marin:0px; padding-right:0px;"
      >
        <div class="md-layout">
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Add a new publication to the UniCoin marketplace🦄</div>
              </md-card-header>
              <p>Add a new publication to the UniCoin marketplace. This onboarding flow will guide you though uploading your paper, linking other contributors and specifying the auction process used for selling license.</p>
            </md-content>
            <br />
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-content style="padding: 20px;">
                  <md-card-header>
                    <div class="md-title">Upload your paper</div>
                  </md-card-header>Add your Paper in PDF format. 🗂
                  <md-field>
                    <label>Paper PDF</label>
                    <md-file
                      v-model="pdfName"
                      id="file"
                      ref="file"
                      @change="handleFileUpload($event.target.files)"
                    />
                  </md-field>
                  <img
                    v-if="pdfFile != null"
                    class="text-center"
                    alt="step logo"
                    style="height:200px;"
                    src="../assets/samplePaper.png"
                  />
                </md-content>
              </div>
              <div class="md-layout-item">
                <md-content style="padding: 20px;">
                  <md-card-header>
                    <div class="md-title">Key paper information</div>
                  </md-card-header>Specify the key information about your paper.📄
                  <md-field>
                    <label>Paper title</label>
                    <md-input v-model="title"></md-input>
                    <span class="md-helper-text"></span>
                  </md-field>
                  <md-field>
                    <label>Paper abstract</label>
                    <md-textarea v-model="abstract" md-autogrow></md-textarea>
                  </md-field>
                </md-content>
              </div>
              <div class="md-layout-item">
                <md-content style="padding: 20px;">
                  <md-card-header>
                    <div class="md-title">Paper key words</div>
                  </md-card-header>Label your publication so others can find it easier.🔍
                  <md-chips v-model="keywords" md-placeholder="Nanotechnology..."></md-chips>
                </md-content>
              </div>
            </div>
          </div>
        </div>
        <md-button
          class="md-raised md-primary"
          @click="setDone('first', 'second')"
          :disabled="false"
        >Continue</md-button>
      </md-step>
      <md-step
        id="second"
        md-label="Paper Collaborators"
        :md-done.sync="second"
        style="background: #F5F9F9; padding-left:0px; marin:0px; padding-right:0px;"
      >
        <div class="md-layout">
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Specify paper contributors🎓</div>
              </md-card-header>
              <p>Attribute a percentage of your total income from your research to your paper contributors. They will automatically recive a proportion of all licencing fees you receive. The allocation is completely up to you.</p>
            </md-content>
            <br />
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-content style="padding: 20px;">
                  <md-card-header>
                    <div class="md-title">Add contributors</div>
                  </md-card-header>Add contributors that were influential in helping develop your research. You can choose what percentage allocation they will receive from the total funding pool.
                  <div class="md-layout">
                    <div class="md-layout-item">
                      <div v-for="(contributor, index) in coAuthor">
                        <div class="md-layout">
                          <div
                            class="md-layout-item md-size-5"
                            style="padding-top:30px"
                          >{{index+1}})</div>
                          <div class="md-layout-item md-size-30">
                            <md-autocomplete
                              v-model="contributor.name"
                              :md-options="authorList"
                              @input="changeContribution(index, contributor.name)"
                            >
                              <label>Contributors names</label>
                            </md-autocomplete>¸
                          </div>
                          <div class="md-layout-item md-size-25" style="padding-top:20px">
                            <clickable-address
                              :light="false"
                              :icon="true"
                              :eth-address="authorsAddresses[authorList.indexOf(contributor.name)] || ''"
                            />
                          </div>
                          <div class="md-layout-item">
                            <vue-slider
                              v-model="contributor.weighting"
                              v-bind="sliderOptions"
                              :min="0"
                              :max="100"
                              :interval="1"
                              :adsorb="true"
                              :dotOptions="{max: contributor.weighting + remainingAllocation}"
                              :tooltip="'always'"
                              :process-style="{ backgroundColor: '#798288' }"
                              :tooltip-style="{ backgroundColor: '#646B71', borderColor: '#646B71' }"
                              style="padding-top:30px"
                              :disabled="authorsAddresses[authorList.indexOf(contributor.name)] == null"
                              @change="slideContribution(index)"
                            />
                          </div>
                          <div class="md-layout-item md-size-10">
                            <md-button
                              class="md-icon-button md-icon-button md-accent md-raised"
                              style="margin-top:10px"
                              @click="removeContributor(index)"
                            >
                              <md-icon>remove</md-icon>
                            </md-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <md-empty-state
                    md-icon="devices_other"
                    md-label="Add your first contributor"
                    md-description="Add all the people that helped make your research a reality."
                    v-if="coAuthor.length==0"
                  >
                    <md-button
                      class="md-primary md-raised"
                      @click="addContributor"
                    >Add first contributor</md-button>
                  </md-empty-state>
                  <md-button
                    @click="addContributor"
                    class="md-icon-button md-icon-button md-primary md-raised"
                    v-if="coAuthor.length>0"
                  >
                    <md-icon>add</md-icon>
                  </md-button>
                </md-content>
              </div>
              <div class="md-layout-item md-size-40">
                <md-content>
                  <vue-plotly
                    v-if="pieData && coAuthor.length > 0"
                    :data="pieData"
                    :layout="pieLayout"
                    :options="pieOptions"
                  />
                  <p style="padding:20px">Your Allocation: {{remainingAllocation.toFixed(1)}}%</p>
                </md-content>
              </div>
            </div>
          </div>
        </div>
        <md-button
          class="md-raised md-primary"
          @click="setDone('second', 'third')"
          style="margin-top: 20px;"
        >Continue</md-button>
        <md-button
          class="md-raised"
          @click="setDone('second', 'first')"
          style="margin-top: 20px;"
        >Back</md-button>
      </md-step>
      <md-step
        id="third"
        md-label="Market settings"
        :md-done.sync="third"
        style="background: #F5F9F9; padding-left:0px; marin:0px; padding-right:0px;"
      >
        <div class="md-layout">
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Choose how you want to sell licences to your research📄</div>
              </md-card-header>
              <p>You can choose to either list your research on an auction where buyers will submit bids and you can choose to accept or sell it at a fixed price per licence.</p>
            </md-content>
            <br />
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-content style="padding: 20px;">
                  <md-card-header>
                    <div class="md-title">Research market type</div>
                  </md-card-header>
                  <md-radio v-model="marketType" value="auction">Auction</md-radio>
                  <md-radio v-model="marketType" value="fixedPrice">Fixed Price</md-radio>
                  <p
                    v-if="marketType=='auction'"
                  >Your publication will be listed as an auction. All buyers will submit a bid to you that you can review before selling a licence. Use this setting if you want to be able to price discriminate against buyers.</p>
                  <div v-if="marketType=='fixedPrice'">
                    <p>Your publication will be listed at a fixed price. Buyers can purchase license immediately with no restriction. Use this setting if you feel happy with setting one fixed price for all licences.</p>
                    <md-field>
                      <label>Price per licence (USD)</label>
                      <md-input v-model="pricePerLicence" type="number"></md-input>
                    </md-field>
                  </div>
                </md-content>
              </div>
            </div>
          </div>
        </div>
        <md-button
          class="md-raised md-primary"
          @click="setDone('third', 'fourth')"
          style="margin-top: 20px;"
        >Continue</md-button>
        <md-button
          class="md-raised"
          @click="setDone('third', 'second')"
          style="margin-top: 20px;"
        >Back</md-button>
      </md-step>
      <md-step
        id="fourth"
        md-label="Deploy"
        :md-done.sync="fourth"
        style="background: #F5F9F9; padding-left:0px; marin:0px; padding-right:0px;"
      >
        <div class="md-layout">
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Review your publication information🔍</div>
              </md-card-header>
              <p>You can choose to either list your research on an auction where buyers will submit bids and you can choose to accept or sell it at a fixed price per licence.</p>
            </md-content>
            <br />
            <div class="md-layout md-gutter" v-if="deployed==false">
              <div class="md-layout-item">
                <md-content style="padding: 20px;">
                  <md-card-header>
                    <div class="md-title">Publication summary</div>
                  </md-card-header>
                  <md-table v-if="pieData!=null">
                    <md-table-row>
                      <md-table-cell>Paper title</md-table-cell>
                      <md-table-cell>{{title}}</md-table-cell>
                    </md-table-row>
                    <md-table-row>
                      <md-table-cell>Paper keywords</md-table-cell>
                      <md-table-cell>
                        <div v-for="keyword in keywords">{{keyword}}</div>
                      </md-table-cell>
                    </md-table-row>
                    <md-table-row>
                      <md-table-cell>Paper contributors</md-table-cell>
                      <md-table-cell>
                        <div v-for="contrubtor in contributorsSummary">{{contrubtor}}</div>
                      </md-table-cell>
                    </md-table-row>
                    <md-table-row>
                      <md-table-cell>Your allocation</md-table-cell>
                      <md-table-cell>{{remainingAllocation.toFixed(1)}}%</md-table-cell>
                    </md-table-row>
                    <md-table-row>
                      <md-table-cell>Sale type</md-table-cell>
                      <md-table-cell>{{marketType}}</md-table-cell>
                    </md-table-row>
                    <md-table-row v-if="marketType=='fixedPrice'">
                      <md-table-cell>Fixed price per licence</md-table-cell>
                      <md-table-cell>{{pricePerLicence}}</md-table-cell>
                    </md-table-row>
                  </md-table>
                </md-content>
              </div>
              <div class="md-layout-item md-size-30">
                <img
                  v-if="pdfFile != null"
                  class="text-center"
                  alt="step logo"
                  style="height:300px;"
                  src="../assets/samplePaper.png"
                />
              </div>
            </div>
            <md-content style="padding: 20px;" v-if="deployed==true">
              <img
                class="text-center"
                alt="step logo"
                style="height:400px;"
                src="../assets/unicorn_dabbing.png"
              />
            </md-content>
          </div>
        </div>
        <md-button class="md-raised md-primary" @click="deploy" style="margin-top: 20px;">Finish🚀</md-button>
        <md-button
          class="md-raised"
          @click="setDone('fourth', 'third')"
          style="margin-top: 20px;"
        >Back</md-button>
      </md-step>
    </md-steppers>

    <!-- <pdf src=""></pdf> -->
    <!-- <pdf v-if="pdfName!=null" src="pdf" :page="1" type="application/pdf">
    <template slot="loading">
      loading content here...
    </template>
    </pdf>-->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import ClickableAddress from "@/components/widgets/ClickableAddress";
import VuePlotly from "@statnett/vue-plotly";
import { constants } from "fs";

import pdf from "pdfvuer";

export default {
  name: "manage",
  components: { ClickableAddress, VuePlotly, pdf },
  data: () => ({
    active: "first",
    first: false,
    second: false,
    third: false,
    fourth: false,
    pdfFile: null,
    pdfName: null,
    title: "",
    abstract: "",
    keywords: [],
    coAuthor: [
      // {
      //   name: "Sabine Bertram",
      //   address:
      //     "0x9a7b53a5f6b24b71b182f1fc8e4ca6db0e63b6c63c7ab4b72c08f02329bdf9ea",
      //   weighting: 0
      // }
    ],
    authorList: [
      "Sabine Bertram",
      "Daniel Opolot",
      "Suraj Shekhar",
      "Jesper Riedler",
      "Christine Makanza",
      "Pawel Fiedor",
      "Hylton Hollander"
    ],
    authorsAddresses: ["2", "3", "4", "5", "6", "7", "8"],
    selectedAuthor: "",
    SplitWithOthers: 0,
    colors: [
      "#A8A2F5",
      "#E66C82",
      "#F8D771",
      "#9BECBE",
      "#4371E0",
      "#CC83E9",
      "#F77D6A",
      "#D5F871",
      "#67E6ED",
      "#7B66F7"
    ],
    pieOptions: {
      responsive: false,
      showLink: false,
      displayModeBar: false,
      sort: false
    },
    pieLayout: {
      margin: {
        l: 55,
        r: 55,
        b: 55,
        t: 55,
        pad: 20
      }
    },
    deployed: false,
    marketType: "auction",
    pricePerLicence: 100
  }),
  methods: {
    ...mapActions(["LIST_PUBLICATION"]),
    handleFileUpload(file) {
      // this.pdfFile = file[0]
      var reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = function() {
        console.log(reader);
      };
      reader.onerror = function(error) {
        console.log("Error: ", error);
      };
      this.pdfFile = btoa(reader.pdfFile);
    },
    setDone(id, index) {
      this[id] = true;

      this.secondStepError = null;

      if (index) {
        this.active = index;
      }
    },
    deploy() {
      console.log("LAUNCH");
      this.deployed = !this.deployed;

      let contributorAddresses = this.coAuthor.map(v => v.address);
      let contributorWeighting = this.coAuthor.map(v => v.weighting);
      let isAuction = this.marketType === "auction" ? true : false;
      let sellPrice = this.marketType === "auction" ? 0 : this.pricePerLicence;

      let publicationObject = {
        title: this.title,
        abstract: this.abstract,
        keyword: this.keywords,
        contributors: [this.userNumber, ...contributorAddresses],
        contributorsWeightings: [
          this.remainingAllocation,
          ...contributorWeighting
        ],
        sellPrice: sellPrice,
        isAuction: isAuction,
        pdfFile: this.pdfFile
      };
      console.log(publicationObject);
      this.LIST_PUBLICATION(publicationObject);
    },
    addContributor() {
      this.coAuthor.push({ name: "", address: "", weighting: 0 });
    },
    removeContributor(index) {
      this.coAuthor.splice(index, 1);
    },
    changeContribution(index, name) {
      this.coAuthor[index].address = this.authorsAddresses[
        this.authorList.indexOf(name)
      ];
    },
    slideContribution(index) {
      console.log("SLIDE");
    }
  },
  computed: {
    ...mapState(["userNumber"]),
    sliderOptions() {
      return {
        process: ([pos, i]) => [
          [0, pos],
          [pos, pos + this.remainingAllocation, { backgroundColor: "#999" }]
        ]
      };
    },
    remainingAllocation() {
      if (this.coAuthor.length == 0) {
        return 100;
      } else {
        let weightings = this.coAuthor.map(v => v.weighting);
        console.log(weightings);
        console.log(weightings.reduce((sum, value) => sum + value, 0));
        return this.coAuthor
          .map(v => v.weighting)
          .reduce((sum, value) => sum - value, 100);
      }
    },
    pieData() {
      return [
        {
          values: [
            this.remainingAllocation,
            ...this.coAuthor.map(v => v.weighting)
          ],
          labels: ["Dr Frankenstein", ...this.coAuthor.map(v => v.name)],
          hole: 0.7,
          type: "pie",
          sort: "false",
          marker: {
            colors: this.colors
          }
        }
      ];
    },
    contributorsSummary() {
      return this.coAuthor.map((v, i) => `${v.name}: ${v.weighting}%`);
    }
  }
};
</script>
