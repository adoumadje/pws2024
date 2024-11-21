<script>
export default {
    data() {
        return {
            inputData: {},
            isValid: false,
            rules: {
                startsWithCapital: (value) => {
                    return /^[A-Z]/.test(value) ? 
                        true : 'It should start with a capital letter'
                },
                startsWithLetter: (value) => {
                    return /^[A-Za-z]/.test(value) ? 
                        true : 'It should start with a letter'
                },
                validDate: (value) => {
                    return isNaN(Date.parse(value)) ? 'Invalid date' : true
                }
            }
        }
    }
}
</script>

<template>
    <v-form v-model="isValid">
        <v-card variant="outlined">
            <v-card-title>
                Enter data
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-subtitle>
                {{ inputData._id || 'to create' }}
            </v-card-subtitle>
            <v-card-text>
                <v-text-field v-model="inputData.firstName" label="First Name" variant="outlined"
                    :rules="[rules.startsWithCapital]"></v-text-field>
                <v-text-field v-model="inputData.lastName" label="Last Name" variant="outlined"
                    :rules="[rules.startsWithLetter]"></v-text-field>
                <v-text-field v-model="inputData.birthDate" label="Birth Date" variant="outlined" type="date"
                    :rules="[rules.validDate]"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="elevated">Clear</v-btn>
                <v-btn variant="elevated" color="primary" v-if="!inputData._id" :disabled="!isValid">Create</v-btn>
                <v-btn variant="elevated" color="secondary" v-if="inputData._id" :disabled="!isValid">Update</v-btn>
                <v-btn variant="elevated" color="error" v-if="inputData._id">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<style scoped>

</style>