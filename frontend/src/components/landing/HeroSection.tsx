export default function HeroSection() {
    return (
        <section className="pt-12">
            <div className="max-w-xl">
                <h1 className="text-7xl font-black italic uppercase leading-[0.92] tracking-tight text-zinc-100">
                    Find. Share.
                    <br />
                    <span className="text-red-600">Be Faster.</span>
                </h1>

                <p className="mt-7 max-w-md text-base leading-7 text-zinc-300">
                    The ultimate community for sim racing setups. Browse, discover and
                    share the best setups for every track and car.
                </p>

                <div className="mt-14">
                    <p className="border-l-4 border-red-600 pl-4 text-lg font-bold uppercase text-zinc-100">
                        Choose your game
                    </p>
                    {/* 
                    <p className="mt-3 text-sm text-zinc-400">
                        Select a game to browse setups
                    </p> */}
                </div>
            </div>
        </section>
    );
}