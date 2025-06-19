<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-account-group</v-icon>
            Users Management
            <v-spacer />
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="showAddDialog = true"
            >
              Add User
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="userHeaders"
              :items="users"
              :items-per-page="10"
              class="elevation-1"
              :loading="loading"
            >
              <template v-slot:item.avatar="{ item }">
                <v-avatar size="32" class="ma-2">
                  <v-img :src="item.avatar" />
                </v-avatar>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status === 'Active' ? 'success' : 'error'"
                  size="small"
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.role="{ item }">
                <v-chip
                  :color="getRoleColor(item.role)"
                  size="small"
                  variant="outlined"
                >
                  {{ item.role }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-tooltip text="Edit User">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-pencil"
                      variant="text"
                      size="small"
                      @click="editUser(item)"
                    />
                  </template>
                </v-tooltip>

                <v-tooltip text="Delete User">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-delete"
                      variant="text"
                      size="small"
                      color="error"
                      @click="deleteUser(item)"
                    />
                  </template>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add User Dialog -->
    <v-dialog v-model="showAddDialog" max-width="500">
      <v-card>
        <v-card-title>Add New User</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="valid">
            <v-text-field
              v-model="newUser.name"
              label="Full Name"
              :rules="[v => !!v || 'Name is required']"
              variant="outlined"
              class="mb-4"
            />
            <v-text-field
              v-model="newUser.email"
              label="Email"
              type="email"
              :rules="emailRules"
              variant="outlined"
              class="mb-4"
            />
            <v-select
              v-model="newUser.role"
              :items="roleOptions"
              label="Role"
              variant="outlined"
              class="mb-4"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showAddDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            @click="addUser"
          >
            Add User
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { useAdminProtection } from '@/composables/usePageProtection'
import type { User } from '@/types'

// Protect this page - admin only
useAdminProtection()

// Page state
const loading = ref(false)
const showAddDialog = ref(false)
const valid = ref(false)
const formRef = ref()

// Table headers
const userHeaders = [
  { title: 'Avatar', key: 'avatar', sortable: false },
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'status' },
  { title: 'Last Login', key: 'lastLogin' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Mock users data
const users = ref<User[]>([
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
])

// New user form
const newUser = ref({
  name: '',
  email: '',
  role: 'User'
})

const roleOptions = ['Admin', 'Editor', 'User']

// Validation rules
const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

// Helper functions
const getRoleColor = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'error'
    case 'editor':
      return 'warning'
    case 'user':
      return 'primary'
    default:
      return 'grey'
  }
}

const editUser = (user: User) => {
  console.log('Edit user:', user)
  // Implement edit functionality
}

const deleteUser = (user: User) => {
  console.log('Delete user:', user)
  // Implement delete functionality
}

const addUser = () => {
  if (!valid.value) return

  // Add user logic here
  const user: User = {
    id: users.value.length + 1,
    name: newUser.value.name,
    email: newUser.value.email,
    role: newUser.value.role,
    status: 'Active',
    avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
    lastLogin: new Date().toISOString().split('T')[0]
  }

  users.value.push(user)

  // Reset form
  newUser.value = { name: '', email: '', role: 'User' }
  showAddDialog.value = false
  formRef.value?.reset()
}
</script>

<style scoped>
.v-data-table {
  background: transparent;
}
</style>
