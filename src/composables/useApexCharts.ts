import type {ChartConfig} from "@/types";
export const useApexCharts = () => {
  const createAreaChart = (
    data: number[],
    categories: string[],
    title: string = '',
    color: string = '#1976D2'
  ): ChartConfig => {
    return {
      options: {
        chart: {
          type: 'area',
          height: 300,
          toolbar: { show: false },
          animations: {
            enabled: true,
            // easing: 'easeinout',
            speed: 800
          }
        },
        title: { text: title },
        xaxis: { categories },
        colors: [color],
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
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 5 }
      },
      series: [{ name: title, data }]
    }
  }

  const createDonutChart = (
    data: number[],
    labels: string[],
    colors: string[] = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
  ): ChartConfig => {
    return {
      options: {
        chart: {
          type: 'donut',
          height: 300
        },
        labels,
        colors,
        plotOptions: {
          pie: {
            donut: { size: '60%' }
          }
        },
        legend: { position: 'bottom' },
        dataLabels: {
          enabled: true,
          formatter: function (val: number) {
            return Math.round(val) + '%'
          }
        }
      },
      series: data
    }
  }

  const createColumnChart = (
    data: number[],
    categories: string[],
    title: string = '',
    color: string = '#36A2EB'
  ): ChartConfig => {
    return {
      options: {
        chart: {
          type: 'bar',
          height: 300,
          toolbar: { show: false }
        },
        title: { text: title },
        xaxis: { categories },
        colors: [color],
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '60%'
          }
        },
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 5 }
      },
      series: [{ name: title, data }]
    }
  }

  const createRadarChart = (
    data: number[],
    categories: string[],
    title: string = '',
    color: string = '#FF6384'
  ): ChartConfig => {
    return {
      options: {
        chart: {
          type: 'radar',
          height: 300
        },
        title: { text: title },
        xaxis: { categories },
        colors: [color],
        plotOptions: {
          radar: {
            size: 120,
            polygons: {
              strokeColors: '#e9e9e9',
              fill: {
                colors: ['#f8f8f8', '#fff']
              }
            }
          }
        },
        fill: { opacity: 0.1 },
        stroke: {
          show: true,
          width: 2,
          colors: [color],
          dashArray: 0
        },
        markers: {
          size: 4,
          colors: [color],
          strokeColors: '#fff',
          strokeWidth: 2
        },
        yaxis: { min: 0, max: 100 }
      },
      series: [{ name: title, data }]
    }
  }

  return {
    createAreaChart,
    createDonutChart,
    createColumnChart,
    createRadarChart
  }


}
