/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {createRouter, createWebHistory} from 'vue-router/auto'
import {setupLayouts} from 'virtual:generated-layouts'
import {routes} from 'vue-router/auto-routes'
import {authGuard, guestGuard, debugGuard} from "@/router/guards.ts";
import {checkRouteAccess, getAccessMessage,} from './utils.ts';
import {initializeRoutePatterns} from './intializeRoutePattern.ts';
import {routePatternMatcher} from './routePattenMatcher.ts';
import {createGuardWithLogging, guardPerformanceMonitor, routeAccessLogger} from './routeAccessLogger.ts';
import {useAuthStore} from "@/stores/authStore.ts";
import type {RouteLocationNormalized} from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

initializeRoutePatterns();

const enhancedAuthGuard = createGuardWithLogging('authGuard', authGuard);
const enhancedGuestGuard = createGuardWithLogging('guestGuard', guestGuard);

// const routePermissions: Record<string, {
//   requiresAuth?: boolean;
//   guestOnly?: boolean;
//   roles?: string[];
//   permissions?: string[];
// }> = {
//   '/login': {
//     requiresAuth: false,
//     guestOnly: true
//   },
//   '/register': {
//     requiresAuth: false,
//     guestOnly: true
//   },
//   'forgot-password': {
//     requiresAuth: false,
//     guestOnly: true
//   },
//   '/': {
//     requiresAuth: true,
//     roles: ['user', 'admin', 'editor'],
//   },
//   'dashboard': {
//     requiresAuth: true,
//     roles: ['user', 'admin', 'editor'],
//   },
//   'users': {
//     requiresAuth: true,
//     roles: ['admin'],
//     permissions: ['users.read']
//   },
//   'analytics': {
//     requiresAuth: true,
//     roles: ['admin', 'editor'],
//     permissions: ['analytics.read']
//   },
//   'reports': {
//     requiresAuth: true,
//     roles: ['admin', 'editor'],
//     permissions: ['reports.read']
//   },
//   'settings': {
//     requiresAuth: true,
//     roles: ['admin'],
//     permissions: ['settings.write']
//   },
//   'profile': {
//     requiresAuth: true,
//     roles: ['user', 'admin', 'editor'],
//   },
//   'unauthorized': {
//     requiresAuth: false,
//     // guestOnly: true
//   },
//   '404': {
//     requiresAuth: false,
//     // guestOnly: true
//   }
// }

router.beforeEach(async (to, from, next) => {
  const startTime = performance.now();
  const authStore = useAuthStore();

  if (import.meta.env.DEV) {
    debugGuard(to, from, next);
  }

  try {
    // Get route configuration using pattern matcher
    const routeConfig = routePatternMatcher.match(to.path);

    // Default configuration if no pattern matches
    const defaultPermissions = {
      requiresAuth: true,
      guestOnly: false,
      roles: undefined,
      permissions: undefined
    };

    // const routeConfig = {...defaultPermissions, ...permissions};
    const finalConfig = {...defaultPermissions, ...routeConfig};

    // Add permissions to route meta for component access
    to.meta = {
      ...to.meta,
      requiresAuth: finalConfig.requiresAuth,
      guestOnly: finalConfig.guestOnly,
      roles: finalConfig.roles,
      permissions: {
        roles: finalConfig.roles,
        permissions: finalConfig.permissions
      }
    }

    // Check route access
    const accessResult = checkRouteAccess(to, finalConfig);

    // Log the access attempt
    routeAccessLogger.log(
      to.path,
      accessResult,
      authStore.user?.name || 'anonymous',
      navigator.userAgent
    );

    // Handle access result
    if (!accessResult.allowed) {
      if (accessResult.redirectTo) {
        const redirectOptions: any = {path: accessResult.redirectTo};
        if (accessResult.redirectQuery) {
          redirectOptions.query = accessResult.redirectQuery;
        }
        return next(redirectOptions);
      } else {
        next({path: '/unauthorized'});
      }
      return;
    }
    next();
  } catch (error) {
    console.error('🚨 Navigation guard error:', error)

    // Log the error
    routeAccessLogger.log(
      to.path,
      {allowed: false, reason: `Navigation error: ${error}`},
      authStore.user?.name || 'anonymous'
    )

    // Redirect to error page
    next('/500')
  } finally {
    // Record performance metrics
    const duration = performance.now() - startTime
    guardPerformanceMonitor.record('mainGuard', duration)
  }

  //
  // const permissions = routePermissions[to.path] || routePermissions[to.name as string];
  //

  //
  // if (routeConfig.guestOnly) return guestGuard(to, from, next);
  //
  // if (routeConfig.requiresAuth) return authGuard(to, from, next);


  // if (to.path === '/login' || to.path === '/register') {
  //   return guestGuard(to, from, next);
  // }

  // next();
})


