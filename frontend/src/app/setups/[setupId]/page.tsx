import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getSetupById } from "@/lib/api";
import SetupActions from "./SetupActions";
import Link from "next/link";

type PageProps = {
    params: Promise<{
        setupId: string;
    }>;
};

export default async function SetupDetailPage({ params }: PageProps) {
    const { setupId } = await params;

    let setup;

    try {
        const { getToken } = await auth();
        const token = await getToken();

        const data = await getSetupById(setupId, token);
        setup = data.setup;
    } catch {
        notFound();
    }

    return (
        <main className="min-h-screen bg-black px-6 py-28 text-white">
            <div className="mx-auto max-w-5xl">
                <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-8">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-red-500">
                                Setup
                            </p>

                            <h1 className="mt-3 text-4xl font-black">
                                {setup.title}
                            </h1>

                            <p className="mt-3 text-zinc-400">
                                Uploaded by{" "}
                                <Link
                                    href={`/profile/${setup.user.username}`}
                                    className="text-white transition hover:text-red-400">
                                    @{setup.user?.username || "Unknown User"}
                                </Link>
                            </p>
                        </div>
                    </div>

                    {setup.description && (
                        <p className="mt-8 text-lg leading-8 text-zinc-300">
                            {setup.description}
                        </p>
                    )}

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <InfoCard label="Game" value={setup.game.name} />
                        <InfoCard label="Track" value={setup.track.name} />
                        <InfoCard label="Car" value={setup.car.name} />
                        <InfoCard label="Setup Type" value={setup.setupType} />

                        <InfoCard
                            label="Downloads"
                            value={`${setup.downloadCount ?? 0}`}
                        />

                        {setup.weatherType && setup.weatherType !== "UNKNOWN" && (
                            <InfoCard label="Weather" value={setup.weatherType} />
                        )}

                        {setup.visibility && (
                            <InfoCard label="Visibility" value={setup.visibility} />
                        )}

                        {setup.trackCondition && (
                            <InfoCard
                                label="Track Condition"
                                value={setup.trackCondition}
                            />
                        )}

                        {setup.temperatureF !== null && setup.temperatureF !== undefined && (
                            <InfoCard
                                label="Track Temp"
                                value={`${setup.temperatureF}°F`}
                            />
                        )}

                        {setup.lapTimeMs !== null && setup.lapTimeMs !== undefined && (
                            <InfoCard
                                label="Lap Time"
                                value={`${setup.lapTimeMs} ms`}
                            />
                        )}

                        {setup.fuelLoad !== null && setup.fuelLoad !== undefined && (
                            <InfoCard
                                label="Fuel Load"
                                value={`${setup.fuelLoad}`}
                            />
                        )}

                        {setup.tireCompound && (
                            <InfoCard
                                label="Tire Compound"
                                value={setup.tireCompound}
                            />
                        )}
                    </div>

                    {(setup.tags?.length ?? 0) > 0 && (
                        <div className="mt-8 flex flex-wrap gap-2">
                            {setup.tags?.map((item) => (
                                <span
                                    key={item.tag.id}
                                    className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400"
                                >
                                    {item.tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <SetupActions
                        setupId={setup.id}
                        initialUpvoteCount={setup.upvoteCount ?? 0}
                        initialDownloadCount={setup.downloadCount ?? 0}
                        initialHasUpvoted={setup.hasUpvoted ?? false}
                        isOwner={setup.isOwner ?? false}
                    />
                </section>
            </div>
        </main>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                {label}
            </p>
            <p className="mt-2 font-semibold text-white">{value}</p>
        </div>
    );
}