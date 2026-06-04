import { getSetupsBySlugs } from "@/lib/api";
import SetupResultsClient from "./SetupResultsClient";
import { auth } from "@clerk/nextjs/server";

export default async function SetupResultsPage({
    params,
}: {
    params: Promise<{
        gameSlug: string;
        trackSlug: string;
        carSlug: string;
    }>;
}) {
    const { gameSlug, trackSlug, carSlug } = await params;

    const { getToken } = await auth();
    const token = await getToken();

    const response = await getSetupsBySlugs(
        gameSlug,
        trackSlug,
        carSlug,
        token
    );

    const setups = response.data;

    return (
        <main
            className="min-h-screen px-8 pt-28 text-white bg-cover bg-center bg-fixed"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.78), rgba(0,0,0,0.95)), url('/backgrounds/upload-bg.jpg')",
            }}
        >
            <div className="max-w-7xl mx-auto pb-20">
                <div className="flex items-end justify-between gap-8">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                            {gameSlug} / {trackSlug} / {carSlug}
                        </p>

                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            Community Setups
                        </h1>

                        <p className="mt-3 text-lg text-white/60">
                            Browse downloadable setups sorted by popularity,
                            tags, and driving style.
                        </p>
                    </div>
                </div>

                {/* TODO: Fix types */}
                <div className="mt-8">
                    <SetupResultsClient setups={setups} />
                </div>
            </div>
        </main>
    );
}