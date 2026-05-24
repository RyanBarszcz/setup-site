const mockSetups = [
    {
        name: "Safe Race Setup",
        game: "Assetto Corsa Competizione",
        track: "Spa-Francorchamps",
        car: "Ferrari 296 GT3",
        downloads: 1284,
        rating: 4.8,
        status: "Published",
    },
    {
        name: "Aggressive Quali Setup",
        game: "iRacing",
        track: "Daytona",
        car: "Porsche 992 GT3 R",
        downloads: 642,
        rating: 4.6,
        status: "Published",
    },
];

export default function MySetupsPage() {
    const isSignedIn = true;

    if (!isSignedIn) {
        return (
            <main
                className="min-h-screen px-8 pt-28 text-white bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, rgba(0,0,0,0.78), rgba(0,0,0,0.95)), url('/backgrounds/ms-bg.jpg')",
                }}
            >
                <div className="mx-auto flex max-w-4xl flex-col items-center justify-center pt-24 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                        Creator Dashboard
                    </p>

                    <h1 className="mt-4 text-5xl font-bold tracking-tight">
                        Manage Your Setups
                    </h1>

                    <p className="mt-4 max-w-2xl text-lg text-white/60">
                        Sign in or create an account to upload, edit, and track
                        your sim racing setups.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <button className="rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-500">
                            Sign In
                        </button>

                        <button className="rounded-full border border-white/10 px-7 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
                            Create Account
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main
            className="min-h-screen px-8 pt-28 text-white bg-cover bg-center bg-fixed"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.78), rgba(0,0,0,0.95)), url('/backgrounds/setup-bg.jpg')",
            }}
        >
            <div className="mx-auto max-w-7xl pb-20">
                <div className="flex items-end justify-between gap-8">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                            Creator Dashboard
                        </p>

                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            My Setups
                        </h1>

                        <p className="mt-3 text-lg text-white/60">
                            View, edit, and manage your uploaded setups.
                        </p>
                    </div>

                    <button className="rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-500">
                        Upload Setup
                    </button>
                </div>

                <section className="mt-10 grid grid-cols-3 gap-5">
                    <div className="rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md">
                        <p className="text-3xl font-bold">2</p>
                        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/40">
                            Uploads
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md">
                        <p className="text-3xl font-bold">1,926</p>
                        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/40">
                            Downloads
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md">
                        <p className="text-3xl font-bold">4.7</p>
                        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/40">
                            Avg Rating
                        </p>
                    </div>
                </section>

                <section className="mt-10 space-y-4">
                    {mockSetups.map((setup) => (
                        <article
                            key={setup.name}
                            className="rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur-md transition hover:border-red-500/40 hover:bg-black/50"
                        >
                            <div className="flex items-center justify-between gap-8">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-semibold">
                                            {setup.name}
                                        </h2>

                                        <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs text-green-400">
                                            {setup.status}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm text-white/50">
                                        {setup.game} / {setup.track} /{" "}
                                        {setup.car}
                                    </p>
                                </div>

                                <div className="flex items-center gap-10">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">
                                            {setup.downloads.toLocaleString()}
                                        </p>
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                            Downloads
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold">
                                            {setup.rating}
                                        </p>
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                            Rating
                                        </p>
                                    </div>

                                    <button className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}