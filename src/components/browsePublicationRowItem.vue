<template>
  <md-card style="padding:30px">
    <div class="md-layout">
      <div class="md-layout-item">
        <h2>{{publicationInformation.title}}</h2>
        <p>
          <b>Published by: </b>
          <b>
            <i>{{publicationInformation.authorFirstName}} {{publicationInformation.authorLastName}}</i> </b>, {{publicationInformation.authorUniversity}}.
          <a
            v-bind:href="'https://orcid.org/'+publicationInformation.authorOrcid"
            target="_blank"
          >
            <img class="text-right" alt="ORCID logo" style="width: 16px" src="../assets/orcid.png" />
            https://orcid.org/{{publicationInformation.authorOrcid}}
          </a>
        </p>
        <p>
          <b>Abstract:</b>
          {{publicationInformation.abstract}}
        </p>
        <p>
          <b>Keywords:</b>
          {{publicationInformation.keyword.toString()}}
        </p>
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank">
          <img
            alt="Creative Commons License"
            style="border-width:0"
            src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
          />
        </a>
        <br />
        <p v-if="publicationInformation.isAuction">
          <b>Commercial licencing details:</b> The author has elected to sell commercial licences to their work through an auction. Please submit your bid below.
        </p>
        <p v-else>
          <b>Commercial licencing details:</b> The author has elected to sell commercial licences at a flat rate.
          <br />
          <b>Flat rate:</b>
          {{publicationInformation.sellPrice}} USD
        </p>

        <!-- <md-field v-if="!publicationInformation.isAuction" >
          <label>Licencing fee (USD)</label>
          <md-input v-model="offer" type="number"></md-input>
        </md-field> -->

        <md-dialog :md-active.sync="showDialog1">
          <md-tabs md-dynamic-height>
            <md-tab md-label="Copyright notice">
              <a
                rel="license"
                href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
                target="_blank"
              >
                <img
                  alt="Creative Commons License"
                  style="border-width:0"
                  src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
                />
              </a>
              <br />This work is licensed under a
              <a
                rel="license"
                href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
                target="_blank"
              >Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
              <p>The full terms of this licence can be accessed at the link provided above.</p>
              <p>The following terms apply:</p>
              <ol>
                <li>
                  <b>Attribution</b> — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
                </li>
                <li>
                  <b>NonCommercial</b> — You may not use the material for commercial purposes.
                </li>
                <li>
                  <b>NoDerivatives</b> — If you remix, transform, or build upon the material, you may not distribute the modified material.
                </li>
                <li>
                  <b>No additional restrictions</b> — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.
                </li>
              </ol>
            </md-tab>
          </md-tabs>

          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog1 = false">Close</md-button>
            <md-button
              class="md-primary md-raised"
              download
              :href="publicationInformation.pdfFile"
            >Download</md-button>
          </md-dialog-actions>
        </md-dialog>


        <md-dialog :md-active.sync="showDialog2">
          <md-tabs md-dynamic-height>
            <md-tab md-label="Make bid">
              <p>You can bid for the commercial rights to this publication here.</p>
              <a 
              rel="license" 
              href="http://creativecommons.org/licenses/by/4.0/"
              ><img 
              alt="Creative Commons License" 
              style="border-width:0" 
              src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a>
              <br />If your bid is accepted, you will receive a license under a 
              <a 
              rel="license" 
              href="http://creativecommons.org/licenses/by/4.0/"
              >Creative Commons Attribution 4.0 International License</a>.
              <p>The full terms of this licence can be accessed at the link provided above.</p>
              <p>Under this licence, the following terms apply:</p>
              <ol>
                <li><b>Attribution</b> — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.</li>
                <li><b>No additional restrictions</b> — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.</li>
              </ol>
            </md-tab>
          </md-tabs>

          <md-field style="padding-left:20px" v-if="publicationInformation.isAuction">
            <label style="padding-left:20px">Bid amount (USD)</label>
            <md-input style="padding:20px" v-model="offer" type="number"></md-input>
          </md-field>

          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog2 = false">Close</md-button>
            <md-button class="md-primary md-raised" @click="makeBid">Bid</md-button>
          </md-dialog-actions>
        </md-dialog>

        <md-dialog :md-active.sync="showDialog3">
          <md-tabs md-dynamic-height>
            <md-tab md-label="Buy licence">
              <p>You can purchase the commercial rights to this publication here.</p>
              <a 
              rel="license" 
              href="http://creativecommons.org/licenses/by/4.0/"
              ><img 
              alt="Creative Commons License" 
              style="border-width:0" 
              src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a>
              <br />By doing so, you will receive a
              <a 
              rel="license" 
              href="http://creativecommons.org/licenses/by/4.0/"
              >Creative Commons Attribution 4.0 International License</a> to this work.
              <p>The full terms of this licence can be accessed at the link provided above.</p>
              <p>Under this licence, the following terms apply:</p>
              <ol>
                <li><b>Attribution</b> — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.</li>
                <li><b>No additional restrictions</b> — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.</li>
              </ol>
            </md-tab>
          </md-tabs>

          <md-field style="padding-left:20px" v-if="!publicationInformation.isAuction">
            <h3 style="padding:20px"><b>Licencing fee: </b>{{publicationInformation.sellPrice}} USD</h3>
          </md-field>

          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog3 = false">Close</md-button>
            <md-button class="md-primary md-raised" @click="makeBid(offer = publicationInformation.sellPrice)">Purchase licence</md-button>
          </md-dialog-actions>
        </md-dialog>


        <md-dialog :md-active.sync="showDialog4">
          <md-tabs md-dynamic-height>
            <md-tab md-label="Make donation">
              <p>Thank you for supporting the open research community.</p>
              <p>Your funding will support this researcher, {{publicationInformation.authorFirstName}} {{publicationInformation.authorLastName}}, to conduct the research specified.</p>
              <p>Please specify the donation amount below.</p>
            </md-tab>
          </md-tabs>

          <md-field style="padding-left:20px">
            <label style="padding-left:20px">Donation amount (USD)</label>
            <md-input style="padding:20px" v-model="offer" type="number"></md-input>
          </md-field>

          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog4 = false">Close</md-button>
            <md-button class="md-primary md-raised">Donate</md-button>
          </md-dialog-actions>
        </md-dialog>


        <md-button @click="showDialog1 = true">Download free copy</md-button>
        <md-button v-if="publicationInformation.isAuction" @click="showDialog2 = true">Bid for licence here</md-button>
        <md-button v-if="!publicationInformation.isAuction" @click="showDialog3 = true">Purchase licence</md-button>
        <md-button @click="showDialog4 = true">Donate to researcher</md-button>

      </div>
      
      <div class="md-layout-item md-size-20">
        <md-card v-if="publicationInformation.pdfFile!=null" style="width:auto">
          <pdf :src="publicationInformation.pdfFile" :page="1" :resize="true">
            <template slot="loading">loading content here...</template>
          </pdf>
        </md-card>
      </div>
    </div>

  </md-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

import pdf from "pdfvuer";

export default {
  name: "browsePublicationRowItem",
  components: { pdf },
  data: () => ({ offer: 0 }),
  props: {
    publicationInformation: {
      type: Object,
      required: true
    }
  },
  name: "DialogCustom",
  data: () => ({
    showDialog1: false,
    showDialog2: false,
    showDialog3: false,
    showDialog4: false
  }),
  name: "ButtonVsLink",
  computed: {
    pageUrl() {
      return window.location.href;
    }
  },
  methods: {
    ...mapActions(["MAKE_BID"]),
    makeBid() {
      console.log("Making bid boiiii");
      this.MAKE_BID({
        publicationId: this.publicationInformation.publicationId,
        offer: this.offer
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>
