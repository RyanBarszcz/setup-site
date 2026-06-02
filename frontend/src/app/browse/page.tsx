import Link from "next/link";
import { getGames, getPopularGames } from "@/lib/api";

// TODO: Work on images for each
// TODO: Work on search and if searching change how page looks
// TODO: Work on loading pages/skeleton loaders

export default async function BrowseGamesPage() {
    const [gamesResponse, popularGamesResponse] = await Promise.all([
        getGames(),
        getPopularGames(),
    ]);

    const games = gamesResponse.games;
    const popularGames = popularGamesResponse.games;

    return (
        <main
            className="min-h-screen px-8 pt-28 text-white bg-cover bg-center bg-fixed relative"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.92)), url('/backgrounds/games-bg.jpg')",
            }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-bold tracking-tight">
                            Browse Setups
                        </h1>

                        <p className="mt-3 text-lg text-white/60">
                            Find community-created setups for your favorite sim
                            racing games.
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Search games..."
                        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-white/20 focus:bg-white/10 backdrop-blur-md"
                    />
                </div>

                {popularGames.length > 0 && (
                    <section className="mt-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-semibold">
                                Popular Games
                            </h2>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-6">
                            {popularGames.map((game) => (
                                <Link
                                    key={game.id}
                                    href={`/browse/${game.slug}`}
                                    className="group relative h-[240px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md"
                                >
                                    {game.imageUrl && (
                                        <img
                                            src={game.imageUrl}
                                            alt={game.name}
                                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-2xl font-bold">
                                            {game.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-white/60">
                                            {game.setupCount}{" "}
                                            {game.setupCount === 1
                                                ? "Setup"
                                                : "Setups"}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section className="mt-20 pb-20">
                    <h2 className="text-3xl font-semibold">All Games</h2>

                    <div className="mt-6 grid grid-cols-5 gap-5">
                        {games.map((game) => (
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

                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="font-semibold">
                                        {game.name}
                                    </h3>

                                    <p className="mt-1 text-xs text-white/55">
                                        {game.setupCount}{" "}
                                        {game.setupCount === 1
                                            ? "Setup"
                                            : "Setups"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}