"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
    getGames,
    getTracksByGame,
    getCarsByGame,
    getSetupForEdit,
    updateSetup,
    GameOption,
    TrackOption,
    CarOption,
} from "@/lib/api";

// TODO: Toast instead of alert

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

export default function EditSetupForm({ setupId }: { setupId: string }) {
    const { getToken } = useAuth();
    const router = useRouter();

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
    const [currentFileName, setCurrentFileName] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [games, setGames] = useState<GameOption[]>([]);
    const [tracks, setTracks] = useState<TrackOption[]>([]);
    const [cars, setCars] = useState<CarOption[]>([]);

    const canShowRestOfForm = Boolean(
        formData.gameId && formData.trackId && formData.carId
    );

    useEffect(() => {
        async function loadInitialData() {
            const token = await getToken();

            if (!token) {
                alert("You must be signed in.");
                router.push("/login");
                return;
            }

            try {
                const [gamesData, setupData] = await Promise.all([
                    getGames(),
                    getSetupForEdit(setupId, token),
                ]);

                const setup = setupData.setup;

                setGames(gamesData.games);

                setFormData({
                    gameId: setup.gameId || "",
                    trackId: setup.trackId || "",
                    carId: setup.carId || "",
                    title: setup.title || "",
                    setupType: setup.setupType || "",
                    weatherType: setup.weatherType || "UNKNOWN",
                    visibility: setup.visibility || "PUBLIC",
                    trackCondition: setup.trackCondition || "",
                    temperatureF: setup.temperatureF?.toString() || "",
                    lapTimeMs: setup.lapTimeMs?.toString() || "",
                    fuelLoad: setup.fuelLoad || "",
                    tireCompound: setup.tireCompound || "",
                    description: setup.description || "",
                });

                setSelectedTags(setup.tags || []);
                setCurrentFileName(setup.fileName || "");
            } catch (error) {
                console.error(error);
                alert("Failed to load setup.");
            } finally {
                setIsLoading(false);
            }
        }

        loadInitialData();
    }, [getToken, router, setupId]);

    useEffect(() => {
        async function loadGameOptions() {
            if (!formData.gameId) {
                setTracks([]);
                setCars([]);
                return;
            }

            const [tracksData, carsData] = await Promise.all([
                getTracksByGame(formData.gameId),
                getCarsByGame(formData.gameId),
            ]);

            setTracks(tracksData.tracks);
            setCars(carsData.cars);
        }

        loadGameOptions();
    }, [formData.gameId]);

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
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

        const token = await getToken();

        if (!token) {
            alert("You must be signed in.");
            return;
        }

        try {
            setIsSubmitting(true);

            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });

            data.append("tags", JSON.stringify(selectedTags));

            if (selectedFile) {
                data.append("setupFile", selectedFile);
            }

            await updateSetup(setupId, data, token);

            alert("Setup updated successfully.");
            router.push("/my-setups");
        } catch (error) {
            console.error(error);
            alert("Failed to update setup.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-black px-8 pt-28 text-white">
                Loading setup...
            </main>
        );
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
                    Edit Setup
                </h1>

                <p className="mt-3 text-lg text-white/60">
                    Update your setup details, tags, notes, or replace the setup file.
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
                                disabled={!formData.gameId}
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none disabled:opacity-50"
                            >
                                <option value="">Select track</option>
                                {tracks.map((track) => (
                                    <option key={track.id} value={track.id}>
                                        {track.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-white/50">
                                Car <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="carId"
                                value={formData.carId}
                                onChange={handleChange}
                                disabled={!formData.gameId}
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none disabled:opacity-50"
                            >
                                <option value="">Select car</option>
                                {cars.map((car) => (
                                    <option key={car.id} value={car.id}>
                                        {car.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {canShowRestOfForm && (
                        <>
                            <div className="mt-8 grid grid-cols-2 gap-5">
                                <div>
                                    <label className="text-sm text-white/50">
                                        Setup Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Spa race setup"
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/50">
                                        Setup Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="setupType"
                                        value={formData.setupType}
                                        onChange={handleChange}
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
                                    >
                                        <option value="">Select type</option>
                                        <option value="RACE">Race</option>
                                        <option value="QUALIFYING">Qualifying</option>
                                        <option value="HOTLAP">Hotlap</option>
                                        <option value="ENDURANCE">Endurance</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-3 gap-5">
                                <div>
                                    <label className="text-sm text-white/50">
                                        Weather
                                    </label>
                                    <select
                                        name="weatherType"
                                        value={formData.weatherType}
                                        onChange={handleChange}
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
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
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
                                    >
                                        <option value="PUBLIC">Public</option>
                                        <option value="PRIVATE">Private</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-white/50">
                                        Track Condition
                                    </label>
                                    <input
                                        name="trackCondition"
                                        value={formData.trackCondition}
                                        onChange={handleChange}
                                        placeholder="Green, Optimum, Fast..."
                                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-4 gap-5">
                                <input
                                    name="temperatureF"
                                    value={formData.temperatureF}
                                    onChange={handleChange}
                                    placeholder="Temp °F"
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                                />

                                <input
                                    name="lapTimeMs"
                                    value={formData.lapTimeMs}
                                    onChange={handleChange}
                                    placeholder="Lap time ms"
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                                />

                                <input
                                    name="fuelLoad"
                                    value={formData.fuelLoad}
                                    onChange={handleChange}
                                    placeholder="Fuel load"
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                                />

                                <input
                                    name="tireCompound"
                                    value={formData.tireCompound}
                                    onChange={handleChange}
                                    placeholder="Tire compound"
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                                />
                            </div>

                            <div className="mt-6">
                                <label className="text-sm text-white/50">
                                    Tags
                                </label>

                                <div className="mt-3 flex flex-wrap gap-3">
                                    {setupTags.map((tag) => {
                                        const active = selectedTags.includes(tag);

                                        return (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => toggleTag(tag)}
                                                className={`rounded-full border px-4 py-2 text-sm transition ${active
                                                    ? "border-red-500 bg-red-500/20 text-white"
                                                    : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                                                    }`}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })}
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
                                    rows={5}
                                    placeholder="Add setup notes..."
                                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                                />
                            </div>

                            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                                <label className="text-sm text-white/50">
                                    Replace Setup File
                                </label>

                                {currentFileName && !selectedFile && (
                                    <p className="mt-2 text-sm text-white/40">
                                        Current file: {currentFileName}
                                    </p>
                                )}

                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setSelectedFile(e.target.files?.[0] || null)
                                    }
                                    className="mt-4 block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-500"
                                />

                                {selectedFile && (
                                    <p className="mt-2 text-sm text-white/40">
                                        New file: {selectedFile.name}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-8 w-full rounded-2xl bg-red-600 py-4 font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
                            >
                                {isSubmitting ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </main>
    );
}