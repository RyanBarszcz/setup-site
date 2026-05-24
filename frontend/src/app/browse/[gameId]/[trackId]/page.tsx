export default function BrowseCarsPage({
    params,
}: {
    params: {
        gameId: string;
        trackId: string;
    };
}) {
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
                            {params.gameId} / {params.trackId}
                        </p>

                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            Choose Car
                        </h1>

                        <p className="mt-3 text-lg text-white/60">
                            Select a car to browse available community setups.
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Search cars..."
                        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-white/20 focus:bg-white/10 backdrop-blur-md"
                    />
                </div>

                <section className="mt-12 pb-20">
                    <h2 className="text-3xl font-semibold">Cars</h2>

                    <div className="mt-6 grid grid-cols-5 gap-5">
                        {Array.from({ length: 15 }).map((_, index) => (
                            <div
                                key={index}
                                className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:-translate-y-1 hover:border-red-500/50 hover:bg-white/10"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                                        GT3
                                    </p>

                                    <h3 className="mt-1 text-lg font-semibold leading-tight">
                                        Ferrari 296 GT3
                                    </h3>

                                    <p className="mt-1 text-sm text-white/50">
                                        248 setups
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}