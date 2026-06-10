import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import ProfileSetupsClient from "./ProfileSetupsClient";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { getUserProfile } from "@/lib/api";

type ProfileUser = {
    id: string;
    username: string;
    imageUrl: string | null;
    createdAt: string;
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

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;
    const data = await getUserProfile(username);
    const clerkUser = await currentUser();

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

    const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const isOwnProfile =
        clerkUser?.username?.toLowerCase() === user.username.toLowerCase();

    // console.log("clerk username:", clerkUser?.username);
    // console.log("profile username:", user.username);
    // console.log("isOwnProfile:", isOwnProfile);

    return (
        <main
            className="min-h-screen bg-cover bg-center bg-fixed px-8 pt-28 text-white"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.78), rgba(0,0,0,0.95)), url('/backgrounds/profile-bg.jpg')",
            }}
        >
            <section className="mx-auto max-w-6xl">
                <div className="flex items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <ProfileAvatar
                                username={user.username}
                                imageUrl={user.imageUrl}
                                isOwnProfile={isOwnProfile}
                                size="lg"
                            />
                        </div>

                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                                Driver Profile
                            </p>

                            <h1 className="mt-2 text-4xl font-black">
                                @{user.username}
                            </h1>

                            <p className="mt-2 text-zinc-400">
                                Joined {joinedDate} • {setups.length} uploaded setup
                                {setups.length === 1 ? "" : "s"}
                            </p>
                        </div>
                    </div>
                </div>

                <ProfileSetupsClient setups={setups} />
            </section>
        </main>
    );
}