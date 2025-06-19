/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import {registerPlugins} from '@/plugins'

// Components
import App from './App.vue'

// Composables
import {createApp} from 'vue'

// Styles
import 'unfonts.css'

import '@/assets/main.css';
import VueApexCharts from 'vue3-apexcharts'
import {useAuthStore} from "@/stores/authStore.ts";

const app = createApp(App)

registerPlugins(app)

app.component('apexchart', VueApexCharts);
// app.mount('#app')

const initApp = async () => {
  app.mount("#app");
  const auth = useAuthStore();
  await auth.initializeAuth();
}

await initApp();
