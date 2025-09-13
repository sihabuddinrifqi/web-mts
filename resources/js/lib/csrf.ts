/**
 * CSRF Token Management
 * Handles CSRF token refresh and validation
 */

let csrfToken: string | null = null;

/**
 * Get CSRF token from meta tag
 */
export function getCsrfToken(): string | null {
    if (!csrfToken) {
        const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        csrfToken = meta?.content || null;
    }
    return csrfToken;
}

/**
 * Refresh CSRF token from server
 */
export async function refreshCsrfToken(): Promise<string | null> {
    try {
        const response = await fetch('/api/csrf-token', {
            method: 'GET',
            credentials: 'same-origin',
        });

        if (response.ok) {
            const data = await response.json();
            csrfToken = data.csrf_token;
            
            // Update meta tag
            const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
            if (meta) {
                meta.content = csrfToken;
            }
            
            return csrfToken;
        }
    } catch (error) {
        console.error('Failed to refresh CSRF token:', error);
    }
    
    return null;
}

/**
 * Get CSRF token with automatic refresh if needed
 */
export async function getValidCsrfToken(): Promise<string | null> {
    let token = getCsrfToken();
    
    if (!token) {
        token = await refreshCsrfToken();
    }
    
    return token;
}

/**
 * Handle CSRF token mismatch error
 */
export async function handleCsrfError(): Promise<string | null> {
    console.log('CSRF token mismatch detected, refreshing...');
    return await refreshCsrfToken();
}
