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
               dependency: 'Predecessor',
               child: 'tasks',
           },
           columns: [
               { field: 'TaskName', headerText: 'Task Name', width: '250' , clipMode: 'EllipsisWithTooltip' },
               { field: 'StartDate', headerText: 'Start Date' },
               { field: 'EndDate', headerText: 'End Date' },
               { field: 'Predecessor', headerText: 'Predecessor' }
           ],
           toolbar: ['Search'],
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
               rightLabel: 'TaskName',
           },
           projectStartDate: new Date('04/01/2019 01:00:00 AM'),
           projectEndDate: new Date('05/10/2019')  
     };
 },
 provide: {
     gantt: [ Filter, Toolbar ]
 },

 mounted() {
    fetch(projectEndpoint + '?' + new URLSearchParams({ sort: 'name', order: 1 }).toString())
    .then(res => res.json().then(facet => {
        this.data = facet.data
        console.log(this.data)
    }))
 }
};
</script>


<template>
    <div>
       <ejs-gantt ref='gantt' id="GanttContainer" :dataSource="data" :taskFields = "taskFields" :height = "height" :columns="columns" :toolbar="toolbar" :allowFiltering= "true" :timelineSettings="timelineSettings" :splitterSettings= "splitterSettings" :labelSettings= "labelSettings" :projectStartDate="projectStartDate" :projectEndDate= "projectEndDate"></ejs-gantt>
   </div>
</template>

<style>
@import url('https://cdn.syncfusion.com/ej2/material.css');
</style>