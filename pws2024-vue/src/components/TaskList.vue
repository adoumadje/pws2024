<script>
import TaskEditor from './TaskEditor.vue';
import common from '../mixins/common';


const taskEndpoint = "/api/task"
const personEndpoint = "/api/person"

export default {
    data() {
        return {
            tasks: [],
            task: {},
            persons: [],
            editor: false,
            itemsPerPage: 10,
            headers: [
                {title: 'Name', key: 'name', align: 'start', sortable: true},
                {title: 'Start Date', key: 'startDate', align: 'end'},
                {title: 'End Date', key: 'endDate', align: 'end'},
                {title: '#Contractors', key: 'contractor_ids', align: 'end'}
            ],
            loading: false,
            search: '',
            itemsLength: 0,
            serverItems: [],
            tableKey: 0
        }
    },
    methods: {
        loadItems({ page, itemsPerPage, sortBy }) {
            this.loading = true
            const skip = (page - 1) * itemsPerPage
            let queryString = { skip, limit: itemsPerPage, search: this.search, project_id: this.project._id }
            if(sortBy && sortBy[0]) {
                queryString.sort = sortBy[0].key
                queryString.order = sortBy[0].order == 'asc' ? 1 : -1
            }
            fetch(taskEndpoint + '?' + new URLSearchParams(queryString).toString())
            .then(res => res.json().then(facet => {
                this.itemsLength = +facet.total
                this.serverItems = facet.data
                this.loading = false    
            }))
            .catch(err => {
                console.error(err)
            })
        },

        onListChanged() {
            this.tableKey++
            this.$emit('listChanged')
        },

        clickItem(item, event) {
            if(this.checkIfInRole(this.session, [0])) {
                this.task = event.item
                this.editor = true
            }
        },
        add() {
            this.task = {}
            this.editor = true
        },
        editorClose(text, color) {
            this.editor = false
            if(text) {
                this.$emit('dispalyMessage', text, color)
            }
        }
    },
    mounted() {
        fetch(personEndpoint + '?' + new URLSearchParams({ project_id: this.project._id,
            sort: 'firstName', order: 1 }).toString())
        .then(res => res.json().then(facet => {
            this.persons = facet.data
        }))
    },
    emits: ['dispalyMessage', 'listChanged'],
    mixins: [common],
    props: ['session', 'project'],
    components: { TaskEditor },
}
</script>

<template>
    <v-card variant="outlined">
        <v-card-title class="d-flex">
            tasks
            <v-spacer></v-spacer>
            <v-btn v-show="checkIfInRole(session, [0]) && project._id" @click="add">Add</v-btn>
        </v-card-title>
        <v-card-text>
            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems" 
            :items-length="itemsLength" :loading="loading" :search="search" :key="tableKey" 
            @update:options="loadItems" @click:row="clickItem" 
            itemsPerPageText="# items on the page" pageText="{0}-{1} of {2}" density="compact"> 

            <template #item.startDate="{ item }">
                {{ new Date(item.startDate).toLocaleDateString() }}
            </template>
            <template #item.endDate="{ item }">
                {{ item.endDate ? new Date(item.endDate).toLocaleDateString() : '' }}
            </template>
            <template #item.contractor_ids="{ item }">
                {{ item.contractor_ids ? item.contractor_ids.length : 0 }}
            </template>
            <template #footer.prepend>
                <v-text-field v-model="search" class="mr-5" variant="outlined" density="compact" 
                placeholder="search..." hide-details prepend-icon="mdi-magnify"></v-text-field>
            </template>
            
            </v-data-table-server>
        </v-card-text>
    </v-card>

    <v-dialog v-model="editor" width="50%">
        <TaskEditor :task="task" :project="project" @close="editorClose" @list-changed="onListChanged"></TaskEditor>
    </v-dialog>
</template>

<style scoped>

</style>