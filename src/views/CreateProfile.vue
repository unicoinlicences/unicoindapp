<template>
  <div class="page-container" style="padding-left:20px; padding-right:20px">
    <div class="md-layout">
      <div class="md-layout">
        <div class="md-layout-item">
          <md-content style="padding: 20px;">
            <md-card-header>
              <div class="md-title">Welcome to UniCoin!</div>
            </md-card-header>
            <p>Create your profile here. Are you a researcher wanting to publish material, or do you represent a company wishing to licence a researcher's work?</p>
            <br>
            <p>Already registered? <a href="/Profile">View your profile here.</a></p>
          </md-content>
        </div>
      </div>
    </div>

    <md-radio v-model="accountType" value="academic" @change="clearForm">Academic</md-radio>
    <md-radio v-model="accountType" value="company" @change="clearForm">Company</md-radio>
    <br />
    <form
      v-if="accountType=='academic'"
      novalidate
      class="md-layout"
      @submit.prevent="validateUser"
      style="padding-top:20px"
    >
      <md-content class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">To verify your profile as a researcher, please login with ORCID below.</div>
        </md-card-header>

        <md-card-content>
          <md-button
      href="https://orcid.org/oauth/authorize?client_id=APP-0JZDFYT5L60YYAWM&response_type=token&scope=openid&redirect_uri=http://localhost:8080/CreateProfile"
    ><img
          class="text-right"
          alt="ORCID logo"
          style = "width: 18px"
          src="../assets/orcid.png"
        /> ORCID LOGIN</md-button>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getAcademicValidationClass('firstName')">
                <label for="first-name">First Name</label>
                <md-input
                  name="first-name"
                  id="first-name"
                  autocomplete="given-name"
                  v-model="form.firstName"
                  disabled="true"
                />
                <span class="md-error" v-if="!$v.form.firstName.required">The first name is required</span>
                <span class="md-error" v-else-if="!$v.form.firstName.minlength">Invalid first name</span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getAcademicValidationClass('lastName')">
                <label for="last-name">Last Name</label>
                <md-input
                  name="last-name"
                  id="last-name"
                  autocomplete="family-name"
                  v-model="form.lastName"
                  disabled="true"
                />
                <span class="md-error" v-if="!$v.form.lastName.required">The last name is required</span>
                <span class="md-error" v-else-if="!$v.form.lastName.minlength">Invalid last name</span>
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getAcademicValidationClass('university')">
                <label for="university">University</label>
                <md-input
                  name="university"
                  id="university"
                  autocomplete="university"
                  v-model="form.university"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.university.required">The university is required</span>
                <span class="md-error" v-else-if="!$v.form.university.minlength">Invalid university name</span>
              </md-field>
            </div>
          </div>

          <md-field :class="getAcademicValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              v-model="form.email"
              :disabled="sending"
            />
            <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
            <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-raised md-accent" :disabled="sending" @click="createUser">Create user</md-button>
        </md-card-actions>
        <!-- {{form.orcid}} -->
      </md-content>

      <md-snackbar :md-active.sync="userSaved">The user {{ lastUser }} was saved with success!</md-snackbar>
    </form>

    <form
      v-if="accountType=='company'"
      novalidate
      class="md-layout"
      @submit.prevent="validateUser"
      style="padding-top:20px"
    >
      <md-content class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">To verify your profile as an institution, please provide your company details below.</div>
        </md-card-header>

        <md-card-content>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getCompanyValidationClass('company')">
                <label for="company">Company</label>
                <md-input
                  name="company"
                  id="company"
                  autocomplete="company"
                  v-model="form.company"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.company.required">The company name is required</span>
                <span class="md-error" v-else-if="!$v.form.email.minlength">Invalid company name</span>
              </md-field>
            </div>
          </div>

          <md-field :class="getCompanyValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              v-model="form.email"
              :disabled="sending"
            />
            <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
            <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-raised md-accent" :disabled="sending" @click="createUser">Create user</md-button>
        </md-card-actions>
        <!-- {{form.orcid}} -->
      </md-content>

      <md-snackbar :md-active.sync="userSaved">The user {{ lastUser }} was saved with success!</md-snackbar>
    </form>

    <!-- <md-button @click="createUser" class="md-raised md-accent">Create User</md-button> -->
    <br />
    <br />
    <!-- {{form}} -->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
import router from "@/router";
import { min } from 'bn.js';
var jwt = require("jsonwebtoken");
export default {
  name: "FormValidation",
  mixins: [validationMixin],
  data: () => ({
    accountType: "academic",
    form: {
      firstName: null,
      lastName: null,
      email: null,
      orcid: null,
      university: null
    },
    userSaved: false,
    sending: false,
    lastUser: null
  }),
  validations: {
    form: {
      firstName: {
        required,
        minLength: minLength(3)
      },
      lastName: {
        required,
        minLength: minLength(3)
      },
      university: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        minLength: minLength(3)
      },
      company: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        minLength: minLength(3)
      }
    }
  },
  mounted() {
    console.log(this.$route.hash);
    console.log("PAAA");
    let token = this.getFragmentParameterByName("id_token", this.$route.hash);
    if (token) {
      let decoded = jwt.decode(token);
      console.log("decoded");
      console.log(decoded);
      this.form.firstName = decoded.given_name;
      this.form.lastName = decoded.family_name;
      this.form.orcid = decoded.sub;
    }
  },
  methods: {
    ...mapActions(["CREATE_USER"]),
    createUser() {
      console.log("it worked!");
      console.log(this.form.firstName);
      this.CREATE_USER(this.form);
    },
    getFragmentParameterByName(name, route) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
        results = regex.exec(route);
      return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    getAcademicValidationClass(fieldName) {
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
     getCompanyValidationClass(fieldName) {
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.firstName = null;
      this.form.lastName = null;
      this.form.university = null;
      this.form.email = null;
    },
    saveUser() {
      this.sending = true;
      // Instead of this timeout, here you can call your API
      window.setTimeout(() => {
        this.lastUser = `${this.form.firstName} ${this.form.lastName}`;
        this.userSaved = true;
        this.sending = false;
        this.clearForm();
      }, 1500);
    },
    validateUser() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.saveUser();
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