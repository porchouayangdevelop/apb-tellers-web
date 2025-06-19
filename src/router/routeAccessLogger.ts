import type {RouteAccessResult} from "@/router/utils.ts";
import {useAuthStore} from "@/stores/authStore.ts";

export class RouteAccessLogger {
  private logs: Array<{
    timestamp: Date
    path: string
    user: string
    result: RouteAccessResult
    userAgent?: string
  }> = []

  /**
   * Log route access attempt
   */
  log(
    path: string,
    result: RouteAccessResult,
    user?: string,
    userAgent?: string
  ): void {
    this.logs.push({
      timestamp: new Date(),
      path,
      user: user || 'anonymous',
      result,
      userAgent
    })

    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100)
    }

    // Console log in development
    if (import.meta.env.DEV) {
      const status = result.allowed ? '✅' : '🚫'
      const message = result.allowed
        ? `Access granted to ${path}`
        : `Access denied to ${path}: ${result.reason}`

      console.log(`${status} [${user || 'anonymous'}] ${message}`)
    }
  }

  /**
   * Get access logs
   */
  getLogs(): typeof this.logs {
    return [...this.logs]
  }

  /**
   * Get failed access attempts
   */
  getFailedAttempts(): typeof this.logs {
    return this.logs.filter(log => !log.result.allowed)
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * Export logs as CSV
   */
  exportAsCSV(): string {
    const headers = ['Timestamp', 'Path', 'User', 'Status', 'Reason', 'User Agent']
    const rows = this.logs.map(log => [
      log.timestamp.toISOString(),
      log.path,
      log.user,
      log.result.allowed ? 'Allowed' : 'Denied',
      log.result.reason || '',
      log.userAgent || ''
    ])

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
  }
}

export const routeAccessLogger = new RouteAccessLogger()

export const createGuardWithLogging = (
  name: string,
  guardFunction: Function
) => {
  return async (...args: any[]) => {
    const [to, from, next] = args
    const authStore = useAuthStore()
    const startTime = performance.now()

    try {
      const result = await guardFunction(...args)
      const duration = performance.now() - startTime

      if (import.meta.env.DEV) {
        console.log(`🛡️  Guard "${name}" completed in ${duration.toFixed(2)}ms`)
      }

      return result
    } catch (error) {
      const duration = performance.now() - startTime
      console.error(`🚨 Guard "${name}" failed after ${duration.toFixed(2)}ms:`, error)

      // Log the error
      routeAccessLogger.log(
        to.path,
        {allowed: false, reason: `Guard error: ${error}`},
        authStore.user?.name
      )

      // Redirect to error page
      next('/500')
    }
  }
}

/**
 * Performance monitoring for guards
 */
export class GuardPerformanceMonitor {
  private metrics: Map<string, {
    totalTime: number
    callCount: number
    avgTime: number
    maxTime: number
    minTime: number
  }> = new Map()

  /**
   * Record guard execution time
   */
  record(guardName: string, duration: number): void {
    const existing = this.metrics.get(guardName) || {
      totalTime: 0,
      callCount: 0,
      avgTime: 0,
      maxTime: 0,
      minTime: Infinity
    }

    existing.totalTime += duration
    existing.callCount++
    existing.avgTime = existing.totalTime / existing.callCount
    existing.maxTime = Math.max(existing.maxTime, duration)
    existing.minTime = Math.min(existing.minTime, duration)

    this.metrics.set(guardName, existing)
  }

  /**
   * Get performance metrics
   */
  getMetrics(): Record<string, any> {
    const result: Record<string, any> = {}

    for (const [guardName, metrics] of this.metrics.entries()) {
      result[guardName] = {
        ...metrics,
        minTime: metrics.minTime === Infinity ? 0 : metrics.minTime
      }
    }

    return result
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics.clear()
  }

  /**
   * Get summary report
   */
  getSummary(): string {
    let report = 'Guard Performance Summary:\n'
    report += '========================\n'

    for (const [guardName, metrics] of this.metrics.entries()) {
      report += `${guardName}:\n`
      report += `  Calls: ${metrics.callCount}\n`
      report += `  Avg Time: ${metrics.avgTime.toFixed(2)}ms\n`
      report += `  Max Time: ${metrics.maxTime.toFixed(2)}ms\n`
      report += `  Min Time: ${metrics.minTime === Infinity ? 0 : metrics.minTime.toFixed(2)}ms\n`
      report += `  Total Time: ${metrics.totalTime.toFixed(2)}ms\n\n`
    }

    return report
  }
}

/**
 * Global performance monitor instance
 */
export const guardPerformanceMonitor = new GuardPerformanceMonitor()
