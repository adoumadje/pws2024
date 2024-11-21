<script>
import DataInput from './components/DataInput.vue';
import DataOutput from './components/DataOutput.vue';

export default {
  data() {
    return {
      messageDisplay: false,
      messageColor: 'red',
      message: ''
    }
  },
  components: { DataInput, DataOutput },
  methods: {
    onDisplayMessage(text, color) {
      this.message = text
      this.messageColor = color || 'success'
      this.messageDisplay = true
    },
    onRefreshOutput() {

    }
  }
}
</script>

<template>
  <div class="horizontal">
    <DataInput @display-message="onDisplayMessage" @refresh-output="onRefreshOutput" class="horizontalElement"></DataInput>
    <DataOutput class="horizontalElement"></DataOutput>
  </div>
  <v-snackbar v-model="messageDisplay" :color="messageColor">
    <div>{{ message }}</div>
  </v-snackbar>
</template>

<style scoped>
  .horizontal {
    display: flex;
  }
  .horizontalElement {
    width: 400px;
    margin: 10px;
  }
</style>
