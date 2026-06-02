import Link from "next/link";

type ProfileUser = {
    id: string;
    username: string;
    image: string | null;
};

type Setup = {
    id: string;
    title: string;
    description: string | null;
    game: {
        name: string;
    };
    car: {
        name: string;
    };
    track: {
        name: string;
    };
};

async function getProfile(username: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${username}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        return null;
    }

    return res.json();
}

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;
    const data = await getProfile(username);

    if (!data) {
        return (
            <main className="min-h-screen bg-black px-12 pt-36 text-white">
                <h1 className="text-3xl font-bold">Driver not found</h1>
                <Link href="/browse" className="mt-6 inline-block text-red-500">
                    Back to browse
                </Link>
            </main>
        );
    }

    const user: ProfileUser = data.user;
    const setups: Setup[] = data.setups;

    return (
        <main
            className="min-h-screen bg-cover bg-center bg-fixed px-8 pt-28 text-white"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.78), rgba(0,0,0,0.95)), url('/backgrounds/profile-bg.jpg')",
            }}
        >
            <section className="mx-auto max-w-6xl">
                <div className="flex items-center gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 text-3xl font-black uppercase">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.username}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            user.username[0]
                        )}
                    </div>

                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                            Driver Profile
                        </p>
                        <h1 className="mt-2 text-4xl font-black">
                            @{user.username}
                        </h1>
                        <p className="mt-2 text-zinc-400">
                            {setups.length} uploaded setup{setups.length === 1 ? "" : "s"}
                        </p>
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-2xl font-bold">Setups</h2>
                    {/* TODO: Later add search */}
                    {setups.length === 0 ? (
                        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-zinc-400">
                            This driver has not uploaded any setups yet.
                        </div>
                    ) : (
                        <div className="mt-6 grid grid-cols-3 gap-5">
                            {setups.map((setup) => (
                                <Link
                                    key={setup.id}
                                    href={`/setups/${setup.id}`}
                                    className="rounded-3xl border border-white/10 bg-zinc-950 p-6 transition hover:border-red-500/50 hover:bg-zinc-900"
                                >
                                    <h3 className="text-lg font-bold">{setup.title}</h3>

                                    <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                                        {setup.description || "No description provided."}
                                    </p>

                                    <div className="mt-5 space-y-1 text-sm text-zinc-500">
                                        <p>{setup.game.name}</p>
                                        <p>{setup.car.name}</p>
                                        <p>{setup.track.name}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}