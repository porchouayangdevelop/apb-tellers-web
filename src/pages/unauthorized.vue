<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-icon
          size="120"
          color="error"
          class="mb-4"
        >
          mdi-shield-alert
        </v-icon>

        <h1 class="text-h3 font-weight-bold mb-4">
          Access Denied
        </h1>

        <p class="text-h6 text-grey-darken-1 mb-6">
          You don't have permission to access this page.
        </p>

        <div class="mb-6">
          <v-chip
            color="error"
            variant="outlined"
            class="ma-1"
          >
            Current Role: {{ authStore.userRole || 'None' }}
          </v-chip>
        </div>

        <v-btn
          color="primary"
          size="large"
          @click="goBack"
          class="me-4"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Go Back
        </v-btn>

        <v-btn
          color="primary"
          variant="outlined"
          size="large"
          @click="goHome"
        >
          <v-icon left>mdi-home</v-icon>
          Go Home
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

// Route meta will be defined in router configuration

const authStore = useAuthStore()
const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>
