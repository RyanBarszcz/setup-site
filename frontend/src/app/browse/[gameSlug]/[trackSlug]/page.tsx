import Link from "next/link";
import { getCarsByGameAndTrackSlug } from "@/lib/api";
import CarSearchClient from "./CarSearchClient";
import { Car } from "lucide-react";

export default async function BrowseCarsPage({
    params,
}: {
    params: Promise<{
        gameSlug: string;
        trackSlug: string;
    }>;
}) {
    const { gameSlug, trackSlug } = await params;

    const response = await getCarsByGameAndTrackSlug(gameSlug, trackSlug);
    const cars = response.cars;

    return (
        <main
            className="min-h-screen px-8 pt-28 text-white bg-cover bg-center bg-fixed"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.76), rgba(0,0,0,0.94)), url('/backgrounds/car-bg.jpg')",
            }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between gap-8">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                            {gameSlug} / {trackSlug}
                        </p>

                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            Choose Car
                        </h1>

                        <p className="mt-3 text-lg text-white/60">
                            Select a car to browse available community setups.
                        </p>
                    </div>
                </div>
                <CarSearchClient
                    gameSlug={gameSlug}
                    trackSlug={trackSlug}
                    cars={cars}
                />
            </div>
        </main>
    );
}