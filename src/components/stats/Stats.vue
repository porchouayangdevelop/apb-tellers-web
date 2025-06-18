<script setup lang="ts">
import type {Stat} from "@/types";
import {storeToRefs} from "pinia";
import {appStore} from "@/stores/appStore.ts";

const {currentView} = storeToRefs(appStore()); //state
const {} = appStore(); //actions

const stats: Stat[] = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12%',
    trend: 'up',
    icon: 'mdi-account-group',
    color: 'primary'
  },
  {
    title: 'Revenue',
    value: '$45,678',
    change: '+8%',
    trend: 'up',
    icon: 'mdi-currency-usd',
    color: 'success'
  },
  {
    title: 'Orders',
    value: '1,234',
    change: '-3%',
    trend: 'down',
    icon: 'mdi-shopping',
    color: 'warning'
  },
  {
    title: 'Conversion',
    value: '3.2%',
    change: '+0.5%',
    trend: 'up',
    icon: 'mdi-chart-line',
    color: 'info'
  }
];

const revenueChartOptions = ref({
  chart: {
    type: 'area',
    height: 300,
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    }
  },
  series: [{
    name: 'Revenue',
    data: [12000, 19000, 15000, 25000, 22000, 30000]
  }],
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  colors: ['#1976D2'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
    }
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    strokeDashArray: 5
  }
})

const trafficChartOptions = ref({
  chart: {
    type: 'donut',
    height: 300
  },
  series: [35, 25, 20, 20],
  labels: ['Direct', 'Social', 'Email', 'Search'],
  colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
  plotOptions: {
    pie: {
      donut: {
        size: '60%'
      }
    }
  },
  legend: {
    position: 'bottom'
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return Math.round(val) + '%'
    }
  }
})
</script>

<template>
  <v-row>
    <v-col
      v-for="stat in stats"
      :key="stat.title"
      cols="12"
      sm="6"
      md="3"
    >
      <v-card class="dashboard-card" elevation="2">
        <v-card-text>
          <div class="d-flex align-center">
            <div class="flex-grow-1">
              <div class="text-subtitle-2 text-grey-darken-1 mb-1">
                {{ stat.title }}
              </div>
              <div class="stat-number" :class="stat.color">
                {{ stat.value }}
              </div>
              <div class="text-caption d-flex align-center">
                <v-icon
                  :icon="stat.trend === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'"
                  :color="stat.trend === 'up' ? 'success' : 'error'"
                  size="small"
                  class="me-1"
                ></v-icon>
                {{ stat.change }}
              </div>
            </div>
            <v-icon
              :icon="stat.icon"
              size="40"
              :color="stat.color"
              class="ms-3"
            ></v-icon>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Charts Row -->
  <v-row class="mt-4">
    <v-col cols="12" md="8">
      <v-card elevation="2">
        <v-card-title>Revenue Overview</v-card-title>
        <v-card-text>
          <apexchart
            type="area"
            height="300"
            :options="revenueChartOptions"
            :series="revenueChartOptions.series"
          ></apexchart>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card elevation="2">
        <v-card-title>Traffic Sources</v-card-title>
        <v-card-text>
          <apexchart
            type="donut"
            height="300"
            :options="trafficChartOptions"
            :series="trafficChartOptions.series"
          ></apexchart>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.stat-number {
  font-size: 2rem;
  font-weight: bold;
}

.chart-container {
  height: 300px;
}
</style>
