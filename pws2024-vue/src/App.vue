<script>
import DataInput from './components/DataInput.vue';

export default {
  data() {
    return {
      inputData: {
        firstName: '',
        yearOfBirth: 2000
      }
    }
  },
  components: { DataInput },
  methods: {
    
  }
}
</script>

<template>
  <div>
    <DataInput class="horizontalElement"></DataInput>
  </div>
</template>

<style scoped>
  .horizontalElement {
    width: 400px;
  }
</style>
