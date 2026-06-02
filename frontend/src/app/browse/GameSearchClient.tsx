"use client";

import { useState } from "react";
import Link from "next/link";

type Game = {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    setupCount: number;
};

export default function GameSearchClient({ games }: { games: Game[] }) {
    const [search, setSearch] = useState("");

    const filteredGames = games.filter((game) =>
        game.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="mt-20 pb-20">
            <div className="flex items-end justify-between gap-8">
                <h2 className="text-3xl font-semibold">All Games</h2>

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search games..."
                    className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
                />
            </div>

            {filteredGames.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-white/50">
                    No games found.
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-5 gap-5">
                    {filteredGames.map((game) => (
                        <Link
                            key={game.id}
                            href={`/browse/${game.slug}`}
                            className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
                        >
                            {game.imageUrl && (
                                <img
                                    src={game.imageUrl}
                                    alt={game.name}
                                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-lg font-bold">{game.name}</h3>
                                <p className="mt-1 text-xs text-white/60">
                                    {game.setupCount}{" "}
                                    {game.setupCount === 1 ? "Setup" : "Setups"}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}