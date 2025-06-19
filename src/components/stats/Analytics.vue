<script setup lang="ts">
import {storeToRefs} from "pinia";
import {appStore} from "@/stores/appStore.ts";

const {currentView} = storeToRefs(appStore()); //state
const {} = appStore(); //actions
const pageViewsChartOptions = ref({
  chart: {
    type: 'column',
    height: 300,
    toolbar: {
      show: false
    }
  },
  series: [{
    name: 'Page Views',
    data: [1200, 1900, 800, 1500, 2000, 1800, 1400]
  }],
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  colors: ['#36A2EB'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '60%'
    }
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    strokeDashArray: 5
  }
})

const engagementChartOptions = ref({
  chart: {
    type: 'radar',
    height: 300
  },
  series: [{
    name: 'Current Performance',
    data: [65, 85, 70, 90, 75]
  }],
  xaxis: {
    categories: ['Bounce Rate', 'Session Duration', 'Pages/Session', 'Return Visitors', 'Social Shares']
  },
  colors: ['#FF6384'],
  plotOptions: {
    radar: {
      size: 120,
      polygons: {
        strokeColor: '#e9e9e9',
        fill: {
          colors: ['#f8f8f8', '#fff']
        }
      }
    }
  },
  fill: {
    opacity: 0.1
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['#FF6384'],
    dashArray: 0
  },
  markers: {
    size: 4,
    colors: ['#FF6384'],
    strokeColor: '#fff',
    strokeWidth: 2
  },
  yaxis: {
    min: 0,
    max: 100
  }
})
</script>

<template>
  <!-- Analytics View -->
  <div v-if="currentView === 'analytics'">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Analytics</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Page Views</v-card-title>
          <v-card-text>
            <apexchart
              type="bar"
              height="300"
              :options="pageViewsChartOptions"
              :series="pageViewsChartOptions.series"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="0" flat variant="flat">
          <v-card-title>User Engagement</v-card-title>
          <v-card-text>
            <apexchart
              type="radar"
              height="300"
              :options="engagementChartOptions"
              :series="engagementChartOptions.series"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>

</style>
