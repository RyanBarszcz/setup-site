import Link from "next/link";

export default function Navbar() {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-[1800px] items-center justify-between px-12">
                <Link href="/" className="text-3xl font-black italic tracking-tight">
                    SETUPS<span className="text-red-600">RUS</span>
                </Link>

                <div className="hidden gap-10 text-sm uppercase tracking-wide text-zinc-300 lg:flex">
                    <Link href="/setups" className="hover:text-white">
                        Browse Setups
                    </Link>

                    <Link href="/" className="hover:text-white">
                        Top Setups
                    </Link>

                    <Link href="/" className="hover:text-white">
                        Community
                    </Link>

                    <Link href="/" className="hover:text-white">
                        Support
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-500 xl:block">
                        Search setups, tracks, cars...
                    </div>

                    <button className="text-sm uppercase text-zinc-300">
                        Log In
                    </button>

                    <button className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold uppercase text-white shadow-[0_0_25px_rgba(220,38,38,0.25)]">
                        Sign Up
                    </button>
                </div>
            </div>
        </header>
    );
}