// After navigation guard with performance logging
router.afterEach((to, from, failure) => {
  if (failure) {
    console.error('🚨 Navigation failed:', failure)
    return
  }

  if (import.meta.env.DEV) {
    console.log(`✅ Successfully navigated to ${to.path}`)
  }

  // Update page title based on route
  if (to.meta.title) {
    document.title = `${to.meta.title} - Admin Dashboard`
  } else {
    document.title = 'Admin Dashboard'
  }

  // Track page views (you can integrate with analytics here)
  // if (typeof gtag !== 'undefined') {
  //   gtag('config', 'GA_MEASUREMENT_ID', {
  //     page_path: to.path,
  //   })
  // }
})


router.onError(async (error, to) => {
  console.error('🚨 Router error:', error)
  // Handle different types of errors
  if (error?.message?.includes?.('Failed to fetch dynamically imported module')) {
    await handleDynamicImportError(to)
  } else if (error?.message?.includes?.('ChunkLoadError')) {
    handleChunkLoadError(to)
  } else if (error?.name === 'NavigationAborted') {
    console.warn('⚠️ Navigation was aborted')
  } else if (error?.name === 'NavigationCancelled') {
    console.warn('⚠️ Navigation was cancelled')
  } else {
    // Unknown error
    console.error('❌ Unknown navigation error:', error)

    // Log to external service if available
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.captureException(error)
    // }
  }
})

// Handle dynamic import errors
async function handleDynamicImportError(to: RouteLocationNormalized) {
  const reloadKey = 'vuetify:dynamic-reload'

  if (localStorage.getItem(reloadKey)) {
    console.error('🚨 Dynamic import error persisted after reload')
    localStorage.removeItem(reloadKey)

    // Redirect to error page instead of infinite reload
    await router.push('/500')
  } else {
    console.log('🔄 Reloading page to fix dynamic import error')
    localStorage.setItem(reloadKey, 'true')
    location.assign(to?.fullPath || '/')
  }
}

// Handle chunk load errors
const handleChunkLoadError = (to: any) => {
  console.log('🔄 Chunk load error, attempting to reload')
  setTimeout(() => {
    location.reload()
  }, 1000)
}


// router.isReady().then(() => {
//   localStorage.removeItem('vuetify:dynamic-reload');
// })
// Initialize router when ready
router.isReady().then(async () => {
  localStorage.removeItem('vuetify:dynamic-reload')

  console.log('🚀 Router is ready')

  // Initialize auth store
  const authStore = useAuthStore()
  if (authStore.accessToken && !authStore.isAuthenticated) {
    try {
      await authStore.initializeAuth()
      console.log('🔐 Auth initialized successfully')
    } catch (error) {
      console.error('🚨 Auth initialization failed:', error)
      authStore.clearAuth()
    }
  }

  // Log performance summary in development
  if (import.meta.env.DEV) {
    setTimeout(() => {
      console.log('📊 Guard Performance Summary:')
      console.log(guardPerformanceMonitor.getSummary())
    }, 5000)
  }
})

// Development helpers
if (import.meta.env.DEV) {
  // Add router debugging to window for development
  ;(window as any).router = router
  ;(window as any).routePatternMatcher = routePatternMatcher
  ;(window as any).routeAccessLogger = routeAccessLogger
  ;(window as any).guardPerformanceMonitor = guardPerformanceMonitor

  // Add helper functions
  ;(window as any).debugRouter = {
    getAccessLogs: () => routeAccessLogger.getLogs(),
    getFailedAttempts: () => routeAccessLogger.getFailedAttempts(),
    getPerformanceMetrics: () => guardPerformanceMonitor.getMetrics(),
    exportAccessLogs: () => routeAccessLogger.exportAsCSV(),
    clearLogs: () => routeAccessLogger.clearLogs(),
    resetMetrics: () => guardPerformanceMonitor.reset()
  }

  console.log('🛠️ Router debugging tools available on window.debugRouter')
}

export default router

// Type declarations
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    title?: string
    permissions?: {
      roles?: string[]
      permissions?: string[]
    }
  }
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    Sentry?: {
      captureException: (error: Error) => void
    }
  }
}
