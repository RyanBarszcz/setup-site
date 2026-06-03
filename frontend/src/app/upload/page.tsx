"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
    createSetup,
    getGames,
    getTracksByGame,
    getCarsByGame,
    GameOption,
    TrackOption,
    CarOption,
} from "@/lib/api";

const setupTags = [
    "Race",
    "Qualifying",
    "Dry",
    "Wet",
    "Stable",
    "Aggressive",
    "Beginner Friendly",
    "Low Fuel",
    "High Fuel",
    "Endurance",
];

// TODO: Work on requests
// TODO: Later add manufacturer then model

export default function UploadSetupPage() {
    const { getToken } = useAuth();

    const [formData, setFormData] = useState({
        gameId: "",
        trackId: "",
        carId: "",
        title: "",
        setupType: "",
        weatherType: "UNKNOWN",
        visibility: "PUBLIC",
        trackCondition: "",
        temperatureF: "",
        lapTimeMs: "",
        fuelLoad: "",
        tireCompound: "",
        description: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [games, setGames] = useState<GameOption[]>([]);
    const [tracks, setTracks] = useState<TrackOption[]>([]);
    const [cars, setCars] = useState<CarOption[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    const canShowRestOfForm = Boolean(
        formData.gameId && formData.trackId && formData.carId
    );

    useEffect(() => {
        async function loadGames() {
            const data = await getGames();
            setGames(data.games);
        }

        loadGames();
    }, []);

    useEffect(() => {
        async function loadGameOptions() {
            if (!formData.gameId) {
                setTracks([]);
                setCars([]);
                return;
            }

            setIsLoadingOptions(true);

            const [tracksData, carsData] = await Promise.all([
                getTracksByGame(formData.gameId),
                getCarsByGame(formData.gameId),
            ]);

            setTracks(tracksData.tracks);
            setCars(carsData.cars);
            setIsLoadingOptions(false);
        }

        loadGameOptions();
    }, [formData.gameId]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;

        if (name === "gameId") {
            setFormData({
                ...formData,
                gameId: value,
                trackId: "",
                carId: "",
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    function toggleTag(tag: string) {
        setSelectedTags((current) =>
            current.includes(tag)
                ? current.filter((item) => item !== tag)
                : [...current, tag]
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.gameId || !formData.trackId || !formData.carId) {
            alert("Please select a game, track, and car.");
            return;
        }

        if (!formData.title || !formData.setupType) {
            alert("Please add a setup name and setup type.");
            return;
        }

        if (!selectedFile) {
            alert("Please upload a setup file.");
            return;
        }

        const token = await getToken();

        if (!token) {
            alert("You must be signed in to upload a setup.");
            return;
        }

        try {
            setIsSubmitting(true);

            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });

            data.append("tags", JSON.stringify(selectedTags));
            data.append("setupFile", selectedFile);

            // Log for form data
            // for (const [key, value] of data.entries()) {
            //     console.log(key, value);
            // }

            await createSetup(data, token);

            // TODO: Make a success screen or toast
            alert("Setup uploaded successfully.");

            setFormData({
                gameId: "",
                trackId: "",
                carId: "",
                title: "",
                setupType: "",
                weatherType: "UNKNOWN",
                visibility: "PUBLIC",
                trackCondition: "",
                temperatureF: "",
                lapTimeMs: "",
                fuelLoad: "",
                tireCompound: "",
                description: "",
            });

            setSelectedTags([]);
            setSelectedFile(null);
        } catch (error) {
            console.error(error);
            alert("Failed to upload setup.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main
            className="min-h-screen bg-cover bg-center bg-fixed px-8 pt-28 text-white"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.78), rgba(0,0,0,0.95)), url('/backgrounds/upload-bg.jpg')",
            }}
        >
            <div className="mx-auto max-w-5xl pb-20">
                <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                    Creator Tools
                </p>

                <h1 className="mt-3 text-5xl font-bold tracking-tight">
                    Upload Setup
                </h1>

                <p className="mt-3 text-lg text-white/60">
                    Share a setup file with the community. Add the game, track,
                    car, tags, and driving notes.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-10 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-md"
                >
                    <p className="mb-6 text-sm text-white/40">
                        <span className="text-red-500">*</span> Required fields
                    </p>

                    <div className="grid grid-cols-3 gap-5">
                        <div>
                            <label className="text-sm text-white/50">
                                Game <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="gameId"
                                value={formData.gameId}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
                            >
                                <option value="">Select game</option>
                                {games.map((game) => (
                                    <option key={game.id} value={game.id}>
                                        {game.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-white/50">
                                Track <span className="text-red-500">*</span>
                            </label>

                            <select
                                name="trackId"
                                value={formData.trackId}
                                onChange={handleChange}
                                disabled={!formData.gameId || isLoadingOptions}
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">
                                    {!formData.gameId ? "Select game first" : "Select track"}
                                </option>

                                {tracks.map((track) => (
                                    <option key={track.id} value={track.id}>
                                        {track.name}
                                    </option>
                                ))}
                            </select>

                            <p className="mt-2 text-sm text-white/40">
                                Can&apos;t find your track?{" "}
                                <button
                                    type="button"
                                    className="text-red-400 transition hover:text-red-300"
                                >
                                    Request new track
                                </button>
                            </p>
                        </div>

                        <div>
                            <label className="text-sm text-white/50">
                                Car <span className="text-red-500">*</span>
                            </label>

                            <select
                                name="carId"
                                value={formData.carId}
                                onChange={handleChange}
                                disabled={!formData.gameId || isLoadingOptions}
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">
                                    {!formData.gameId ? "Select game first" : "Select car"}
                                </option>

                                {cars.map((car) => (
                                    <option key={car.id} value={car.id}>
                                        {car.name}
                                    </option>
                                ))}
                            </select>

                            <p className="mt-2 text-sm text-white/40">
                                Can&apos;t find your car?{" "}
                                <button
                                    type="button"
                                    className="text-red-400 transition hover:text-red-300"
                                >
                                    Request new car
                                </button>
                            </p>
                        </div>
                    </div>

                    {canShowRestOfForm ? (
                        <>
                            <div className="mt-6">
                                <label className="text-sm text-white/50">
                                    Setup Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Example: Safe Race Setup"
                                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                                />
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-5">
                                <div>
                                    <label className="text-sm text-white/50">
                                        Setup Type{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="setupType"
                                        value={formData.setupType}
                                        onChange={handleChange}
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                                    >
                                        <option value="">Select type</option>
                                        <option value="RACE">Race</option>
                                        <option value="QUALIFYING">Qualifying</option>
                                        <option value="HOTLAP">Hotlap</option>
                                        <option value="PRACTICE">Practice</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-white/50">
                                        Weather
                                    </label>
                                    <select
                                        name="weatherType"
                                        value={formData.weatherType}
                                        onChange={handleChange}
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                                    >
                                        <option value="UNKNOWN">Unknown</option>
                                        <option value="DRY">Dry</option>
                                        <option value="WET">Wet</option>
                                        <option value="MIXED">Mixed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-white/50">
                                        Visibility
                                    </label>
                                    <select
                                        name="visibility"
                                        value={formData.visibility}
                                        onChange={handleChange}
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                                    >
                                        <option value="PUBLIC">Public</option>
                                        <option value="PRIVATE">Private</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-5">
                                <div>
                                    <label className="text-sm text-white/50">
                                        Track Condition
                                    </label>
                                    <input
                                        name="trackCondition"
                                        value={formData.trackCondition}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Rubbered in, green, heavy rubber..."
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/50">
                                        Track Temp °F
                                    </label>
                                    <input
                                        name="temperatureF"
                                        value={formData.temperatureF}
                                        onChange={handleChange}
                                        type="number"
                                        placeholder="92"
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/50">
                                        Lap Time ms
                                    </label>
                                    <input
                                        name="lapTimeMs"
                                        value={formData.lapTimeMs}
                                        onChange={handleChange}
                                        type="number"
                                        placeholder="130542"
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-5">
                                <div>
                                    <label className="text-sm text-white/50">
                                        Fuel Load
                                    </label>
                                    <input
                                        name="fuelLoad"
                                        value={formData.fuelLoad}
                                        onChange={handleChange}
                                        type="number"
                                        step="0.1"
                                        placeholder="45.5"
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/50">
                                        Tire Compound
                                    </label>
                                    <input
                                        name="tireCompound"
                                        value={formData.tireCompound}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Soft, Medium, Dry, Wet..."
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="text-sm text-white/50">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the setup, balance, fuel range, conditions, or driving style..."
                                    rows={4}
                                    className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                                />
                            </div>

                            <div className="mt-6">
                                <label className="text-sm text-white/50">
                                    Setup Tags
                                </label>

                                <div className="mt-3 flex flex-wrap gap-3">
                                    {setupTags.map((tag) => (
                                        <button
                                            type="button"
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`rounded-full border px-4 py-2 text-sm transition ${selectedTags.includes(tag)
                                                ? "border-red-500 bg-red-500/20 text-white"
                                                : "border-white/10 bg-white/5 text-white/70 hover:border-red-500/50 hover:bg-red-500/10 hover:text-white"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="text-sm text-white/50">
                                    Setup File{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <div className="mt-3 flex min-h-[180px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center transition hover:border-red-500/50 hover:bg-red-500/10">
                                    <p className="text-lg font-semibold">
                                        Drop your setup file here
                                    </p>
                                    <p className="mt-2 text-sm text-white/50">
                                        Or click to browse your computer
                                    </p>

                                    <input
                                        type="file"
                                        className="mt-6 text-sm"
                                        onChange={(e) =>
                                            setSelectedFile(
                                                e.target.files?.[0] || null
                                            )
                                        }
                                    />

                                    {selectedFile && (
                                        <p className="mt-4 text-sm text-red-300">
                                            Selected: {selectedFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "Uploading..." : "Publish Setup"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                            <p className="text-lg font-semibold text-white">
                                Select a game, track, and car to continue.
                            </p>
                            <p className="mt-2 text-sm text-white/50">
                                Once those are selected, the setup details and file upload will appear.
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </main>
    );
}