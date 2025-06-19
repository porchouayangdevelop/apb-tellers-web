import type {NavigationGuardNext, RouteLocationNormalized} from 'vue-router';
import {useAuthStore} from "@/stores/authStore.ts";
import type {RoutePermission} from "@/types/auths.ts";

const {hasPermission} = storeToRefs(useAuthStore());
const {initializeAuth, clearAuth, isLoggedIn} = useAuthStore();
export const authGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated && authStore.accessToken) {
    try {
      await initializeAuth();
    } catch (error) {
      console.error("Error during authentication guard:", error);
      clearAuth();
    }
  }

  const routePermissions = to.meta.permissions as RoutePermission;
  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && !isLoggedIn) {
    next({
      path: '/login',
      query: {redirect: to.fullPath}
    })
    return;
  }

  if (routePermissions?.roles?.length) {
    const hasRequiredRole = routePermissions.roles.some(role => authStore.hasRole(role));
    if (!hasRequiredRole) {
      next({
        path: '/unauthorized',
      })
      return;
    }

  }

  if (routePermissions?.permissions?.length) {
    const hasRequiredPermission = routePermissions.permissions.some(permission => authStore.hasPermission(permission));
    if (!hasRequiredPermission) {
      next({path: '/unauthorized'});
      return;
    }
  }
  next();
}

export const guestGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore();
  if (authStore.isLoggedIn) {
    return next({path: '/dashboard'});
  }
  next();
};
export const roleGuard = (requiredRoles: string[]) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();
    if (!isLoggedIn) {
      return next({path: '/login'});
    }

    const hasRequiredRole = requiredRoles.some(role => authStore.hasRole(role));
    if (!hasRequiredRole) {
      return next({path: '/unauthorized'});
    }
    next();
  }
};
export const permissionGuard = (requiredPermissions: string[]) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();
    if (!isLoggedIn) {
      return next({path: '/login'});
    }

    const hasRequiredPermission = requiredPermissions.some(permission => authStore.hasPermission(permission));
    if (!hasRequiredPermission) {
      return next({path: '/unauthorized'});
    }
    next();
  };
};

export const adminGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  return roleGuard(['admin'])(to, from, next);
}

export const composedGuard = (...guards: any[]) => {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  )=>{
    for (const guard of guards){
      const result = await new Promise<boolean>((resolve)=>{
        guard(to, from, (result?:any)=>{
          if(result === undefined || result === true){
            resolve(true);
          }else {
            next(result);
            resolve(false);
          }
        })
      })

      if(result) return;
    }
    next();
  }
}

export const debugGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  console.log('Debug Guard:', {
    to: to.fullPath,
    from: from.fullPath,
    meta: to.meta,
    authStore: useAuthStore()
  });
  console.log(`🔄 Navigating from ${from.path} to ${to.path}`)
  console.log(`📋 Route meta:`, to.meta)
  next();
}
