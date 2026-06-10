"use client";

import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { updateProfileImage } from "@/lib/api";

type ProfileAvatarProps = {
    username: string;
    imageUrl: string | null;
    isOwnProfile?: boolean;
    size?: "sm" | "md" | "lg";
};

export default function ProfileAvatar({
    username,
    imageUrl,
    isOwnProfile = false,
    size = "lg",
}: ProfileAvatarProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const { getToken } = useAuth();

    const sizes = {
        sm: "h-10 w-10 text-sm",
        md: "h-16 w-16 text-xl",
        lg: "h-24 w-24 text-3xl",
    };

    const pencilSizes = {
        sm: "h-6 w-6",
        md: "h-7 w-7",
        lg: "h-8 w-8",
    };

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            console.error("File must be an image");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            console.error("Image must be under 5MB");
            return;
        }

        const formData = new FormData();
        formData.append("profileImage", file);
        // console.log("Uploading file:", file.name, file.type, file.size);

        try {
            setIsUploading(true);

            const token = await getToken();

            if (!token) {
                throw new Error("Missing auth token");
            }

            await updateProfileImage(formData, token);

            router.refresh();
        } catch (err) {
            console.error("Profile image upload failed:", err);
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    }

    return (
        <div className="relative">
            <div
                className={`flex items-center justify-center overflow-hidden rounded-full bg-zinc-800 font-black uppercase ${sizes[size]} border-white border-1`}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={username}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    username[0]
                )}
            </div>

            {isOwnProfile && (
                <>
                    <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => inputRef.current?.click()}
                        className={`absolute bottom-0 right-0 flex items-center justify-center rounded-full border border-white/10 bg-red-600 text-white shadow-lg transition hover:bg-red-500 disabled:opacity-50 hover:cursor-pointer ${pencilSizes[size]}`}
                    >
                        <Pencil size={14} />
                    </button>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </>
            )}
        </div>
    );
}