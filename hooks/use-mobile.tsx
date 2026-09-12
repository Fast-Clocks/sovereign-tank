import * as React from 'react'

const MOBILE_BREAKPOINT = 768
const MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

/**
 * Previously this subscribed inside useEffect and then called setState
 * synchronously in the same effect — flagged by `react-hooks/set-state-in-effect`
 * because it forces a second render pass on every mount.
 *
 * useSyncExternalStore is the intended API for reading a browser store like
 * matchMedia, and it is SSR-safe: getServerSnapshot supplies the value used
 * during server render, so there is no hydration mismatch.
 */
function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(MEDIA_QUERY)
  mql.addEventListener('change', onStoreChange)
  return () => mql.removeEventListener('change', onStoreChange)
}

export function useIsMobile(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MEDIA_QUERY).matches,
    // Server render assumes desktop. This matches the previous behaviour, where
    // `isMobile` was undefined (falsy) until the client effect first ran.
    () => false,
  )
}
