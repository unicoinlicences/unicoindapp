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
      <label>Email Address</label>
      <md-input v-model="Email"></md-input>
      <span class="md-helper-text"></span>
    </md-field>

    <md-field>
      <label>Chat to Us</label>
      <md-textarea v-model="textarea"></md-textarea>
    </md-field>

  </div>
</template>

<script>
  export default {
    name: 'TextFields',
    data: () => ({
      FullName: null,
      Institution: null,
      Email: null,
      textarea: null,
    })
  }
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>