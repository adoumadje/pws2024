<script>
import common from '../mixins/common';

const projectEndpoint = "/api/project"

import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent])

export default {
    props: ['session'],
    mixins: [common],
    emits: ['display-message'],
    components: { VChart },
    
    data() {
        return {
            chartOptions: {
                title: {
                    text: 'Contractors per project',
                },
                legend: {
                    orient: 'horizontal',
                    left: 'center',
                    bottom: 0,
                    data: ['Contractors']
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: 'Contractors',
                    type: 'bar',
                    data: []
                }]
            }
        }
    },


    mounted() {
        fetch(projectEndpoint + '?' + new URLSearchParams({ sort: 'name', order: 1 }).toString())
        .then(res => res.json().then(facet => {
            this.chartOptions.xAxis.data = facet.data.map(item => item.name)
            this.chartOptions.series[0].data = facet.data.map(item => item.contractor_ids.length || 0)
            console.log(this.chartOptions)
        }))
    }
}
</script>

<template>
    <div>
        <h1>Charts</h1>
        <br>
        <div>
            <v-chart :option="chartOptions" class="barChart"></v-chart>
        </div>
    </div>
</template>

<style>
.barChart {
    height: 400px;
}
</style>