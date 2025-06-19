import {useAuth} from "@/composables/useAuth.ts";
import {useRouter, useRoute} from "vue-router";

interface PageProtectionOptions {
  requiresAuth?: boolean;
  roles?: string[];
  permissions?: string[];
  redirectTo?: string;
  onUnauthorized?: () => void;
}

export const usePageProtection = (options: PageProtectionOptions) => {
  const {isAuthenticated, hasRole, hasPermission, isLoading} = useAuth();
  const router = useRouter();
  const route = useRoute();

  const {
    requiresAuth = true,
    roles = [],
    permissions = [],
    redirectTo,
    onUnauthorized
  } = options;

  const checkAccess = async () => {
    if (isLoading.value) return true;

    if (requiresAuth && !isAuthenticated.value) {
      await router.push({
        path: '/login',
        query: {redirect: route.fullPath}
      });
      return false;
    }

    if (roles.length > 0) {
      const hasRequiredRole = roles.some(role => hasRole(role));
      if (!hasRequiredRole) {
        // if(onUnauthorized){
        //   onUnauthorized();
        // }
        // else {
        //   await router.push(redirectTo || '/unauthorized');
        // }
        onUnauthorized ? onUnauthorized() : await router.push(redirectTo || '/unauthorized');
        return false;
      }
    }

    if (permissions.length > 0) {
      const hasRequiredPermission = permissions.some(permission => hasPermission(permission));
      if (!hasRequiredPermission) {
        onUnauthorized ? onUnauthorized() : await router.push(redirectTo || '/unauthorized');
        return false;
      }
    }
    return true;
  }

  onMounted(async () => {
    await checkAccess();
  });

  watch([isAuthenticated, isLoading], async () => {
    if (!isLoading.value) {
      await checkAccess();
    }
  });

  return {
    checkAccess,
    canAccess: checkAccess()
  }
}

export const useAdminProtection = (redirectTo?: string) =>usePageProtection({
  requiresAuth: true as boolean,
  roles:['admin'],
  redirectTo,
});

export const useUserProtection = (redirectTo?: string) => usePageProtection({
  requiresAuth: true as boolean,
  roles:['editor', 'admin', 'user'],
  redirectTo,
});

export const useEditorProtection = (redirectTo?: string) => usePageProtection({
  requiresAuth: true as boolean,
  roles:['editor', 'admin'],
  redirectTo,
});

export const useGuestProtection = (redirectTo: string = '/') => usePageProtection({
  requiresAuth: false as boolean,
  redirectTo,
});

export const usePermissionProtection = (permissions: string[], redirectTo?: string, onUnauthorized?: () => void) => {
  return usePageProtection({
    requiresAuth: true as boolean,
    permissions,
    redirectTo,
    // onUnauthorized
  })
}
