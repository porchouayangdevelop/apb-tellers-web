<script setup lang="ts">
import {storeToRefs} from "pinia";
import {appStore} from "@/stores/appStore.ts";

const {drawer, isRails,currentView} = storeToRefs(appStore()); //state
const {} = appStore(); //actions

</script>

<template>
<v-container fluid>
  <div v-if="currentView === 'dashboard'">
    <stats/>
    <RecentActivity/>
    <User/>
    <Analysis/>
    <Setting/>
  </div>
</v-container>
</template>

<style scoped>

</style>
