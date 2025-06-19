import {routePatternMatcher} from "@/router/routePattenMatcher.ts";
import {routeConfigs} from "@/router/utils.ts";

export const initializeRoutePatterns = () => {
  routePatternMatcher.addMany({
    // Auth routes
    '/login': routeConfigs.guestOnly(),
    '/register': routeConfigs.guestOnly(),
    '/forgot-password': routeConfigs.guestOnly(),
    '/reset-password': routeConfigs.guestOnly(),

    // Public routes
    '/about': routeConfigs.public(),
    '/contact': routeConfigs.public(),
    '/help': routeConfigs.public(),
    '/docs': routeConfigs.public(),
    '/404': routeConfigs.public(),
    '/500': routeConfigs.public(),

    // Admin routes
    '/admin/*': routeConfigs.adminOnly(),
    '/users': routeConfigs.withRoleAndPermission(['admin'], ['users.read']),
    '/settings': routeConfigs.withRoleAndPermission(['admin'], ['settings.write']),

    // Editor routes
    '/analytics': routeConfigs.withRoleAndPermission(['admin', 'editor'], ['analytics.read']),
    '/reports': routeConfigs.withRoleAndPermission(['admin', 'editor'], ['reports.read']),
    '/reports/sales': routeConfigs.withRoleAndPermission(['admin'], ['reports.sales']),
    '/content/*': routeConfigs.editorOnly(),

    // User routes
    '/profile': routeConfigs.allUser(),
    '/profile/*': routeConfigs.allUser(),
    '/account': routeConfigs.allUser(),
    '/dashboard': routeConfigs.allUser(),
    '/': routeConfigs.allUser(),

    // Error pages
    '/unauthorized': routeConfigs.authenticated(),
    '/403': routeConfigs.authenticated()
  })
}
