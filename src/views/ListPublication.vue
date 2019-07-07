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
                    <md-file v-model="pdf" />
                  </md-field>
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
                <div class="md-title">Specify paper contributors</div>
              </md-card-header>
              <p>Attribute a percentage of your total income from your research to your paper contributors</p>
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
                    <md-file v-model="pdf" />
                  </md-field>
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
                <div class="md-title">Choose how you want to sell licences to your research</div>
              </md-card-header>
              <p>You can choose to either list your research on an auction where buyers will submit bids and you can choose to accept or sell it at a fixed price per licence.</p>
            </md-content>
            <br />
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-content style="padding: 20px;">
                  <md-card-header>
                    <div class="md-title">XXX</div>
                  </md-card-header>XX
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
                <div class="md-title">Choose how you want to sell licences to your research</div>
              </md-card-header>
              <p>You can choose to either list your research on an auction where buyers will submit bids and you can choose to accept or sell it at a fixed price per licence.</p>
            </md-content>
            <br />
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-content style="padding: 20px;">
                  <md-card-header>
                    <div class="md-title">XXX</div>
                  </md-card-header>XX
                </md-content>
              </div>
            </div>
          </div>
        </div>
        <md-button
          class="md-raised md-primary"
          @click="deploy"
          style="margin-top: 20px;"
        >Finish🚀</md-button>
        <md-button
          class="md-raised"
          @click="setDone('fourth', 'third')"
          style="margin-top: 20px;"
        >Back</md-button>
      </md-step>
    </md-steppers>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "manage",
  data: () => ({
    active: "first",
    first: false,
    second: false,
    third: false,
    fourth: false,
    pdf: null,
    title: "",
    abstract: "",
    keywords: []
  }),
  methods: {
    setDone(id, index) {
      this[id] = true;

      this.secondStepError = null;

      if (index) {
        this.active = index;
      }
    },
    deploy(){
      console.log("LAUNCH")
    }
  }
};
</script>
