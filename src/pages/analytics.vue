<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">
          <v-icon class="mr-2">mdi-chart-line</v-icon>
          Analytics Dashboard
        </h1>
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
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>User Engagement</v-card-title>
          <v-card-text>
            <apexchart
              type="radar"
              height="300"
              :options="engagementChartOptions"
              :series="engagementChartOptions.series"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>Revenue Trends</v-card-title>
          <v-card-text>
            <apexchart
              type="area"
              height="400"
              :options="revenueChartOptions"
              :series="revenueChartOptions.series"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useEditorProtection } from '@/composables/usePageProtection'

// Protect this page - editor and admin only
useEditorProtection()

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

const revenueChartOptions = ref({
  chart: {
    type: 'area',
    height: 400,
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
    data: [12000, 19000, 15000, 25000, 22000, 30000, 35000, 28000, 33000, 40000, 38000, 45000]
  }],
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
</script>

<style scoped>
.v-card {
  margin-bottom: 1rem;
}
</style>
