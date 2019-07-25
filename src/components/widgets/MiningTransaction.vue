<template>
  <div v-if="miningTransactionObject.status!=null">
    <md-dialog
      :md-active.sync="miningTransactionObject.status!=null"
      style="background-color: #DEDDDE;"
    >
      <md-dialog-title
        v-if="miningTransactionObject.status=='uploading'"
      >Your content is uploading to IPFS...</md-dialog-title>
      <md-dialog-title
        v-if="miningTransactionObject.status=='pending'"
      >Please approve the transaction...</md-dialog-title>
      <md-dialog-title v-if="miningTransactionObject.status=='mining'">Your transaction is mining...</md-dialog-title>
      <md-dialog-title v-if="miningTransactionObject.status=='done'">Transaction mined!</md-dialog-title>
      {{miningTransactionObject}}
      <video
        class="text-center"
        alt="step logo"
        style="height:200px;"
        type="video/webm"
        src="../../assets/miningTransaction.webm"
        autoplay="true"
        loop="true"
      />
      <p style="padding:30px" v-if="miningTransactionObject.status=='mining'">
        Please be patient while your transaction mines. you can view the status here on EtherScan
        <clickable-transaction :transaction="miningTransactionObject.txHash" />.
      </p>

      <p style="padding:30px" v-if="miningTransactionObject.status=='done'">
        Transaction has been mined! You can view the transaction info on EtherScan
        <clickable-transaction :transaction="miningTransactionObject.txHash" />.
      </p>
      <md-button
        v-if="miningTransactionObject.status=='done'"
        class="md-primary"
        @click="modalClosed"
      >Close</md-button>
    </md-dialog>
  </div>
</template>

<script>
/* global web3:true */
import { mapActions, mapState } from "vuex";

import ClickableTransaction from "@/components/widgets/ClickableTransaction";

export default {
  name: "miningTransaction",
  components: { ClickableTransaction },
  data: () => ({
    showDialog: true
  }),
  methods: {
    ...mapActions(["CLOSE_MINING_DIALOG"]),
    modalClosed() {
      console.log("CLOSED");
      this.CLOSE_MINING_DIALOG();
    }
  },
  computed: {
    ...mapState(["etherscanBase", "miningTransactionObject"])
  }
};
</script>

<style>
</style>
