<script setup lang="ts">
import {storeToRefs} from "pinia";
import {appStore} from "@/stores/appStore.ts";
import {useTheme} from 'vuetify'
import {useAuthStore} from "@/stores/authStore.ts";
import {useRouter} from "vue-router";

const router = useRouter();



const {drawer, isRails,currentView} = storeToRefs(appStore()); //state
const {} = appStore(); //actions
const authStore = useAuthStore();

const theme = useTheme();
const dark = 'dark';

const toggleTheme =() => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

// Handle logout
const handleLogout = async () => {
  try {
    await authStore.logout()
    await router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Force logout even if API call fails
    authStore.clearAuth()
    await router.push('/login')
  }
}

// Navigate to profile
const goToProfile = () => {
  router.push('/profile')
}

// Navigate to settings
const goToSettings = () => {
  currentView.value = 'settings'
}
</script>

<template>
  <v-app-bar app elevation="1" density="compact">
    <v-app-bar-nav-icon @click="drawer = !drawer" />

    <v-toolbar-title>
      Admin Dashboard
      <v-chip
        v-if="authStore.user"
        size="small"
        color="primary"
        variant="outlined"
        class="ml-2"
      >
        {{ authStore.userRole }}
      </v-chip>
    </v-toolbar-title>

    <v-spacer />

    <!-- Notifications -->
    <v-btn icon="mdi-bell-outline" variant="text" />

    <!-- Messages with badge -->
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
        >
          <v-badge color="red" content="3">
            <v-icon>mdi-email-outline</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-list nav density="compact">
        <v-list-item title="New message from John" prepend-icon="mdi-email" />
        <v-list-item title="Meeting reminder" prepend-icon="mdi-calendar" />
        <v-list-item title="System alert" prepend-icon="mdi-alert" />
      </v-list>
    </v-menu>

    <!-- User Profile Menu -->
    <v-menu v-if="authStore.isAuthenticated">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
        >
          <v-avatar size="32">
            <v-img
              :src="authStore.user?.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'"
              :alt="authStore.user?.name"
            />
          </v-avatar>
        </v-btn>
      </template>

      <v-list nav density="compact" min-width="200">
        <!-- User Info Header -->
        <v-list-item
          :title="authStore.user?.name"
          :subtitle="authStore.user?.email"
          prepend-avatar=""
        >
          <template v-slot:prepend>
            <v-avatar size="40">
              <v-img
                :src="authStore.user?.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'"
                :alt="authStore.user?.name"
              />
            </v-avatar>
          </template>
        </v-list-item>

        <v-divider />

        <!-- Menu Items -->
        <v-list-item
          title="Profile"
          prepend-icon="mdi-account"
          @click="goToProfile"
        />

        <v-list-item
          v-if="authStore.hasRole('admin')"
          title="Settings"
          prepend-icon="mdi-cog"
          @click="goToSettings"
        />

        <v-divider />

        <!-- Logout -->
        <v-list-item
          title="Logout"
          prepend-icon="mdi-logout"
          @click="handleLogout"
        >
          <template v-slot:title>
            <span class="text-error">Logout</span>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Login button for non-authenticated users -->
    <v-btn
      v-else
      color="primary"
      variant="outlined"
      @click="router.push('/login')"
    >
      Login
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
.text-error {
  color: rgb(var(--v-theme-error));
}
</style>
