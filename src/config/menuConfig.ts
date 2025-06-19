import type { MenuPermission } from '@/types/auths'

export const menuItems: MenuPermission[] = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    value: 'dashboard',
    requireAuth: true,
    roles: ['admin', 'user', 'editor']
  },
  {
    title: 'Users',
    icon: 'mdi-account-group',
    value: 'users',
    requireAuth: true,
    roles: ['admin'],
    permissions: ['users.read']
  },
  {
    title: 'Analytics',
    icon: 'mdi-chart-line',
    value: 'analytics',
    requireAuth: true,
    roles: ['admin', 'editor'],
    permissions: ['analytics.read']
  },
  {
    title: 'Reports',
    icon: 'mdi-file-chart',
    value: 'reports',
    requireAuth: true,
    roles: ['admin', 'editor'],
    permissions: ['reports.read']
  },
  {
    title: 'Settings',
    icon: 'mdi-cog',
    value: 'settings',
    requireAuth: true,
    roles: ['admin'],
    permissions: ['settings.write']
  }
]

// Role-based menu configuration
export const roleMenus = {
  admin: ['dashboard', 'users', 'analytics', 'reports', 'settings'],
  editor: ['dashboard', 'analytics', 'reports'],
  user: ['dashboard']
}

export const getFilteredMenuItems = (userRoles: string[], userPermissions: string[]): MenuPermission[] => {
  return menuItems.filter(item => {
    // Check if authentication is required
    if (item.requireAuth && (!userRoles || userRoles.length === 0)) {
      return false
    }

    // Check role requirements
    if (item.roles && item.roles.length > 0) {
      const hasRequiredRole = item.roles.some(role => userRoles.includes(role))
      if (!hasRequiredRole) return false
    }

    // Check permission requirements
    if (item.permissions && item.permissions.length > 0) {
      const hasRequiredPermission = item.permissions.some(permission =>
        userPermissions.includes(permission)
      )
      if (!hasRequiredPermission) return false
    }

    return true
  })
}
