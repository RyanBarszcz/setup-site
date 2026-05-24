export default function UploadSetupPage() {
    // TODO: Make drop downs better, maybe a modal
    return (
        <main
            className="min-h-screen px-8 pt-28 text-white bg-cover bg-center bg-fixed"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.78), rgba(0,0,0,0.95)), url('/backgrounds/upload-bg.jpg')",
            }}
        >
            <div className="mx-auto max-w-5xl pb-20">
                <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                    Creator Tools
                </p>

                <h1 className="mt-3 text-5xl font-bold tracking-tight">
                    Upload Setup
                </h1>

                <p className="mt-3 text-lg text-white/60">
                    Share a setup file with the community. Add the game, track,
                    car, tags, and driving notes.
                </p>

                <form className="mt-10 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
                    <div className="grid grid-cols-3 gap-5">
                        <div>
                            <label className="text-sm text-white/50">
                                Game
                            </label>
                            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
                                <option>Select game</option>
                                <option>Assetto Corsa Competizione</option>
                                <option>iRacing</option>
                                <option>Le Mans Ultimate</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-white/50">
                                Track
                            </label>

                            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
                                <option>Select track</option>
                                <option>Spa-Francorchamps</option>
                                <option>Monza</option>
                                <option>Daytona</option>
                            </select>

                            <p className="mt-2 text-sm text-white/40">
                                Can&apos;t find your track?{" "}
                                <button
                                    type="button"
                                    className="text-red-400 transition hover:text-red-300"
                                >
                                    Request new track
                                </button>
                            </p>
                        </div>

                        <div>
                            <label className="text-sm text-white/50">
                                Car
                            </label>
                            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
                                <option>Select car</option>
                                <option>Ferrari 296 GT3</option>
                                <option>Porsche 992 GT3 R</option>
                                <option>BMW M4 GT3</option>
                            </select>

                            <p className="mt-2 text-sm text-white/40">
                                Can&apos;t find your ?{" "}
                                <button
                                    type="button"
                                    className="text-red-400 transition hover:text-red-300"
                                >
                                    Request new car
                                </button>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="text-sm text-white/50">
                            Setup Name
                        </label>
                        <input
                            type="text"
                            placeholder="Example: Safe Race Setup"
                            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                        />
                    </div>

                    <div className="mt-6">
                        <label className="text-sm text-white/50">
                            Description
                        </label>
                        <textarea
                            placeholder="Describe the setup, balance, fuel range, conditions, or driving style..."
                            rows={4}
                            className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                        />
                    </div>

                    <div className="mt-6">
                        <label className="text-sm text-white/50">
                            Setup Tags
                        </label>

                        <div className="mt-3 flex flex-wrap gap-3">
                            {[
                                "Race",
                                "Qualifying",
                                "Dry",
                                "Wet",
                                "Stable",
                                "Aggressive",
                                "Beginner Friendly",
                                "Low Fuel",
                                "High Fuel",
                                "Endurance",
                            ].map((tag) => (
                                <button
                                    type="button"
                                    key={tag}
                                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-white"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <label className="text-sm text-white/50">
                            Setup File
                        </label>

                        <div className="mt-3 flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center transition hover:border-red-500/50 hover:bg-red-500/10">
                            <p className="text-lg font-semibold">
                                Drop your setup file here
                            </p>
                            <p className="mt-2 text-sm text-white/50">
                                Or click to browse your computer
                            </p>

                            <input type="file" className="mt-6 text-sm" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            type="button"
                            className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                        >
                            Publish Setup
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}