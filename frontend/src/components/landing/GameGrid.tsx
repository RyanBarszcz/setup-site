import { GameOption, getGames } from "@/lib/api";
import GameCard from "./GameCard";

export default async function GameGrid() {
    const response = await getGames();
    const games = response.games;

    return (
        <div className="mt-8 grid grid-cols-5 gap-5">
            {games.slice(0, 5).map((game: GameOption, index: number) => (
                <GameCard
                    key={game.id}
                    id={game.id}
                    name={game.name}
                    slug={game.slug}
                    imageUrl={game.imageUrl}
                    setupCount={game.setupCount}
                    index={index}
                />
            ))}
        </div>
    );
}