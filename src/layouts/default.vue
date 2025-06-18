<script lang="ts" setup>
//
import AppBar from "@/components/asides/AppBar.vue";
</script>

<template>
  <v-app class="fill-height">
    <!--navigation sidebar -->
    <Drawer/>

    <!--app bar    -->
    <AppBar/>

    <!--main -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

