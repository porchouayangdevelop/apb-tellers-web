import type {ApexOptions} from "apexcharts";

interface Stat {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
  color: string
}

interface MenuItem {
  title: string
  icon: string
  value: string
}

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  avatar: string
  lastLogin: string
}

interface Activity {
  id: number
  title: string
  description: string
  time: string
  color: string
}

interface Settings {
  siteName: string
  adminEmail: string
  enableNotifications: boolean
  maintenanceMode: boolean
  twoFactorAuth: boolean
  loginNotifications: boolean
  sessionTimeout: string
}
interface DashboardStat {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
  color: string
}

interface ChartConfig {
  options: ApexOptions
  series: any[]
}

export type {
  Stat,
  MenuItem,
  User,
  Activity,
  Settings,
  DashboardStat,
  ChartConfig
}


