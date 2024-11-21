// const API_URL = 'http://localhost:3000'
const API_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://pagepin.vercel.app';

export async function saveBookmark(url: string, title: string) {
    const response = await fetch(`${API_URL}/api/bookmarks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ url, title }),
    });

    if (!response.ok) {
        throw new Error('Failed to save bookmark');
    }

    return response.json();
}

export async function checkAuth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/api/auth/check`, {
            credentials: 'include'
        });
        return response.ok;
    } catch {
        return false;
    }
}

export async function initiateLogin(phone: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/api/auth/extension`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
        throw new Error('Failed to initiate login');
    }

    return response.json();
}

export async function verifyCode(phone: string, code: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/api/auth/extension`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ phone, code }),
    });

    if (!response.ok) {
        throw new Error('Failed to verify code');
    }

    return response.json();
} 