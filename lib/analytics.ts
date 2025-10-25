// Client-side analytics tracking
export const trackEvent = (eventName: string, params?: any) => {
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventName, params)
    }
    
    // Server-side tracking
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventName,
        event_data: params
      })
    }).catch(error => {
      console.error('Error tracking event:', error)
    })
  }
}

// Specific event tracking functions
export const trackModeSelected = (mode: string) => {
  trackEvent('mode_selected', { mode })
}

export const trackPantunGenerated = (mode: string, success: boolean) => {
  trackEvent('pantun_generated', { mode, success })
}

export const trackPantunCopied = (mode: string) => {
  trackEvent('pantun_copied', { mode })
}

export const trackPantunShared = (mode: string, shareMethod: string) => {
  trackEvent('pantun_shared', { mode, share_method: shareMethod })
}

export const trackPageView = (page: string) => {
  trackEvent('page_view', { page })
}

export const trackSharePageView = (slug: string) => {
  trackEvent('share_page_view', { slug })
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
