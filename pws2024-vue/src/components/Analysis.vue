<script>
import { GanttComponent, Filter, Toolbar } from '@syncfusion/ej2-vue-gantt';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF1cXmhLYVF1WmFZfVtgdV9DaVZQRGY/P1ZhSXxWdkdiX35ddX1URmVVVEM=');

const projectEndpoint = "/api/project"

export default {
 name: "App",
 components: {
   'ejs-gantt' : GanttComponent
 },

 data() {
     return{
           data: [],
           height: '450px',
           taskFields: {
            id: '_id',
            name: 'name',
            startDate: 'startDate',
            endDate: 'endDate',
            expandState: 'isExpanded',
            child: 'tasks',
           },
           columns: [
                { field: 'name', headerText: 'Name', width: '250' , clipMode: 'EllipsisWithTooltip' },
               { field: 'startDate', headerText: 'Start Date' },
               { field: 'endDate', headerText: 'End Date' },
           ],
           timelineSettings: {
               timelineUnitSize: 60,
               topTier: {
               format: 'MMM dd, yyyy',
               unit: 'Week',
               },
               bottomTier: {
               unit: 'Day',
               },
           },
           splitterSettings: {
               columnIndex: 3
            },
           labelSettings: {
               rightLabel: 'name',
           },
           projectStartDate: new Date(),
           projectEndDate: new Date()  
     };
 },
 provide: {
     gantt: [ Filter, Toolbar ]
 },

 mounted() {
    fetch(projectEndpoint + '?' + new URLSearchParams({ sort: 'name', order: 1 }).toString())
    .then(res => res.json().then(facet => {
        this.data = facet.data
        for(let i = 0; i < this.data.length; i++){
            this.data[i].startDate = new Date(this.data[i].startDate)
            if(this.data[i].startDate < this.projectStartDate){
                this.projectStartDate = this.data[i].startDate
            }
            this.data[i].endDate = new Date(this.data[i].endDate)
            this.data[i].isExpanded = false
        }
        console.log(this.data)
    }))
 }
};
</script>


<template>
    <h1>Analysis</h1>
    <br>
    <div>
       <ejs-gantt ref='gantt' id="GanttContainer" :dataSource="data" :taskFields = "taskFields" :height = "height" :columns="columns" :toolbar="toolbar" :allowFiltering= "true" :timelineSettings="timelineSettings" :splitterSettings= "splitterSettings" :labelSettings= "labelSettings" :projectStartDate="projectStartDate" :projectEndDate= "projectEndDate"></ejs-gantt>
   </div>
</template>

<style>
/*@import url('https://cdn.syncfusion.com/ej2/material.css');*/
</style>