<script>
const personEndpoint = 'api/person'

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
                    const date = new Date(value)
                    return date <= new Date() || 'It cannot be from the futur'
                }
            }
        }
    },
    props: ['person'],
    emits: ['close', 'listChanged'],
    methods: {
        clear() {
            this.input = { _id: this.input._id }
            this.isValid = false
        },
        close() {
            this.$emit('close')
        },
        setData(data) {
            this.input = {}
            Object.assign(this.input, data)
        },
        send() {
            fetch(personEndpoint, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(this.input)
            })
            .then((res) => {
                res.json().then((data) => {
                    if(!res.ok) {
                        this.$emit('close', data.error, 'erro')
                    } else {
                        this.input = {}
                        this.$emit('close', `${data.firstName} ${data.lastName} - added`)
                        this.$emit('listChanged')
                    }
                })
                .catch((err) => {
                    this.$emit('close', 'Data discarded', 'error')
                })
            })
        },
        update() {
            fetch(personEndpoint, {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(this.input)
            })
            .then((res) => {
                res.json().then((data) => {
                    if(!res.ok) {
                        this.$emit('close', data.error, 'erro')
                    } else {
                        this.input = {}
                        this.$emit('close', `${data.firstName} ${data.lastName} - updated`)
                        this.$emit('listChanged')
                    }
                })
                .catch((err) => {
                    this.$emit('close', 'Data discarded', 'error')
                })
            })
        },
        remove() {
            fetch(personEndpoint + '?' + new URLSearchParams({_id: this.input._id}), {
                method: 'DELETE'
            })
            .then((res) => {
                res.json().then((data) => {
                    if(!res.ok) {
                        this.$emit('close', data.error, 'erro')
                    } else {
                        this.input = {}
                        this.$emit('close', `${data.firstName} ${data.lastName} - deleted`)
                        this.$emit('listChanged')
                    }
                })
                .catch((err) => {
                    this.$emit('close', 'Data discarded', 'error')
                })
            })
        }
    },
    mounted() {
        Object.assign(this.input, this.person)
    }
}
</script>

<template>
    <v-form v-model="isValid">
        <v-card>
            <v-card-title>
                {{ input._id ? 'Edit data' : 'Add data' }}
            </v-card-title>
            <v-card-subtitle>
                {{ input._id || 'new person' }}
            </v-card-subtitle>
            <v-card-text>
                <v-text-field v-model="input.firstName" label="First Name" variant="outlined"
                    :rules="[rules.startsWithLetter]"></v-text-field>
                <v-text-field v-model="input.lastName" label="Last Name" variant="outlined"
                    :rules="[rules.startsWithLetter]"></v-text-field>
                <v-text-field v-model="input.birthDate" label="Birth Date" variant="outlined" type="date"
                    :rules="[rules.validDate]"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="elevated" @click="clear">Clear</v-btn>
                <v-btn variant="elevated" color="primary" v-if="!input._id" :disabled="!isValid"
                    @click="send">save</v-btn>
                <v-btn variant="elevated" color="secondary" v-if="input._id" :disabled="!isValid"
                    @click="update">Update</v-btn>
                <v-btn variant="elevated" color="error" v-if="input._id"
                    @click="remove">Delete</v-btn>
                <v-btn variant="elevated" @click="close">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<style scoped>

</style>