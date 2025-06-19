<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">
          <v-icon class="mr-2">mdi-account</v-icon>
          User Profile
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-text class="text-center">
            <v-avatar size="120" class="mb-4">
              <v-img :src="user?.avatar" :alt="user?.name"/>
            </v-avatar>

            <h2 class="text-h5 mb-2">{{ user?.name }}</h2>
            <v-chip
              :color="getRoleColor(user?.role)"
              variant="outlined"
              class="mb-4"
            >
              {{ user?.role }}
            </v-chip>

            <div class="text-body-2 text-grey-darken-1">
              Member since {{ formatDate(user?.createdAt) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title>Profile Information</v-card-title>
          <v-card-text>
            <v-form ref="formRef" v-model="valid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.name"
                    label="Full Name"
                    :rules="[v => !!v || 'Name is required']"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.email"
                    label="Email"
                    type="email"
                    :rules="emailRules"
                    variant="outlined"
                    disabled
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.phone"
                    label="Phone Number"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.department"
                    label="Department"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="profileForm.bio"
                    label="Bio"
                    variant="outlined"
                    rows="3"
                  />
                </v-col>
              </v-row>

              <v-btn
                color="primary"
                :disabled="!valid || !hasChanges"
                :loading="saving"
                @click="saveProfile"
              >
                Save Changes
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="mt-4">
          <v-card-title>Change Password</v-card-title>
          <v-card-text>
            <v-form ref="passwordFormRef" v-model="passwordValid">
              <v-text-field
                v-model="passwordForm.currentPassword"
                label="Current Password"
                type="password"
                :rules="[v => !!v || 'Current password is required']"
                variant="outlined"
                class="mb-4"
              />
              <v-text-field
                v-model="passwordForm.newPassword"
                label="New Password"
                type="password"
                :rules="passwordRules"
                variant="outlined"
                class="mb-4"
              />
              <v-text-field
                v-model="passwordForm.confirmPassword"
                label="Confirm New Password"
                type="password"
                :rules="[
                  v => !!v || 'Please confirm your password',
                  v => v === passwordForm.newPassword || 'Passwords do not match'
                ]"
                variant="outlined"
                class="mb-4"
              />

              <v-btn
                color="primary"
                :disabled="!passwordValid"
                :loading="changingPassword"
                @click="changePassword"
              >
                Change Password
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {useUserProtection} from '@/composables/usePageProtection'
import {useAuth} from '@/composables/useAuth'

// Protect this page - any authenticated user
useUserProtection()

const {user} = useAuth()

// Form state
const formRef = ref()
const passwordFormRef = ref()
const valid = ref(false)
const passwordValid = ref(false)
const saving = ref(false)
const changingPassword = ref(false)

// Profile form
const profileForm = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
  phone: '',
  department: '',
  bio: ''
})

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Validation rules
const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
  (v: string) => /(?=.*[a-z])/.test(v) || 'Password must contain lowercase letter',
  (v: string) => /(?=.*[A-Z])/.test(v) || 'Password must contain uppercase letter',
  (v: string) => /(?=.*\d)/.test(v) || 'Password must contain number'
]

// Computed
const hasChanges = computed(() => {
  return profileForm.name !== user.value?.name ||
    profileForm.phone !== '' ||
    profileForm.department !== '' ||
    profileForm.bio !== ''
})

// Methods
const getRoleColor = (role: string | undefined): string => {
  switch (role?.toLowerCase()) {
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

const formatDate = (date: string | undefined): string => {
  if (!date) return 'Unknown'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const saveProfile = async () => {
  if (!valid.value) return

  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update user profile logic here
    console.log('Profile saved:', profileForm)

    // Show success message
    // You can add a toast notification here

  } catch (error) {
    console.error('Failed to save profile:', error)
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (!passwordValid.value) return

  changingPassword.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Change password logic here
    console.log('Password changed')

    // Reset form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    passwordFormRef.value?.reset()

    // Show success message
    // You can add a toast notification here

  } catch (error) {
    console.error('Failed to change password:', error)
  } finally {
    changingPassword.value = false
  }
}

// Initialize form with user data
watch(user, (newUser) => {
  if (newUser) {
    profileForm.name = newUser.name
    profileForm.email = newUser.email
  }
}, {immediate: true})

</script>
