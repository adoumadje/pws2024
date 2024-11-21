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
    },
    emits: ['refreshOutput', 'displayMessage'],
    methods: {
        clearClicked() {
            this.inputData = {}
        },
        createClicked() {
            delete this.inputData._id
            fetch('/api', {
                method: 'POST',
                headers: { 'Content-type': 'appliaction/json' },
                body: JSON.stringify(this.inputData)
            })
            .then((res) => {
                res.json().then((body) => {
                    if(res.status < 400) {
                        this.$emit('displayMessage', body.firstName + ' ' + body.lastName + ' was created')
                        this.$emit('refreshOutput')
                        this.clearClicked()
                    } else {
                        this.$emit('displayMessage', body.error, 'error')
                    }
                })
                .catch((err) => {
                    this.$emit('displayMessage', 'Error ' + res.status, 'error')
                })
            })
        },
        updateClicked() {
            fetch('/api', {
                method: 'PUT',
                headers: { 'Content-type': 'application/json'},
                body: JSON.stringify(this.inputData)
            })
            .then((res) => {
                res.json().then((body) => {
                    if(res.status < 400) {
                        this.$emit('displayMessage', body.firstName + ' ' + body.lastName + ' was updated')
                        this.$emit('refreshOutput')
                        this.clearClicked()
                    } else {
                        this.$emit('displayMessage', body.error, 'error')
                    }
                })
                .catch((err) => {
                    this.$emit('displayMessage', 'Error ' + res.status, 'error')
                })
            })
        },
        deleteClicked() {
            fetch('/api?_id=' + this.inputData._id, {
                method: 'DELETE'
            })
            .then((res) => {
                res.json().then((body) => {
                    if(res.status < 400) {
                        this.$emit('displayMessage', body.firstName + ' ' + body.lastName + ' was deleted')
                        this.$emit('refreshOutput')
                        this.clearClicked()
                    } else {
                        this.$emit('displayMessage', body.error, 'error')
                    }
                })
                .catch((err) => {
                    this.$emit('displayMessage', 'Error ' + res.status, 'error')
                })
            })
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
                <v-btn variant="elevated" @click="clearClicked">Clear</v-btn>
                <v-btn variant="elevated" color="primary" v-if="!inputData._id" :disabled="!isValid"
                    @click="createClicked">Create</v-btn>
                <v-btn variant="elevated" color="secondary" v-if="inputData._id" :disabled="!isValid"
                    @click="updateClicked">Update</v-btn>
                <v-btn variant="elevated" color="error" v-if="inputData._id"
                    @click="deleteClicked">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<style scoped>

</style>