"use client";

import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";

export default function Navbar() {
    const { signOut } = useClerk();
    const { isSignedIn, user } = useUser();

    async function handleLogout() {
        await signOut();
    }

    const initial =
        user?.firstName?.[0] ||
        user?.emailAddresses?.[0]?.emailAddress?.[0] ||
        "R";

    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-[1800px] items-center justify-between px-12">
                <Link href="/" className="text-3xl font-black italic tracking-tight">
                    SETUPS<span className="text-red-600">RUS</span>
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
                    <div className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-500 xl:block">
                        Search setups, tracks, cars...
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