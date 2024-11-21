<script>
export default {
    data() {
        return {
            dataGathered: []
        }
    },
    methods: {

    }
}
</script>

<template>
    <v-card variant="outlined">
        <v-card-title>Data gathered so far</v-card-title>
        <v-card-text>
            <v-table density="compact">
                <thead>
                    <tr>
                        <th>First Name</th><th>Last Name</th><th>Birth Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="data in dataGathered">
                        <td>{{ data.firstName }}</td><td>{{ data.lastName }}</td>
                        <td>{{ new Date(data.birthDate).toLocaleDateString() }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
    </v-card>
</template>

<style scoped>

</style>