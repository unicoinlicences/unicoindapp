<template>
  <div class="home">
    <div class="md-layout md-gutter">
      <div class="md-layout-item" style="padding-top:100px; padding-left:150px">
        <span class="md-display-3">Unlock the value in academic research</span>
        <p style="padding-top:20px">
          <br />Research marketplace to empower academics to benefit from commercially viable work. Companies can buy direct access to ideas they want to implement.
          <br />
          <br />
          <md-button class="md-raised md-primary" @click="goToBegin" style="margin-top:25px">Begin</md-button>
          <md-button class="md-raised" @click="goToCreate" style="margin-top:25px">Learn More</md-button>
        </p>
      </div>
      <div class="md-layout-item md-size-40">
        <img
          class="text-center"
          alt="step logo"
          style="height:500px;"
          src="../assets/unicorn_running.gif"
        />
      </div>
    </div>
    <div class="md-layout md-gutter" style="padding-top:25px">
      <div class="md-layout-item text-center">
        <img class="text-center" alt="step logo" style="height:85px;" src="../assets/012-login.png" />
        <p
          class="text-center"
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum ullam totam laborum voluptate eos in, quam iure fugiat iusto non voluptatem, dolor officiis molestiae, modi placeat assumenda eum magni. Suscipit.</p>
      </div>
      <div class="md-layout-item">
        <img
          class="text-center"
          alt="step logo"
          style="height:85px;"
          src="../assets/007-arithmetic.png"
        />
        <p
          class="text-center"
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum ullam totam laborum voluptate eos in, quam iure fugiat iusto non voluptatem, dolor officiis molestiae, modi placeat assumenda eum magni. Suscipit.</p>
      </div>
      <div class="md-layout-item">
        <img
          class="text-center"
          alt="step logo"
          style="height:85px;"
          src="../assets/008-ethereum.png"
        />
        <p
          class="text-center"
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum ullam totam laborum voluptate eos in, quam iure fugiat iusto non voluptatem, dolor officiis molestiae, modi placeat assumenda eum magni. Suscipit.</p>
      </div>
      <div class="md-layout-item">
        <img
          class="text-center"
          alt="step logo"
          style="height:85px;"
          src="../assets/005-rising.png"
        />
        <p
          class="text-center"
        >Sell your Ether into Dai or cDai automatically over your chosen sell range. Start earning interest on your realized profits immediately.</p>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
export default {
  name: "home",
  methods: {
    goToBegin() {
      router.push({ name: "create" });
    }
  }
};
</script>


