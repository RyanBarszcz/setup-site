"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download, ThumbsUp } from "lucide-react";
import { toggleVote } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { getSetupDownloadUrl } from "@/lib/api";

// TODO: Work on button look for (Most Downloads) options

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

type Setup = {
    id: string;
    title: string;
    description?: string | null;
    downloadCount: number;
    upvoteCount: number;
    createdAt: string;
    hasUpvoted: boolean;
    isOwner: boolean,
    user: {
        username?: string | null;
    };
    tags: {
        tag: {
            id: string;
            name: string;
        };
    }[];
};

export default function SetupResultsClient({ setups }: { setups: Setup[] }) {
    const { getToken, isSignedIn } = useAuth();
    const [setupList, setSetupList] = useState(setups);
    const [search, setSearch] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sort, setSort] = useState("Most Downloads");

    async function handleVote(setupId: string) {
        const setup = setupList.find((item) => item.id === setupId);

        if (!setup || setup.isOwner) return;
        if (!isSignedIn) return;

        const token = await getToken();

        if (!token) return;

        const data = await toggleVote(setupId, token);

        setSetupList((current) =>
            current.map((setup) =>
                setup.id === setupId
                    ? {
                        ...setup,
                        hasUpvoted: data.hasUpvoted,
                        upvoteCount: data.upvoteCount,
                    }
                    : setup
            )
        );

        console.log("SetupList: ", setupList);
    }

    async function handleDownload(setupId: string) {
        try {
            const response = await getSetupDownloadUrl(setupId);

            setSetupList((current) =>
                current.map((setup) =>
                    setup.id === setupId
                        ? {
                            ...setup,
                            downloadCount: setup.downloadCount + 1,
                        }
                        : setup
                )
            );

            window.location.href = response.downloadUrl;
        } catch (error) {
            console.error(error);
        }
    }

    function toggleTag(tag: string) {
        setSelectedTags((current) =>
            current.includes(tag)
                ? current.filter((item) => item !== tag)
                : [...current, tag]
        );
    }

    const filteredSetups = useMemo(() => {
        let result = setupList.filter((setup) => {
            const searchValue = search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                setup.title.toLowerCase().includes(searchValue) ||
                setup.description?.toLowerCase().includes(searchValue) ||
                setup.tags.some((item) =>
                    item.tag.name.toLowerCase().includes(searchValue)
                );

            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.every((tag) =>
                    setup.tags.some((item) => item.tag.name === tag)
                );

            return matchesSearch && matchesTags;
        });

        result = [...result].sort((a, b) => {
            if (sort === "Highest Rated") {
                return b.upvoteCount - a.upvoteCount;
            }
            if (sort === "Newest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sort === "Oldest") {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }

            return b.downloadCount - a.downloadCount;
        });

        return result;
    }, [setupList, search, selectedTags, sort]);

    return (
        <>
            <div className="mt-8 flex gap-4">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search setups by name or tag..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-white/40 focus:border-white/20 focus:bg-white/10 backdrop-blur-md"
                />

                <div className="relative">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="appearance-none rounded-2xl border border-white/10 bg-zinc-950 px-5 pr-12 py-4 text-white outline-none transition hover:border-red-500/30 focus:border-red-500/50 backdrop-blur-md hover:cursor-pointer"
                    >
                        <option>Most Downloads</option>
                        <option>Most Upvoted</option>
                        <option>Newest</option>
                        <option>Oldest</option>
                    </select>

                    <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                    />
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                {tags.map((tag) => {
                    const active = selectedTags.includes(tag);

                    return (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`rounded-full border px-4 py-2 text-sm backdrop-blur-md transition ${active
                                ? "border-red-500/70 bg-red-500/20 text-white"
                                : "border-white/10 bg-white/5 text-white/70 hover:border-red-500/50 hover:bg-red-500/10 hover:text-white"
                                }`}
                        >
                            {tag}
                        </button>
                    );
                })}
            </div>

            <section className="mt-10 space-y-5">
                {filteredSetups.map((setup) => (
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

                                    {setup.isOwner ? (
                                        <div className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                                            <span>Your Setup</span>
                                            <ThumbsUp size={14} />
                                            <span className="opacity-80">{setup.upvoteCount}</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleVote(setup.id)}
                                            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${setup.hasUpvoted
                                                ? "border-green-500/50 bg-green-500/10 text-green-400"
                                                : "border-white/10 bg-white/5 text-white/70 hover:border-green-500/50 hover:text-green-400"
                                                }`}
                                        >
                                            <ThumbsUp
                                                size={14}
                                                fill={setup.hasUpvoted ? "currentColor" : "none"}
                                            />

                                            <span>{setup.upvoteCount}</span>
                                        </button>
                                    )}
                                </div>

                                <p className="mt-2 max-w-3xl text-sm text-white/55">
                                    {setup.description || "No description provided."}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {setup.tags.slice(0, 3).map((item) => (
                                        <button
                                            key={item.tag.id}
                                            onClick={() => toggleTag(item.tag.name)}
                                            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 transition hover:bg-red-500/20 hover:text-white"
                                        >
                                            {item.tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-10">
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">
                                            {setup.downloadCount.toLocaleString()}
                                        </p>

                                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                            Downloads
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleDownload(setup.id)}
                                        className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 hover:cursor-pointer">
                                        <div className="flex flex-col items-center">
                                            <p>Download</p>
                                            <p>Setup</p>
                                            <Download size={24} />
                                        </div>

                                    </button>
                                    <p className="mt-3 text-sm text-white/40">
                                        by {setup.user.username || "Unknown"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}

                {filteredSetups.length === 0 && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/60 backdrop-blur-md">
                        No setups matched your search.
                    </div>
                )}
            </section>
        </>
    );
}