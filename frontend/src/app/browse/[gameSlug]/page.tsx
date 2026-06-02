import Link from "next/link";
import { getGameBySlug, getTracksByGameSlug } from "@/lib/api";
import TrackSearchClient from "./TrackSearchClient";

export default async function BrowseTracksPage({
    params,
}: {
    params: Promise<{ gameSlug: string }>;
}) {
    const { gameSlug } = await params;

    const [gameResponse, tracksResponse] = await Promise.all([
        getGameBySlug(gameSlug),
        getTracksByGameSlug(gameSlug),
    ]);

    const game = gameResponse.game;
    const tracks = tracksResponse.tracks;

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
                            {game.name}
                        </p>

                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            Choose Track
                        </h1>

                        <p className="mt-3 text-lg text-white/60">
                            Select a circuit to view available cars and setups.
                        </p>
                    </div>
                </div>
                <TrackSearchClient gameSlug={game.slug} tracks={tracks} />
            </div>
        </main>
    );
}