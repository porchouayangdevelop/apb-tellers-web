<script setup lang="ts">
import type {MenuItem} from "@/types";
import {storeToRefs} from "pinia";
import {appStore} from "@/stores/appStore.ts";

const {drawer, isRails,currentView} = storeToRefs(appStore()); //state
const {} = appStore(); //actions


const items: MenuItem[] = [
  {title: 'Dashboard', icon: 'mdi-view-dashboard', value: 'dashboard'},
  {title: 'Users', icon: 'mdi-account-group', value: 'users'},
  {title: 'Analytics', icon: 'mdi-chart-line', value: 'analytics'},
  {title: 'Reports', icon: 'mdi-file-chart', value: 'reports'},
  {title: 'Settings', icon: 'mdi-cog', value: 'settings'},
];

</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    :rail="isRails"
    permanent
    @click="isRails = false"
    close-delay="500"
    mobile-breakpoint="xs"
  >
    <v-list-item
      prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
      :title="isRails ? '' : 'John Doe'"
      :subtitle="isRails ? '' : 'Administrator'"
      nav
    >
      <template v-slot:append>
        <v-btn
          variant="text"
          icon="mdi-chevron-left"
          @click.stop="isRails = !isRails"
        ></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :value="item.value"
        @click="currentView = item.value"
        :active="currentView === item.value"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>
