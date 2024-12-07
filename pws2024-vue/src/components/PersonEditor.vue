<script>
export default {
    data() {
        return {
            input: {},
            isValid: false,
            rules: {
                startsWithLetter: (value) => {
                    const pattern = /^\p{L}/u
                    return pattern.test(value) || 'It should start with a letter'
                },
                validDate: (value) => {
                    const data = new Date(value)
                    return date <= new Date() || 'It cannot be from the futur'
                }
            }
        }
    },
    props: ['person'],
    emits: ['refreshOutput', 'displayMessage'],
    methods: {
        clear() {
            this.input = { _id: this.input._id }
            this.isValid = false
        },
        importData(data) {
            this.clearClicked()
            Object.assign(this.input, data)
        },
        createClicked() {
            delete this.input._id
            fetch('/api', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(this.input)
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
                body: JSON.stringify(this.input)
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
            fetch('/api?_id=' + this.input._id, {
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
                {{ input._id || 'to create' }}
            </v-card-subtitle>
            <v-card-text>
                <v-text-field v-model="input.firstName" label="First Name" variant="outlined"
                    :rules="[rules.startsWithCapital]"></v-text-field>
                <v-text-field v-model="input.lastName" label="Last Name" variant="outlined"
                    :rules="[rules.startsWithLetter]"></v-text-field>
                <v-text-field v-model="input.birthDate" label="Birth Date" variant="outlined" type="date"
                    :rules="[rules.validDate]"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="elevated" @click="clear">Clear</v-btn>
                <v-btn variant="elevated" color="primary" v-if="!input._id" :disabled="!isValid"
                    @click="createClicked">Create</v-btn>
                <v-btn variant="elevated" color="error" v-if="input._id"
                    @click="deleteClicked">Delete</v-btn>
                <v-btn variant="elevated" color="secondary" v-if="input._id" :disabled="!isValid"
                    @click="updateClicked">Update</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<style scoped>

</style>