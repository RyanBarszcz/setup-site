"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs/legacy";

export default function LoginPage() {
    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!isLoaded) return;

        try {
            setLoading(true);
            setError("");

            const result = await signIn.create({
                identifier: formData.email,
                password: formData.password,
            });

            if (result.status === "complete") {
                await setActive({
                    session: result.createdSessionId,
                });

                router.push("/");
            }
        } catch (err) {
            console.error(err);
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <div className="w-[95vw] max-w-[1800px] h-[90vh] rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl flex">
                <div className="relative w-1/2">
                    <img
                        src="/backgrounds/login.jpg"
                        alt="Sim racing"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-transparent" />

                    <div className="relative z-10 flex h-full flex-col justify-end p-10">
                        <h1 className="text-5xl font-bold leading-tight">
                            Welcome back.
                        </h1>

                        <p className="mt-4 max-w-md text-zinc-300 text-lg">
                            Access your saved setups, uploads, and favorite sim
                            racing configurations.
                        </p>

                        <p className="mt-8 text-sm text-zinc-500">
                            © 2026 Pitlane
                        </p>
                    </div>
                </div>

                <div className="w-1/2 bg-zinc-950 flex items-center">
                    <div className="w-full max-w-md mx-auto px-10">
                        <div>
                            <h2 className="text-3xl font-bold">Sign in</h2>

                            <p className="mt-2 text-zinc-400">
                                Continue to your garage.
                            </p>
                        </div>

                        {error && (
                            <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label className="text-sm text-zinc-400">
                                    Email
                                </label>

                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="FHermann@rbracing.com"
                                    required
                                    className="mt-2 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-400">
                                    Password
                                </label>

                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="mt-2 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none focus:border-red-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-500 transition disabled:opacity-60"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </form>

                        <div className="flex justify-center mt-6">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-zinc-400 hover:text-red-400 transition"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div className="flex justify-center mt-6">
                            <p className="text-sm text-zinc-400">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/sign-up"
                                    className="text-red-400 hover:text-red-300"
                                >
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}