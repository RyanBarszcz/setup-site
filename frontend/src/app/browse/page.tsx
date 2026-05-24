export default function BrowseGamesPage() {
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

                <section className="mt-12">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-semibold">
                            Popular Games
                        </h2>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-6">
                        <div className="h-[240px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md" />
                        <div className="h-[240px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md" />
                        <div className="h-[240px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md" />
                    </div>
                </section>

                <section className="mt-20 pb-20">
                    <h2 className="text-3xl font-semibold">All Games</h2>

                    <div className="mt-6 grid grid-cols-5 gap-5">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div
                                key={index}
                                className="aspect-[16/10] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}