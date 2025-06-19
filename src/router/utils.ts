import type {RouteLocationNormalized} from 'vue-router';
import {useAuthStore} from "@/stores/authStore.ts";

export interface RoutePermissionConfig {
  requireAuth?: boolean;
  guestOnly?: boolean;
  roles?: string[];
  permissions?: string[];
  redirectTo?: string;
  customCheck?: (route: RouteLocationNormalized) => boolean;
}

export interface RouteAccessResult {
  allowed: boolean;
  reason?: string;
  redirectTo?: string;
  redirectQuery?: Record<string, any>;
}

export const checkRouteAccess = (route: RouteLocationNormalized, config: RoutePermissionConfig): RouteAccessResult => {
  const authStore = useAuthStore();

  // Custom check
  if (config.customCheck && !config.customCheck(route)) {
    return {
      allowed: false,
      reason: 'Custom check failed',
      redirectTo: config.redirectTo || '/unauthorized'
    }
  }

  // Guest access check
  if (config.guestOnly && authStore.isLoggedIn) {
    return {
      allowed: false,
      reason: 'Guest access only',
      redirectTo: config.redirectTo || '/'
    }
  }

  // Authentication check
  if (config.requireAuth !== false && !authStore.isLoggedIn) {
    return {
      allowed: false,
      reason: 'Authentication required',
      redirectTo: config.redirectTo || '/login',
      redirectQuery: {redirect: route.fullPath}
    }
  }

  // Role check
  if (config.roles && config.roles.length > 0) {
    const hasRole = config.roles.some(role => authStore.hasRole(role));
    if (!hasRole) {
      return {
        allowed: false,
        reason: `User role "${authStore.userRole}" not in required roles: [${config.roles.join(', ')}]`,
        redirectTo: config.redirectTo || '/unauthorized'
      }
    }
  }

  // Permission check
  if (config.permissions && config.permissions.length > 0) {
    const hasPermission = config.permissions.some(permission => authStore.hasPermission(permission));
    if (!hasPermission) {
      return {
        allowed: false,
        reason: `User permissions do not include required permissions: [${config.permissions.join(', ')}]`,
        redirectTo: config.redirectTo || '/unauthorized'
      }
    }
  }
  return {allowed: true};
}

/**
 * Get user-friendly route access message
 */
export const getAccessMessage = (result: RouteAccessResult, route: RouteLocationNormalized): string => {
  if (result.allowed) return `✅ Access granted to ${route.name}`;

  const message: Record<string, string> = {
    'Authentication required': `🔐 Please sign in to access ${route.path}`,
    'Route is guest-only but user is authenticated': `🏠 You're already signed in, redirecting to dashboard`,
    'Custom access check failed': `🚫 Access denied to ${route.path}`,
  }

  // Handle role/permission specific messages
  if (result.reason?.includes('User role')) {
    return `🚫 Insufficient privileges to access ${route.path}`
  }

  if (result.reason?.includes('User missing')) {
    return `🚫 Missing required permissions for ${route.path}`
  }

  return message[result.reason || ''] || `🚫 Access denied to ${route.path}`
}

export const routeConfigs = {
  public: (): RoutePermissionConfig => ({requireAuth: false}),
  guestOnly: (): RoutePermissionConfig => ({requireAuth: false, guestOnly: true}),
  authenticated: (): RoutePermissionConfig => ({requireAuth: true}),
  adminOnly: (): RoutePermissionConfig => ({requireAuth: true, roles: ['admin']}),
  editorOnly: (): RoutePermissionConfig => ({requireAuth: true, roles: ['admin', 'editor']}),
  allUser: (): RoutePermissionConfig => ({requireAuth: true, roles: ['admin', 'editor', 'user']}),
  userOnly: (): RoutePermissionConfig => ({requireAuth: true, roles: ['user']}),
  userOrEditor: (): RoutePermissionConfig => ({requireAuth: true, roles: ['user', 'editor']}),
  userOrAdmin: (): RoutePermissionConfig => ({requireAuth: true, roles: ['user', 'admin']}),
  userOrAdminOrEditor: (): RoutePermissionConfig => ({requireAuth: true, roles: ['user', 'admin', 'editor']}),
  withRole: (roles: string[]): RoutePermissionConfig => ({requireAuth: true, roles}),
  withPermission: (permissions: string[]): RoutePermissionConfig => ({requireAuth: true, permissions}),
  withRoleAndPermission: (roles: string[], permissions: string[]): RoutePermissionConfig => ({
    requireAuth: true,
    roles,
    permissions
  }),
}

