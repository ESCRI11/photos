// Base path configuration for static exports
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/photos'

/**
 * Prepends the basePath to a given path
 * @param path - The path to prepend the basePath to
 * @returns The path with basePath prepended
 */
export function withBasePath(path: string): string {
  // Don't add basePath if it's already there or if path is external
  if (path.startsWith('http') || path.startsWith(basePath)) {
    return path
  }
  return `${basePath}${path}`
}

/**
 * Hook for getting the basePath-aware path
 */
export function useBasePath() {
  return { basePath, withBasePath }
}

