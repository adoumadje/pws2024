<script>
  export default {
    data() {
      return {
        inputData: {
          firstName: '',
          yearOfBirth: 2000
        }
      }
    },
    methods: {
      vuetifyClicked() {
        // console.log('button vuetify clicked', this.inputData);
        fetch('/api', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(this.inputData)
        })
      }
    },
    mounted() {
      console.log('mounted fired');
    }
  }
</script>

<template>
  <div>
    <v-text-field variant="outlined" v-model="inputData.firstName" label="first name"></v-text-field>
    <v-text-field variant="outlined" v-model="inputData.yearOfBirth" label="Year of birth" type="number"></v-text-field>
    <v-btn variant="elevated" color="primary" @click="vuetifyClicked">Vuetify</v-btn>
  </div>
</template>

<style scoped>

</style>
