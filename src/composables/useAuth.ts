import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue'

export const useAuth = () => {
  const authStore = useAuthStore()

  // Computed properties
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const userRole = computed(() => authStore.userRole)
  const isLoading = computed(() => authStore.loading)

  // Helper functions
  const hasRole = (role: string): boolean => {
    return authStore.hasRole(role)
  }

  const hasPermission = (permission: string): boolean => {
    return authStore.hasPermission(permission)
  }

  const canAccess = (roles: string[] = [], permissions: string[] = []): boolean => {
    return authStore.canAccess(roles, permissions)
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => authStore.hasRole(role))
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => authStore.hasPermission(permission))
  }

  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every(role => authStore.hasRole(role))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => authStore.hasPermission(permission))
  }

  // Authentication actions
  const login = authStore.login
  const logout = authStore.logout
  const refreshToken = authStore.refreshAccessToken

  return {
    // State
    isAuthenticated,
    user,
    userRole,
    isLoading,

    // Actions
    login,
    logout,
    refreshToken,

    // Helper functions
    hasRole,
    hasPermission,
    canAccess,
    hasAnyRole,
    hasAnyPermission,
    hasAllRoles,
    hasAllPermissions
  }
}
