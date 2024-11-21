<script>
export default {
    data() {
        return {
            inputData: {},
        }
    }
}
</script>

<template>
    <v-form>
        <v-card>
            <v-card-title>
                Enter data
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-subtitle>
                {{ inputData._id || 'to create' }}
            </v-card-subtitle>
            <v-card-text>
                <v-text-field v-model="inputData.firstName" label="First Name" variant="outlined"></v-text-field>
                <v-text-field v-model="inputData.lastName" label="Last Name" variant="outlined"></v-text-field>
                <v-text-field v-model="inputData.birthDate" label="Birth Date" variant="outlined" type="date"></v-text-field>
            </v-card-text>
        </v-card>
    </v-form>
</template>

<style scoped>

</style>