import {useAuth} from "@/composables/useAuth.ts";
import {useRouter} from "vue-router";

interface RouteGuardOptions {
  requiresAuth?: boolean;
  roles?: string[];
  permissions?: string[];
  redirectTo?: string;
}

export const useRouteGuard = (options: RouteGuardOptions = {}) => {
  const {isAuthenticated, hasRole, hasPermission} = useAuth();
  const router = useRouter();

  const checkAccess = async () => {
    if (options.requiresAuth !== false && !isAuthenticated.value) {
      await router.push({
        path: options.redirectTo || '/login',
        query: {redirect: router.currentRoute.value.fullPath}
      });
      return false;
    }

    if (options.roles && options.roles.length > 0) {
      const hasRequiredRole = options.roles.some(role => hasRole(role));
      if (!hasRequiredRole) {
        await router.push(options.redirectTo || '/unauthorized');
      }
      return false;
    }

    if (options.permissions && options.permissions.length > 0) {
      const hasRequiredPermission = options.permissions.some(permission => hasPermission(permission));
      if (!hasRequiredPermission) {
        await router.push(options.redirectTo || '/unauthorized');
      }
      return false;
    }
    return true;
  }

  onMounted(async () => {
    await checkAccess();
  })

  return {
    checkAccess
  }
}


// Usage examples:
/*
// In a component that requires admin role:
export default {
  setup() {
    useRouteGuard({
      requiresAuth: true,
      roles: ['admin']
    })

    return {}
  }
}

// In a component that requires specific permissions:
export default {
  setup() {
    useRouteGuard({
      requiresAuth: true,
      permissions: ['users.read', 'analytics.view']
    })

    return {}
  }
}

// In a guest-only component (like login):
export default {
  setup() {
    useRouteGuard({
      requiresAuth: false
    })

    return {}
  }
}

// In a component that redirects to a specific page if access is denied:
 */
