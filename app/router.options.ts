import type {RouterConfig} from '@nuxt/schema'

// Instant navigation, always start a new route at the top; restore the saved
// position on back/forward. (iOS Safari doesn't reset window scroll on its own
// for SPA route changes.)
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.path === from.path) return {}
    return {left: 0, top: 0}
  },
}
