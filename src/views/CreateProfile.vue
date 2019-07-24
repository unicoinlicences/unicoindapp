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
            <br />
          </md-content>
        </div>
      </div>
    </div>

    <md-radio v-model="accountType" value="academic" @change="clearForm">Academic</md-radio>
    <md-radio v-model="accountType" value="company" @change="clearForm">Company</md-radio>
    <br />
    <form
      v-if="accountType=='academic'"
      class="md-layout"
      novalidate
      @submit.prevent="$v.$touch()"
      style="padding-top:20px"
    >
      <div class="md-layout-item md-size-15 md-size-small-0" />
      <md-content class="md-layout-item md-size-70 md-small-size-100">
        <md-card-header>
          <div
            class="md-title"
          >To verify your profile as a researcher, please login with ORCID below.</div>
        </md-card-header>

        <md-card-content>
          <md-button
            href="https://orcid.org/oauth/authorize?client_id=APP-0JZDFYT5L60YYAWM&response_type=token&scope=openid&redirect_uri=http://localhost:8080/CreateProfile"
          >
            <img class="text-right" alt="ORCID logo" style="width: 18px" src="../assets/orcid.png" /> ORCID LOGIN
          </md-button>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getAcademicValidationClass('firstName')">
                <label for="first-name">First Name</label>
                <md-input
                  name="first-name"
                  id="first-name"
                  autocomplete="given-name"
                  v-model="academicForm.firstName"
                  :disabled="true"
                />
                <span
                  class="md-error"
                  v-if="!$v.academicForm.firstName.required"
                >The first name is required</span>
                <span
                  class="md-error"
                  v-else-if="!$v.academicForm.firstName.minlength"
                >Invalid first name</span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getAcademicValidationClass('lastName')">
                <label for="last-name">Last Name</label>
                <md-input
                  name="last-name"
                  id="last-name"
                  autocomplete="family-name"
                  v-model="academicForm.lastName"
                  :disabled="true"
                />
                <span
                  class="md-error"
                  v-if="!$v.academicForm.lastName.required"
                >The last name is required</span>
                <span
                  class="md-error"
                  v-else-if="!$v.academicForm.lastName.minlength"
                >Invalid last name</span>
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
                  v-model="academicForm.university"
                />
                <span
                  class="md-error"
                  v-if="!$v.academicForm.university.required"
                >The university is required</span>
                <span
                  class="md-error"
                  v-else-if="!$v.academicForm.university.minlength"
                >Invalid university name</span>
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
              v-model="academicForm.email"
            />
            <span class="md-error" v-if="!$v.academicForm.email.required">The email is required</span>
            <span class="md-error" v-else-if="!$v.academicForm.email.email">Invalid email</span>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-raised md-accent" @click="createUser">Create user</md-button>
        </md-card-actions>
        <!-- {{form.orcid}} -->
      </md-content>

      <md-snackbar :md-active.sync="userSaved">The user {{ lastUser }} was saved with success!</md-snackbar>
    </form>

    <form
      v-if="accountType=='company'"
      novalidate
      class="md-layout"
      @submit.prevent="$v.$touch()"
      style="padding-top:20px"
    >
      <div class="md-layout-item md-size-15 md-size-small-0" />
      <md-content class="md-layout-item md-size-70 md-small-size-100">
        <md-card-header>
          <div
            class="md-title"
          >To verify your profile as an institution, please provide your company details below.</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getCompanyValidationClass('name')">
                <label for="company">Company</label>
                <md-input
                  name="company"
                  id="company"
                  autocomplete="company"
                  v-model="companyForm.name"
                />
                <span
                  class="md-error"
                  v-if="!$v.companyForm.name.required"
                >The company name is required</span>
                <span
                  class="md-error"
                  v-else-if="!$v.companyForm.name.minlength"
                >Invalid company name</span>
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
              v-model="companyForm.email"
            />
            <span class="md-error" v-if="!$v.companyForm.email.required">The email is required</span>
            <span class="md-error" v-else-if="!$v.companyForm.email.email">Invalid email</span>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-raised md-accent" @click="createUser">Create user</md-button>
        </md-card-actions>
        <!-- {{form.orcid}} -->
      </md-content>

      <md-snackbar :md-active.sync="userSaved">The user {{ lastUser }} was saved with success!</md-snackbar>
    </form>
    <br />
    <br />
    <md-dialog :md-active.sync="newUser">
      <md-dialog-title>Create an account</md-dialog-title>
      <md-content style="padding:30px">
        <p>To use the Unicorn platform you first need to create an account. This will add your information to the blockchain and be used to verify your identity when you add new publications or place bids on research. As an academic you will require an OrcidID to make your account. A company needs a name an an email address.</p>
      </md-content>
    </md-dialog>
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
import { min } from "bn.js";
var jwt = require("jsonwebtoken");
export default {
  name: "FormValidation",
  mixins: [validationMixin],
  data: () => ({
    newUser: false,
    accountType: "academic",
    academicForm: {
      firstName: "",
      lastName: "",
      email: "",
      orcid: "",
      university: ""
    },
    companyForm: {
      name: "",
      email: ""
    },
    userSaved: false,
    sending: false,
    lastUser: ""
  }),
  validations: {
    academicForm: {
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
      }
    },
    companyForm: {
      name: {
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
    console.log("CreateProfile Mounted");
    console.log(this.$route);
    let token = this.getFragmentParameterByName("id_token", this.$route.hash);
    if (token) {
      let decoded = jwt.decode(token);
      console.log("decoded");
      console.log(decoded);
      this.academicForm.firstName = decoded.given_name;
      this.academicForm.lastName = decoded.family_name;
      this.academicForm.orcid = decoded.sub;
    }

    if (this.$route.query.newUser == "true") {
      console.log("onboarding new user");
      this.newUser = true;
    }
  },
  methods: {
    ...mapActions(["CREATE_USER"]),
    createUser() {
      console.log("user button clicked");
      if (this.canCreateUser) {
        console.log("Create User method");
        let submitBlob =
          this.accountType == "academic" ? this.academicForm : this.companyForm;
        submitBlob["timestamp"] = new Date();
        submitBlob["accountType"] = this.accountType;
        console.log("user create blob");
        this.CREATE_USER(submitBlob);
      }
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
      const field = this.$v.academicForm[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    getCompanyValidationClass(fieldName) {
      const field = this.$v.companyForm[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.academicForm.firstName = "";
      this.academicForm.lastName = "";
      this.academicForm.university = "";
      this.academicForm.email = "";
      this.companyForm.name = "";
      this.companyForm.email = "";
    }
  },
  computed: {
    canCreateUser() {
      if (this.accountType == "academic") {
        if (
          this.academicForm.firstName != "" &&
          this.academicForm.lastName != "" &&
          this.academicForm.university != "" &&
          this.academicForm.email != "" &&
          this.academicForm.orcid != ""
        ) {
          return true;
        }
      }

      if (this.accountType == "company") {
        if (this.companyForm.email != "" && this.companyForm.name != "") {
          return true;
        }
      }
      console.log("values not added correctly");
      return false;
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