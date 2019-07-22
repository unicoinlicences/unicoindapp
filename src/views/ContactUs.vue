<template>
  <div style="padding:50px;">
    <md-field>
      <label>Full Name</label>
      <md-input v-model="FullName"></md-input>
      <span class="md-helper-text"></span>
    </md-field>

    <md-field>
      <label>Name of Institution</label>
      <md-input v-model="Institution"></md-input>
      <span class="md-helper-text"></span>
    </md-field>

    <md-field>
      <label>Chat to Us</label>
      <md-textarea v-model="textarea"></md-textarea>
    </md-field>

        </md-card-content>

        <md-card-actions>
          <md-button type="submit" class="md-raised md-accent" :disabled="sending" @click="SUBMIT">SUBMIT</md-button>
        </md-card-actions>
        <!-- {{form.orcid}} -->
      </md-content>

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
import { min } from 'bn.js';

export default {
  name: "TextFields",
  mixins: [validationMixin],
  data: () => ({
   // accountType: "academic",
    form: {
      FullName: null,
      Institution: null,
      Email: null,
      textarea: null,
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
  },

  methods: {
    ...mapActions(["SUBMIT"]),
    SUBMIT() {
      console.log("it works!");
      console.log(this.form.FullName);
      this.SUBMIT(this.form);
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