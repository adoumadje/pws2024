<script>
import DataInput from './components/DataInput.vue';

export default {
  data() {
    return {
      
    }
  },
  components: { DataInput },
  methods: {
    onDisplayMessage() {

    },
    onRefreshOutput() {
      
    }
  }
}
</script>

<template>
  <div>
    <DataInput @display-message="" @refresh-output="" class="horizontalElement"></DataInput>
  </div>
</template>

<style scoped>
  .horizontalElement {
    width: 400px;
  }
</style>
