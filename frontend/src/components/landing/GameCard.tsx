import Link from "next/link";

type GameCardProps = {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    setupCount: number;
    index: number;
};

const gameImages: Record<string, string> = {
    "Assetto Corsa Competizione": "/games/acc.jpg",
    "iRacing": "/games/iracing.jpg",
    "Assetto Corsa": "/games/ac.png",
    "rFactor 2": "/games/rf2.jpg",
    "Le Mans Ultimate": "/games/lmu.jpg",
};

export default function GameCard({
    id,
    name,
    slug,
    imageUrl,
    setupCount,
    index,
}: GameCardProps) {
    return (
        <Link
            href={`/browse/${slug}`}
            className={`group relative h-64 overflow-hidden rounded-[1.8rem] border transition duration-300 hover:-translate-y-1 ${index === 0
                ? "border-red-500 shadow-[0_0_35px_rgba(220,38,38,0.28)]"
                : "border-white/10"
                }`}
        >
            <img
                src={imageUrl || gameImages[name]}
                alt={name}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute inset-0 bg-black/25" />

            <h2 className="absolute left-5 top-5 right-5 text-2xl font-black italic uppercase leading-tight text-white">
                {name}
            </h2>

            <div className="absolute bottom-5 left-5">
                <p className="text-md font-semibold text-zinc-300">
                    <span className="text-red-500">
                        {setupCount.toLocaleString()}
                    </span> {" "} Setups
                </p>
            </div>
        </Link>
    );
}