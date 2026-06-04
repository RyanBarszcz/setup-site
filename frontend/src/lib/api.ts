const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ApiFetchOptions = RequestInit & {
    token?: string | null;
};

export type GameOption = {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    setupCount: number;
};

export type TrackOption = {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    setupCount: number;
};

export type CarOption = {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    manufacturer?: string | null;
    class?: string | null;
    setupCount: number;
};

export type SetupOption = {
    id: string;
    title: string;
    description?: string | null;
    downloadCount: number;
    upvoteCount: number;
    lapTimeMs?: number | null;
    setupType: string;
    weatherType: string;
    createdAt: string;
    game: GameOption;
    track: TrackOption;
    car: CarOption;
    user: {
        id: string;
        username?: string | null;
        imageUrl?: string | null;
    };
    tags: {
        tag: {
            id: string;
            name: string;
            slug: string;
        };
    }[];
};

export type SetupEditOption = {
    id: string;
    gameId: string;
    trackId: string;
    carId: string;
    title: string;
    description?: string | null;
    setupType: string;
    weatherType: string;
    visibility: string;
    trackCondition?: string | null;
    temperatureF?: number | null;
    lapTimeMs?: number | null;
    fuelLoad?: string | null;
    tireCompound?: string | null;
    fileName?: string | null;
    tags: string[];
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

export async function getPopularGames() {
    return apiFetch<{ games: GameOption[] }>("/games/popular", {
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

export async function getGameBySlug(gameSlug: string) {
    return apiFetch<{ game: GameOption }>(`/games/slug/${gameSlug}`, {
        method: "GET",
    });
}

export async function getTracksByGameSlug(gameSlug: string) {
    return apiFetch<{ tracks: TrackOption[] }>(
        `/tracks?gameSlug=${gameSlug}`,
        {
            method: "GET",
        }
    );
}

export async function getCarsByGameAndTrackSlug(
    gameSlug: string,
    trackSlug: string
) {
    return apiFetch<{ cars: CarOption[] }>(
        `/cars?gameSlug=${gameSlug}&trackSlug=${trackSlug}`,
        {
            method: "GET",
        }
    );
}

export async function getSetupsBySlugs(
    gameSlug: string,
    trackSlug: string,
    carSlug: string,
    token?: string | null
) {
    return apiFetch<{ data: SetupOption[] }>(
        `/setups?gameSlug=${gameSlug}&trackSlug=${trackSlug}&carSlug=${carSlug}`,
        {
            method: "GET",
            token: token ?? undefined,
        }
    );
}

export async function getSetupForEdit(setupId: string, token: string) {
    return apiFetch<{ setup: SetupEditOption & { fileName?: string | null } }>(
        `/setups/${setupId}/edit`,
        {
            method: "GET",
            token,
        }
    );
}

export async function updateSetup(
    setupId: string,
    data: FormData,
    token: string
) {
    return apiFetch<{ message: string; setup: SetupEditOption }>(
        `/setups/${setupId}`,
        {
            method: "PATCH",
            body: data,
            token,
        }
    );
}

export async function toggleVote(
    setupId: string,
    token: string
) {
    return apiFetch<{
        hasUpvoted: boolean;
        upvoteCount: number;
    }>(`/setups/${setupId}/vote`, {
        method: "POST",
        token,
    });
}