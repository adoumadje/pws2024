import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi'
    }
})

// Router
import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from './components/Dashboard.vue'
import PersonList from './components/PersonList.vue'
import ProjectList from './components/ProjectList.vue'
import Charts from './components/Charts.vue'
import Analysis from './components/Analysis.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', component: Dashboard, icon: 'mdi-home', title: 'Dashboard'},
        {path: '/persons', component: PersonList, icon: 'mdi-account-tie-woman', title: 'Persons', roles: [0,1]},
        {path: '/projects', component: ProjectList, icon: 'mdi-projector', title: 'Projects'},
        {path: '/charts', component: Charts, icon: 'mdi-chart-bar', title: 'Charts', roles: [0, 1]},
        {path: '/analysis', component: Analysis, icon: 'mdi-chart-arc', title: 'Analysis', roles: [0]}
    ]
})

createApp(App).use(vuetify).use(router).mount('#app')
