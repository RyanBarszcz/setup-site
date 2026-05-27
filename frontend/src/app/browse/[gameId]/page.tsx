import Link from "next/link";
import { getTracksByGame } from "@/lib/api";

export default async function BrowseTracksPage({
    params,
}: {
    params: Promise<{ gameId: string }>;
}) {
    const { gameId } = await params;
    // console.log("gameId param:", gameId);

    const response = await getTracksByGame(gameId);
    const tracks = response.tracks;
    // console.log("Tracks", tracks);

    return (
        <main
            className="min-h-screen px-8 pt-28 text-white bg-cover bg-center bg-fixed"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.75)), url('/backgrounds/track-bg.jpeg')",
            }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between gap-8">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                            {gameId}
                        </p>

                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            Choose Track
                        </h1>

                        <p className="mt-3 text-lg text-white/60">
                            Select a circuit to view available cars and setups.
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Search tracks..."
                        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-white/20 focus:bg-white/10 backdrop-blur-md"
                    />
                </div>

                <section className="mt-12 pb-20">
                    <h2 className="text-3xl font-semibold">Tracks</h2>

                    <div className="mt-6 grid grid-cols-4 gap-5">
                        {tracks.map((track) => (
                            <Link
                                key={track.id}
                                href={`/browse/${gameId}/${track.id}`}
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
                                        {track.setupCount === 1
                                            ? "setup"
                                            : "setups"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {tracks.length === 0 && (
                        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-white/60 backdrop-blur-md">
                            No tracks found for this game yet.
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}