<template>
  <div style="padding:50px;">
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-content style="padding:20px">
          <h2>We'd love to hear from you. Please reach out with any comments, complaints, compliments, or queries.</h2>
          <md-field>
            <label>Full Name</label>
            <md-input v-model="form.FullName"></md-input>
            <span class="md-helper-text"></span>
          </md-field>

          <md-field>
            <label>Name of Institution</label>
            <md-input v-model="form.Institution"></md-input>
            <span class="md-helper-text"></span>
          </md-field>

          <md-field>
            <label>Chat to Us</label>
            <md-textarea v-model="form.textarea"></md-textarea>
          </md-field>

          <md-card-actions>
            <md-button type="submit" class="md-raised md-accent" :disabled="sending">SUBMIT</md-button>
          </md-card-actions>
          <md-card-actions></md-card-actions>
        </md-content>
      </div>
      <div class="md-layout-item md-size-30">
        <br />
        <br />
        <br />
        <img
          class="text-center"
          alt="step logo"
          style="height:350px"
          src="../assets/pooUnicorn.gif"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { validationMixin } from "vuelidate";
import {
  required,
  Email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
import router from "@/router";
import { min } from "bn.js";

export default {
  name: "TextFields",
  mixins: [validationMixin],
  data: () => ({
    // accountType: "academic",
    form: {
      FullName: null,
      Institution: null,
      Email: null,
      textarea: null
    },
    userSaved: false,
    sending: false,
    lastUser: null
  }),
  validations: {
    form: {
      FullName: {
        required,
        minLength: minLength(3)
      },
      Email: {
        required,
        minLength: minLength(3)
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>