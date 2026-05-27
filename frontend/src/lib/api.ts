const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ApiFetchOptions = RequestInit & {
    token?: string | null;
};

export type GameOption = {
    id: string;
    name: string;
};

export type TrackOption = {
    id: string;
    name: string;
};

export type CarOption = {
    id: string;
    name: string;
};

export async function apiFetch<T>(
    path: string,
    options: ApiFetchOptions = {}
): Promise<T> {
    const { token, headers, ...rest } = options;

    const isFormData = rest.body instanceof FormData;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        cache: "no-store",
        ...rest,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    });

    if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("API error:", errorData);
    throw new Error(errorData?.message || `API request failed: ${path}`);
    }

    return response.json();
}

export async function syncAccount(token: string) {
    return apiFetch("/auth/sync", {
        method: "POST",
        token,
    });
}

export async function getGames() {
    return apiFetch<{ games: GameOption[] }>("/games", {
        method: "GET",
    });
}

export async function getTracksByGame(gameId: string) {
    return apiFetch<{ tracks: TrackOption[] }>(`/tracks?gameId=${gameId}`, {
        method: "GET",
    });
}

export async function getCarsByGame(gameId: string) {
    return apiFetch<{ cars: CarOption[] }>(`/cars?gameId=${gameId}`, {
        method: "GET",
    });
}

export async function getMySetups(token: string) {
    return apiFetch("/setups/mine", {
        method: "GET",
        token,
    });
}

export async function createSetup(formData: FormData, token: string) {
    return apiFetch("/setups", {
        method: "POST",
        body: formData,
        token,
    });
}