"use client";

import { useState } from "react";
import Link from "next/link";

type Track = {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    setupCount: number;
};

export default function TrackSearchClient({
    gameSlug,
    tracks,
}: {
    gameSlug: string;
    tracks: Track[];
}) {
    const [search, setSearch] = useState("");

    const filteredTracks = tracks.filter((track) =>
        track.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="mt-12 pb-20">
            <div className="flex items-end justify-between gap-8">
                <h2 className="text-3xl font-semibold">Tracks</h2>

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search tracks..."
                    className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-white/40 focus:border-white/20 focus:bg-white/10 backdrop-blur-md"
                />
            </div>

            {filteredTracks.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-white/60 backdrop-blur-md">
                    No tracks found.
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-4 gap-5">
                    {filteredTracks.map((track) => (
                        <Link
                            key={track.id}
                            href={`/browse/${gameSlug}/${track.slug}`}
                            className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:-translate-y-1 hover:border-red-500/50 hover:bg-white/10"
                        >
                            {track.imageUrl && (
                                <img
                                    src={track.imageUrl}
                                    alt={track.name}
                                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                                    Track
                                </p>

                                <h3 className="mt-1 text-xl font-semibold">
                                    {track.name}
                                </h3>

                                <p className="mt-1 text-sm text-white/50">
                                    {track.setupCount}{" "}
                                    {track.setupCount === 1 ? "setup" : "setups"}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}