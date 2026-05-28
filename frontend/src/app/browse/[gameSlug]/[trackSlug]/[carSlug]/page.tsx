import { getSetupsBySlugs } from "@/lib/api";

const tags = [
    "Race",
    "Qualifying",
    "Wet",
    "Dry",
    "Stable",
    "Aggressive",
    "Beginner Friendly",
    "Low Fuel",
    "High Fuel",
    "Endurance",
    "Hotlap",
    "Controller Friendly",
];

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

    const response = await getSetupsBySlugs(gameSlug, trackSlug, carSlug);
    const setups = response.data;

    return (
        <main
            className="min-h-screen px-8 pt-28 text-white bg-cover bg-center bg-fixed"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.78), rgba(0,0,0,0.95)), url('/backgrounds/browse-bg.jpg')",
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

                    <select className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none backdrop-blur-md">
                        <option>Most Downloads</option>
                        <option>Highest Rated</option>
                        <option>Newest</option>
                        <option>Oldest</option>
                    </select>
                </div>

                <div className="mt-8">
                    <input
                        type="text"
                        placeholder="Search setups by name or tag..."
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-white/20 focus:bg-white/10 backdrop-blur-md"
                    />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-md transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-white"
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <section className="mt-10 space-y-5">
                    {setups.map((setup) => (
                        <article
                            key={setup.id}
                            className="rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur-md transition hover:border-red-500/40 hover:bg-black/50"
                        >
                            <div className="flex items-center justify-between gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-semibold">
                                            {setup.title}
                                        </h2>

                                        <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-400">
                                            {setup.upvoteCount} upvotes
                                        </span>
                                    </div>

                                    <p className="mt-2 max-w-3xl text-sm text-white/55">
                                        {setup.description ||
                                            "No description provided."}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {setup.tags.slice(0, 3).map((item) => (
                                            <span
                                                key={item.tag.id}
                                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                                            >
                                                {item.tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-10">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">
                                            {setup.downloadCount.toLocaleString()}
                                        </p>

                                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                            Downloads
                                        </p>

                                        <p className="mt-2 text-sm text-white/40">
                                            by{" "}
                                            {setup.user.username || "Unknown"}
                                        </p>
                                    </div>

                                    <button className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500">
                                        View Setup
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}

                    {setups.length === 0 && (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/60 backdrop-blur-md">
                            No setups found for this car yet.
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}