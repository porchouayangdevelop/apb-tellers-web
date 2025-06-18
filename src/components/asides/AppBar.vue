<script setup lang="ts">
import {storeToRefs} from "pinia";
import {appStore} from "@/stores/appStore.ts";

const {drawer, isRails,currentView} = storeToRefs(appStore()); //state
const {} = appStore(); //actions
</script>

<template>
  <v-app-bar app elevation="1" density="compact">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title>Admin Dashboard</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn icon="mdi-bell-outline" variant="text"></v-btn>
<!--    <v-btn icon="mdi-cog-outline" variant="text"></v-btn>-->
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
        >
          <v-badge color="red" stacked content="3">
            <v-icon>mdi-email-outline</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-list nav density="compact">
        <v-list-item title="New message from John" prepend-icon="mdi-email"></v-list-item>
        <v-list-item title="Meeting reminder" prepend-icon="mdi-calendar"></v-list-item>
        <v-list-item title="System alert" prepend-icon="mdi-alert"></v-list-item>
      </v-list>
    </v-menu>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
        >
          <v-avatar size="32">
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-list nav density="compact">
        <v-list-item title="Profile" prepend-icon="mdi-account"></v-list-item>
        <v-list-item title="Settings" prepend-icon="mdi-cog"></v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-logout">
          <v-btn
            variant="text"
            color="error"
            class="text-caption"
            @click="() => { /* handle logout */ }"
          >
            Logout
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style scoped>

</style>
