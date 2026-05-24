"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        console.log("Login data:", formData);

        // Later:
        // await api.post("/auth/login", formData);
    }

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <div className="w-[95vw] max-w-[1800px] h-[90vh] rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl flex">

                {/* LEFT IMAGE SIDE */}
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
                    </div>
                </div>

                {/* RIGHT FORM SIDE */}
                <div className="w-1/2 bg-zinc-950 flex items-center">
                    <div className="w-full max-w-md mx-auto px-10">
                        <div>
                            <h2 className="text-3xl font-bold">
                                Sign in
                            </h2>

                            <p className="mt-2 text-zinc-400">
                                Continue to your garage.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-5"
                        >
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
                                    className="mt-2 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none focus:border-red-500"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-zinc-400 hover:text-red-400 transition"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-500 transition"
                            >
                                Sign in
                            </button>
                        </form>

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