<script setup lang="ts">
import type {User} from "@/types";
import {storeToRefs} from "pinia";
import {appStore} from "@/stores/appStore.ts";

const {drawer, isRails, currentView} = storeToRefs(appStore()); //state
const {} = appStore(); //actions

const userHeaders = [
  {title: 'Avatar', key: 'avatar', sortable: false},
  {title: 'Name', key: 'name'},
  {title: 'Email', key: 'email'},
  {title: 'Role', key: 'role'},
  {title: 'Status', key: 'status'},
  {title: 'Last Login', key: 'lastLogin'},
  {title: 'Actions', key: 'actions', sortable: false}
]


const user: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastLogin: '2024-01-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Active',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    lastLogin: '2024-01-14'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Editor',
    status: 'Inactive',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    lastLogin: '2024-01-10'
  }
]
</script>

<template>
  <!-- Users View -->
  <div v-if="currentView === 'users'">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            Users Management
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus">
              Add User
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="userHeaders"
              :items="users"
              :items-per-page="10"
              class="elevation-1"
            >
              <template v-slot:item.avatar="{ item }">
                <v-avatar size="32" class="ma-2">
                  <v-img :src="item.avatar"></v-img>
                </v-avatar>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status === 'Active' ? 'success' : 'error'"
                  text-color="white"
                  small
                >
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
                <v-btn icon="mdi-delete" variant="text" size="small" color="error"></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>

</style>
