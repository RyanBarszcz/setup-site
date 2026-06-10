"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { getMySetups } from "@/lib/api";

type Setup = {
    id: string;
    title: string;
    downloadCount: number;
    upvoteCount: number;
    rating?: number | null;
    status?: string;
    game: {
        name: string;
    };
    track: {
        name: string;
    };
    car: {
        name: string;
    };
};

type MySetupsResponse = {
    data: Setup[];
};

export default function MySetupsPage() {
    const { isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();

    const [setups, setSetups] = useState<Setup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const totalUploads = setups.length;

    const totalDownloads = setups.reduce(
        (sum, setup) => sum + (setup.downloadCount ?? 0),
        0
    );

    const avgRating =
        setups.length > 0
            ? (
                setups.reduce((sum, setup) => sum + (setup.rating ?? 0), 0) /
                setups.length
            ).toFixed(1)
            : "0";

    async function loadSetups() {
        try {
            setIsLoading(true);
            setError("");

            const token = await getToken();

            if (!token) {
                setSetups([]);
                return;
            }

            const response = await getMySetups(token) as MySetupsResponse;

            setSetups(response.data ?? []);
        } catch (error) {
            console.error(error);
            setError("Failed to load setups.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!isLoaded) return;

        if (isSignedIn) {
            loadSetups();
        } else {
            setIsLoading(false);
        }
    }, [isLoaded, isSignedIn]);

    if (!isLoaded) {
        return null;
    }

    if (!isSignedIn) {
        return (
            <main
                className="min-h-screen px-8 pt-28 text-white bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, rgba(0,0,0,0.78), rgba(0,0,0,0.95)), url('/backgrounds/ms-bg.jpg')",
                }}
            >
                <div className="mx-auto flex max-w-4xl flex-col items-center justify-center pt-24 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                        Creator Dashboard
                    </p>

                    <h1 className="mt-4 text-5xl font-bold tracking-tight">
                        Manage Your Setups
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg text-white/60">
                        Sign in or create an account to upload, edit, and track
                        your sim racing setups.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <Link
                            href="/login"
                            className="rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                        >
                            Sign In
                        </Link>

                        <Link
                            href="/sign-up"
                            className="rounded-full border border-white/10 px-7 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main
            className="min-h-screen px-8 pt-28 text-white bg-cover bg-center bg-fixed"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.78), rgba(0,0,0,0.95)), url('/backgrounds/setup-bg.jpg')",
            }}
        >
            <div className="mx-auto max-w-7xl pb-20">
                <div className="flex items-end justify-between gap-8">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                            Creator Dashboard
                        </p>

                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            My Setups
                        </h1>

                        <p className="mt-3 text-lg text-white/60">
                            View, edit, and manage your uploaded setups.
                        </p>
                    </div>

                    {setups.length !== 0 && (
                        <Link
                            href="/upload"
                            className="rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                        >
                            Upload Setup
                        </Link>)}
                </div>

                {error && (
                    <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <section className="mt-10 grid grid-cols-3 gap-5">
                    <div className="rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md">
                        <p className="text-3xl font-bold">
                            {isLoading ? "0" : totalUploads.toLocaleString()}
                        </p>
                        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/40">
                            Uploads
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md">
                        <p className="text-3xl font-bold">
                            {isLoading ? "0" : totalDownloads.toLocaleString()}
                        </p>
                        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/40">
                            Downloads
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md">
                        <p className="text-3xl font-bold">
                            {isLoading ? "0" : avgRating}
                        </p>
                        {/* TODO: Make this total thumbs up */}
                        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/40">
                            Avg Rating
                        </p>
                    </div>
                </section>

                <section className="mt-10 space-y-4">
                    {isLoading ? (
                        <div className="rounded-3xl border border-white/10 bg-black/35 p-12 text-center backdrop-blur-md">
                            <p className="text-white/50">
                                Loading your setups...
                            </p>
                        </div>
                    ) : setups.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-black/35 p-12 text-center backdrop-blur-md">
                            <h2 className="text-3xl font-bold">
                                No setups yet
                            </h2>

                            <p className="mx-auto mt-3 max-w-xl text-white/50">
                                Upload your first setup to start building your
                                creator dashboard.
                            </p>

                            <Link
                                href="/upload"
                                className="mt-8 inline-flex rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                            >
                                Create Setup
                            </Link>
                        </div>
                    ) : (
                        setups.map((setup) => (
                            <article
                                key={setup.id}
                                className="rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur-md transition hover:border-red-500/40 hover:bg-black/50"
                            >
                                <div className="flex items-center justify-between gap-8">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-semibold">
                                                {setup.title}
                                            </h2>

                                            <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs text-green-400">
                                                {setup.status ?? "Published"}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-white/50">
                                            {setup.game.name} /{" "}
                                            {setup.track.name} /{" "}
                                            {setup.car.name}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-10">
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">
                                                {setup.downloadCount.toLocaleString()}
                                            </p>
                                            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                                Downloads
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-2xl font-bold">
                                                {setup.rating ?? "0"}
                                            </p>
                                            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                                Rating
                                            </p>
                                        </div>

                                        <Link
                                            href={`/setups/${setup.id}/edit`}
                                            className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </div>
        </main>
    );
}