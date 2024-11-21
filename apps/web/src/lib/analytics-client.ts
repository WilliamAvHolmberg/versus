export async function trackEvent(event: {
    type: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>
}) {
    return fetch('/api/analytics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    }).catch(error => {
        console.error('Analytics error:', error)
    })
} 