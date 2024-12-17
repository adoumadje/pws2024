<script>
const authEndpoint = 'api/auth'

export default {
    emits: ['close'],
    methods: {
        close() {
            this.$emit('close')
        },
        logout() {
            fetch(authEndpoint, {
                method: 'DELETE'
            })
            .then((res) => {
                res.json().then((data) => {
                    if(!res.ok) {
                        this.$emit('close', data.error, 'erro')
                    } else {
                        this.input = {}
                        this.$emit('close', 'Successful logout')
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
            <v-card-title>Logout</v-card-title>
            <v-card-text>Are you sure?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="elevated" color="primary" v-if="!input._id" :disabled="!isValid"
                    @click="logout">Logout</v-btn>
                <v-btn variant="elevated" @click="close">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<style scoped>

</style>