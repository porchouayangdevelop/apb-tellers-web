<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card class="elevation-12 mx-auto" max-width="400">
          <v-card-title class="text-center pa-6">
            <div class="text-h4 font-weight-bold">Login</div>
            <div class="text-body-2 text-grey-darken-1 mt-2">
              Sign in to your account
            </div>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form ref="formRef" v-model="valid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="credentials.email"
                :rules="emailRules"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                class="mb-4"
                :error-messages="emailError"
              />

              <v-text-field
                v-model="credentials.password"
                :rules="passwordRules"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                class="mb-4"
                :error-messages="passwordError"
              />

              <v-checkbox
                v-model="credentials.remember"
                label="Remember me"
                class="mb-4"
              />

              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ errorMessage }}
              </v-alert>

              <v-btn
                type="submit"
                :loading="authStore.loading"
                :disabled="!valid"
                block
                color="primary"
                size="large"
                class="mb-4"
              >
                Sign In
              </v-btn>

              <div class="text-center">
                <v-btn
                  variant="text"
                  size="small"
                  @click="showForgotPassword = true"
                >
                  Forgot Password?
                </v-btn>
              </div>
            </v-form>
          </v-card-text>

          <!-- Demo Credentials -->
          <v-card-text class="pa-6 pt-0">
            <v-divider class="mb-4" />
            <div class="text-caption text-grey-darken-1 mb-2">Demo Credentials:</div>
            <v-chip
              v-for="user in demoUsers"
              :key="user.email"
              size="small"
              class="ma-1"
              @click="setCredentials(user.email, user.password)"
            >
              {{ user.label }}
            </v-chip>
          </v-card-text>
        </v-card>

        <!-- Forgot Password Dialog -->
        <v-dialog v-model="showForgotPassword" max-width="400">
          <v-card>
            <v-card-title>Reset Password</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="forgotEmail"
                label="Email Address"
                type="email"
                variant="outlined"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                @click="showForgotPassword = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                @click="handleForgotPassword"
              >
                Send Reset Link
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { LoginCredentials } from '@/types/auths.ts'

// Define route meta for guest guard
// definePageMeta({
//   layout: 'auth',
//   permissions: {
//     requireAuth: false
//   }
// })

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// Form state
const formRef = ref()
const valid = ref(false)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const forgotEmail = ref('')
const errorMessage = ref('')
const emailError = ref('')
const passwordError = ref('')

// Credentials
const credentials = reactive<LoginCredentials>({
  email: '',
  password: '',
  remember: false
})

// Demo users for testing
const demoUsers = [
  { label: 'Admin', email: 'admin@example.com', password: 'password' },
  { label: 'User', email: 'user@example.com', password: 'password' },
  { label: 'Editor', email: 'editor@example.com', password: 'password' }
]

// Validation rules
const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters'
]

// Set demo credentials
const setCredentials = (email: string, password: string) => {
  credentials.email = email
  credentials.password = password
}

// Handle login
const handleLogin = async () => {
  if (!valid.value) return

  try {
    errorMessage.value = ''
    emailError.value = ''
    passwordError.value = ''

    // Use mock login for demo
    // await authStore.mockLogin(credentials)

    // Redirect to intended page or dashboard
    const redirectPath = route.query.redirect as string || '/'
    await router.push(redirectPath)

  } catch (error: any) {
    console.error('Login error:', error)

    if (error.message?.includes('Invalid credentials')) {
      errorMessage.value = 'Invalid email or password'
    } else if (error.response?.status === 422) {
      // Handle validation errors
      const errors = error.response.data.errors
      if (errors.email) emailError.value = errors.email[0]
      if (errors.password) passwordError.value = errors.password[0]
    } else {
      errorMessage.value = 'Login failed. Please try again.'
    }
  }
}

// Handle forgot password
const handleForgotPassword = async () => {
  try {
    // await authStore.forgotPassword(forgotEmail.value)
    showForgotPassword.value = false
    forgotEmail.value = ''
    // Show success message
    console.log('Password reset link sent!')
  } catch (error) {
    console.error('Forgot password error:', error)
  }
}

// Clear errors when user types
watch(() => credentials.email, () => {
  emailError.value = ''
  errorMessage.value = ''
})

watch(() => credentials.password, () => {
  passwordError.value = ''
  errorMessage.value = ''
})
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
