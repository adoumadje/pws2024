<script>
const authEndpoint = 'api/auth'

export default {
    data() {
        return {
            input: { username: '', password: '' },
            isValid: false,
            rules: {
                required: (val) => {
                    return val.length > 0 || 'Required field'
                }
            }
        }
    },
    emits: ['close'],
    methods: {
        close() {
            this.$emit('close')
        },
        send() {
            fetch(authEndpoint, {
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
                        this.$emit('close', 'Successful login')
                    }
                })
                .catch((err) => {
                    this.$emit('close', 'Backend does not respond', 'error')
                })
            })
        }
    }
}
</script>

<template>
    <v-form v-model="isValid">
        <v-card>
            <v-card-title>Login</v-card-title>
            <v-card-text>
                <v-text-field v-model="input.firstName" label="User Name" variant="outlined"
                    :rules="[rules.required]"></v-text-field>
                <v-text-field v-model="input.birthDate" label="Password" variant="outlined" type="password"
                    :rules="[]"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="elevated" color="primary" v-if="!input._id" :disabled="!isValid"
                    @click="send">Login</v-btn>
                <v-btn variant="elevated" @click="close">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<style scoped>

</style>