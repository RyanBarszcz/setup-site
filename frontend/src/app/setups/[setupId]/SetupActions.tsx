"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Pencil, ThumbsUp } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { getSetupDownloadUrl, toggleVote } from "@/lib/api";

type SetupActionsProps = {
    setupId: string;
    initialUpvoteCount: number;
    initialDownloadCount: number;
    initialHasUpvoted: boolean;
    isOwner: boolean;
};

export default function SetupActions({
    setupId,
    initialUpvoteCount,
    initialDownloadCount,
    initialHasUpvoted,
    isOwner,
}: SetupActionsProps) {
    const { getToken, isSignedIn } = useAuth();

    const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount);
    const [downloadCount, setDownloadCount] = useState(initialDownloadCount);
    const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);

    async function handleVote() {
        if (isOwner) return;

        if (!isSignedIn) {
            toast.error("Sign in to upvote setups.");
            return;
        }

        const token = await getToken();

        if (!token) {
            toast.error("Could not verify your session.");
            return;
        }

        try {
            const toastResult = await toast.promise(toggleVote(setupId, token), {
                loading: "Updating vote...",
                success: "Vote updated.",
                error: "Failed to update vote.",
            });

            const data = await toastResult.unwrap();

            setHasUpvoted(data.hasUpvoted);
            setUpvoteCount(data.upvoteCount);
        } catch {
            // toast handles error
        }
    }

    async function handleDownload() {
        try {
            const toastResult = await toast.promise(getSetupDownloadUrl(setupId), {
                loading: "Preparing download...",
                success: "Download ready.",
                error: "Failed to prepare download.",
            });

            const data = await toastResult.unwrap();

            setDownloadCount((current) => current + 1);
            window.location.href = data.downloadUrl;
        } catch {
            // toast handles error
        }
    }

    return (
        <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:cursor-pointer hover:bg-red-500"
            >
                <Download size={16} />
                <span>Download Setup</span>
                <span className="text-white/70">
                    {downloadCount.toLocaleString()}
                </span>
            </button>

            {isOwner ? (
                <>
                    <Link
                        href={`/setups/${setupId}/edit`}
                        className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-400 transition hover:border-blue-500/50 hover:bg-blue-500/20"
                    >
                        <Pencil size={16} />
                        <span>Edit Setup</span>
                    </Link>

                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70">
                        <ThumbsUp size={16} />
                        <span>{upvoteCount.toLocaleString()}</span>
                    </div>
                </>
            ) : (
                <button
                    onClick={handleVote}
                    className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition hover:cursor-pointer ${hasUpvoted
                        ? "border-green-500/50 bg-green-500/10 text-green-400"
                        : "border-white/10 text-white hover:border-green-500/50 hover:text-green-400"
                        }`}
                >
                    <ThumbsUp
                        size={16}
                        fill={hasUpvoted ? "currentColor" : "none"}
                    />
                    <span>{upvoteCount.toLocaleString()}</span>
                </button>
            )}
        </div>
    );
}