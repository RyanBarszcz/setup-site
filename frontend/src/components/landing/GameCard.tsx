import Link from "next/link";

type GameCardProps = {
    id: string;
    name: string;
    index: number;
};

export default function GameCard({ id, name, index }: GameCardProps) {
    return (
        <Link
            href={`/setups?gameId=${id}`}
            className={`group h-72 rounded-2xl border bg-zinc-950/80 p-6 transition hover:-translate-y-1 hover:border-red-500/80 ${index === 0
                ? "border-red-500 shadow-[0_0_35px_rgba(220,38,38,0.25)]"
                : "border-white/10"
                }`}
        >
            <div className="flex h-full flex-col justify-between">
                <h2 className="text-2xl font-black uppercase leading-tight">
                    {name}
                </h2>

                <div>
                    <div className="h-24 rounded-xl bg-gradient-to-br from-zinc-800 to-black" />

                    <div className="mt-6 flex justify-between text-sm">
                        <span className="font-bold text-red-500">
                            {12_540 - index * 2_100} Setups
                        </span>
                        <span className="text-zinc-400">
                            {15_231 - index * 2_500} Members
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}