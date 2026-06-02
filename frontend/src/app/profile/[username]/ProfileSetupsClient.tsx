"use client";

import { useState } from "react";
import Link from "next/link";

type Setup = {
    id: string;
    title: string;
    description: string | null;
    game: { name: string };
    car: { name: string };
    track: { name: string };
};

export default function ProfileSetupsClient({ setups }: { setups: Setup[] }) {
    const [search, setSearch] = useState("");

    const filteredSetups = setups.filter((setup) => {
        const value = search.toLowerCase().trim();

        return (
            setup.title.toLowerCase().includes(value) ||
            setup.description?.toLowerCase().includes(value) ||
            setup.game.name.toLowerCase().includes(value) ||
            setup.car.name.toLowerCase().includes(value) ||
            setup.track.name.toLowerCase().includes(value)
        );
    });

    return (
        <div className="mt-10">
            <div className="flex items-end justify-between gap-8">
                <h2 className="text-2xl font-bold">Setups</h2>

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search this driver's setups..."
                    className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-white/40 focus:border-red-500/40 focus:bg-white/10"
                />
            </div>

            {filteredSetups.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-zinc-400">
                    No setups found.
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-3 gap-5">
                    {filteredSetups.map((setup) => (
                        <Link
                            key={setup.id}
                            href={`/setups/${setup.id}`}
                            className="rounded-3xl border border-white/10 bg-zinc-950 p-6 transition hover:border-red-500/50 hover:bg-zinc-900"
                        >
                            <h3 className="text-lg font-bold">{setup.title}</h3>

                            <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                                {setup.description || "No description provided."}
                            </p>

                            <div className="mt-5 space-y-1 text-sm text-zinc-500">
                                <p>{setup.game.name}</p>
                                <p>{setup.car.name}</p>
                                <p>{setup.track.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}