import type {RoutePermissionConfig} from "./utils";

/**
 * Route pattern matcher
 */
export class RoutePatternMatcher {
  private patterns: Map<string, RoutePermissionConfig> = new Map();

  /**
   * Add a route pattern
   */
  add(pattern: string, config: RoutePermissionConfig): void {
    this.patterns.set(pattern, config);
  }

  /**
   * Add multiple patterns
   */
  addMany(patterns: Record<string, RoutePermissionConfig>): void {
    Object.entries(patterns).forEach(([pattern, config]) => {
      this.add(pattern, config)
    })
  }

  /**
   * Find matching configuration for a path
   */
  match(path: string): RoutePermissionConfig | null {
    // Exact match first
    if (this.patterns.has(path)) {
      return this.patterns.get(path)!
    }

    // Pattern matching
    for (const [pattern, config] of this.patterns.entries()) {
      if (this.matchPattern(pattern, path)) {
        return config
      }
    }
    return null
  }

  /**
   * Check if path matches pattern
   */

  private matchPattern(pattern: string, path: string): boolean {
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '.*')           // * matches anything
      .replace(/:\w+/g, '[^/]+')      // :param matches path segment
      .replace(/\//g, '\\/')          // escape slashes

    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(path)
  }

  /**
   * Get all patterns
   */
  getPatterns(): string[] {
    return Array.from(this.patterns.keys())
  }

  /**
   * Clear all patterns
   */
  clear(): void {
    this.patterns.clear()
  }

  /**
   * Remove a pattern
   */
  remove(pattern: string): boolean {
    return this.patterns.delete(pattern)
  }
}

/**
 * Global route pattern matcher instance
 */
export const routePatternMatcher = new RoutePatternMatcher();
