"use client";

import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

// TODO: Make profile be clickable and be able to option a users profile so they can edit info

export default function Navbar() {
    const { signOut } = useClerk();
    const { isSignedIn, user } = useUser();

    type UserResult = {
        id: string;
        username: string;
        name: string | null;
        image: string | null;
    };

    async function handleLogout() {
        await signOut();
    }

    const initial =
        user?.firstName?.[0] ||
        user?.emailAddresses?.[0]?.emailAddress?.[0] ||
        "R";

    const [search, setSearch] = useState("");
    const [results, setResults] = useState<UserResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const value = search.trim();

        if (value.length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setIsSearching(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/search?q=${encodeURIComponent(value)}`
                );

                const data = await res.json();

                setResults(data.users || []);
                setShowResults(true);
            } catch (err) {
                console.error("User search failed:", err);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-[1800px] items-center justify-between px-12">
                <Link href="/" className="text-3xl font-black italic tracking-tight">
                    SETUPS<span className="text-red-600">R</span>US
                </Link>

                <div className="hidden gap-10 text-sm uppercase tracking-wide text-zinc-300 lg:flex">
                    <Link href="/browse" className="hover:text-white">
                        Browse Setups
                    </Link>
                    <Link href="/upload" className="hover:text-white">
                        Upload Setup
                    </Link>
                    <Link href="/my-setups" className="hover:text-white">
                        My Setups
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden xl:block">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => {
                                if (results.length > 0) setShowResults(true);
                            }}
                            placeholder="Search drivers..."
                            className="w-72 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none transition focus:border-red-500/50 focus:bg-white/10"
                        />

                        {/* TODO: Work on the profile image part */}
                        {showResults && search.trim().length >= 2 && (
                            <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
                                {isSearching ? (
                                    <div className="px-5 py-4 text-sm text-zinc-500">
                                        Searching...
                                    </div>
                                ) : results.length > 0 ? (
                                    results.map((result) => (
                                        <Link
                                            key={result.id}
                                            href={`/profile/${result.username}`}
                                            onClick={() => {
                                                setSearch("");
                                                setResults([]);
                                                setShowResults(false);
                                            }}
                                            className="flex items-center gap-3 px-5 py-4 transition hover:bg-white/5"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold uppercase text-white">
                                                {result.image ? (
                                                    <img
                                                        src={result.image}
                                                        alt={result.username}
                                                        className="h-full w-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    result.username[0]
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-md font-semibold text-white">
                                                    {result.username}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-5 py-4 text-sm text-zinc-500">
                                        No drivers found.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {!isSignedIn ? (
                        <>
                            <Link
                                href="/login"
                                className="text-sm uppercase text-zinc-300 hover:text-white"
                            >
                                Log In
                            </Link>

                            <Link
                                href="/sign-up"
                                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold uppercase text-white shadow-[0_0_25px_rgba(220,38,38,0.25)]"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-sm font-bold uppercase text-white">
                                {initial}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold uppercase text-white shadow-[0_0_25px_rgba(220,38,38,0.25)]"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}