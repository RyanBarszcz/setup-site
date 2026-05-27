import GameCard from "./GameCard";
import { apiFetch } from "@/lib/api";

type Game = {
    id: string;
    name: string;
};

export default async function GameGrid() {
    const response = await apiFetch<{ games: Game[] }>("/games");
    const games = response.games;
    // console.log("games", games);

    return (
        <div className="mt-8 grid grid-cols-5 gap-5">
            {games.slice(0, 5).map((game: Game, index: number) => (
                <GameCard
                    key={game.id}
                    id={game.id}
                    name={game.name}
                    index={index}
                />
            ))}
        </div>
    );
}