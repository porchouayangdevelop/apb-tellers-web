<script setup lang="ts">
import type {Activity} from "@/types";

const recentActivity: Activity[] = [
  {
    id: 1,
    title: 'New user registered',
    description: 'John Smith created an account',
    time: '2 minutes ago',
    color: 'success'
  },
  {
    id: 2,
    title: 'Order completed',
    description: 'Order #1234 has been processed',
    time: '15 minutes ago',
    color: 'info'
  },
  {
    id: 3,
    title: 'Server maintenance',
    description: 'Scheduled maintenance completed',
    time: '1 hour ago',
    color: 'warning'
  },
  {
    id: 4,
    title: 'New feature released',
    description: 'Dashboard v2.0 is now live',
    time: '2 hours ago',
    color: 'primary'
  }
]
</script>

<template>
    <!-- Recent Activity -->
    <v-row class="my-3" no-gutters>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>Recent Activity</v-card-title>
          <v-card-text>
            <v-timeline density="compact" class="pa-0">
              <v-timeline-item
                v-for="activity in recentActivity"
                :key="activity.id"
                :dot-color="activity.color"
                size="small"
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-body-2">{{ activity.title }}</div>
                    <div class="text-caption text-grey-darken-1">
                      {{ activity.description }}
                    </div>
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ activity.time }}
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
</template>

<style scoped>

</style>
