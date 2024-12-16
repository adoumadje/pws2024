<script>
const projectEndpoint = 'api/project'

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
                    return date <= new Date() || 'Use a proper date'
                }
            }
        }
    },
    props: ['project'],
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
            fetch(projectEndpoint, {
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
                        this.$emit('close', `${data.name} - added`)
                        this.$emit('listChanged')
                    }
                })
                .catch((err) => {
                    this.$emit('close', 'Data discarded', 'error')
                })
            })
        },
        update() {
            fetch(projectEndpoint, {
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
                        this.$emit('close', `${data.name} - updated`)
                        this.$emit('listChanged')
                    }
                })
                .catch((err) => {
                    this.$emit('close', 'Data discarded', 'error')
                })
            })
        },
        remove() {
            fetch(projectEndpoint + '?' + new URLSearchParams({_id: this.input._id}), {
                method: 'DELETE'
            })
            .then((res) => {
                res.json().then((data) => {
                    if(!res.ok) {
                        this.$emit('close', data.error, 'erro')
                    } else {
                        this.input = {}
                        this.$emit('close', `${data.name} - deleted`)
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
                {{ input._id || 'new project' }}
            </v-card-subtitle>
            <v-card-text>
                <v-text-field v-model="input.name" label="Name" variant="outlined"
                    :rules="[rules.startsWithLetter]"></v-text-field>
                <v-text-field v-model="input.startDate" label="Start Date" variant="outlined" type="date"
                    :rules="[rules.validDate]"></v-text-field>
                <v-text-field v-model="input.endDate" label="End Date" variant="outlined" type="date"
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
                <v-btn variant="elevated" @click="close">close</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<style scoped>

</style>