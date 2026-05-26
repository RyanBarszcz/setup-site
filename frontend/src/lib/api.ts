const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ApiFetchOptions = RequestInit & {
    token?: string | null;
};

export async function apiFetch<T>(
    path: string,
    options: ApiFetchOptions = {}
): Promise<T> {
    const { token, headers, ...rest } = options;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        cache: "no-store",
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
            ...headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${path}`);
    }

    return response.json();
}

// export async function registerAccount(data: RegisterPayload) {
//     return apiFetch("/auth/register", {
//         method: "POST",
//         body: JSON.stringify(data),
//     });
// }

export async function syncAccount(token: string) {
    return apiFetch("/auth/sync", {
        method: "POST",
        token,
    });
}

export async function getMySetups(token: string) {
    return apiFetch("/setups/mine", {
        method: "GET",
        token,
    });
}