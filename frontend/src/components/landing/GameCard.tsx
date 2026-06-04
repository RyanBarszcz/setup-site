import Link from "next/link";

type GameCardProps = {
    id: string;
    name: string;
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
    index,
}: GameCardProps) {
    return (
        <Link
            href={`/setups?gameId=${id}`}
            className={`group relative h-64 overflow-hidden rounded-[1.8rem] border transition duration-300 hover:-translate-y-1 ${index === 0
                ? "border-red-500 shadow-[0_0_35px_rgba(220,38,38,0.28)]"
                : "border-white/10"
                }`}
        >
            <img
                src={gameImages[name]}
                alt={name}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute bottom-5 left-5 right-5">
                <h2 className="text-2xl font-black italic uppercase leading-tight text-white">
                    {name}
                </h2>

                <div className="mt-5 flex items-center justify-between">
                    <div>
                        <p className="text-xl font-black text-red-500">
                            {12540 - index * 2100}
                        </p>

                        <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                            Setups
                        </p>
                    </div>

                    {/* <div className="text-right">
                        <p className="text-xl font-black text-white">
                            {15231 - index * 2500}
                        </p>

                        <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                            Drivers
                        </p>
                    </div> */}
                </div>
            </div>
        </Link>
    );
}