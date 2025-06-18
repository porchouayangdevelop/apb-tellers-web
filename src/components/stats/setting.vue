<script setup lang="ts">
import type {Settings} from "@/types";
import {storeToRefs} from "pinia";
import {appStore} from "@/stores/appStore.ts";

const {drawer, isRails,currentView} = storeToRefs(appStore()); //state
const {} = appStore(); //actions


const settings: Settings = reactive({
  siteName: 'My Admin Site',
  adminEmail: 'admin@example.com',
  enableNotifications: true,
  maintenanceMode: false,
  twoFactorAuth: true,
  loginNotifications: false,
  sessionTimeout: '30 minutes'
})
</script>

<template>
  <!-- Settings View -->
  <div v-if="currentView === 'settings'">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Settings</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>General Settings</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Site Name"
                v-model="settings.siteName"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                label="Admin Email"
                v-model="settings.adminEmail"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-switch
                v-model="settings.enableNotifications"
                label="Enable Notifications"
                color="primary"
                class="mb-4"
              ></v-switch>
              <v-switch
                v-model="settings.maintenanceMode"
                label="Maintenance Mode"
                color="warning"
                class="mb-4"
              ></v-switch>
              <v-btn color="primary">Save Settings</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Security Settings</v-card-title>
          <v-card-text>
            <v-form>
              <v-switch
                v-model="settings.twoFactorAuth"
                label="Two-Factor Authentication"
                color="success"
                class="mb-4"
              ></v-switch>
              <v-switch
                v-model="settings.loginNotifications"
                label="Login Notifications"
                color="info"
                class="mb-4"
              ></v-switch>
              <v-select
                v-model="settings.sessionTimeout"
                :items="['15 minutes', '30 minutes', '1 hour', '2 hours']"
                label="Session Timeout"
                variant="outlined"
                class="mb-4"
              ></v-select>
              <v-btn color="success">Update Security</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>

</style>
