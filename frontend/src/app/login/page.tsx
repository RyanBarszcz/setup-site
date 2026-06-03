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
    const [needsSecondFactor, setNeedsSecondFactor] = useState(false);
    const [secondFactorCode, setSecondFactorCode] = useState("");

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

            console.log("Sign in result:", result);

            if (result.status === "complete" && result.createdSessionId) {
                await setActive({
                    session: result.createdSessionId,
                });

                router.push("/");
                router.refresh();
                return;
            }

            if (result.status == "needs_second_factor") {
                setNeedsSecondFactor(true);
                return;
            }

            setError(`Sign in incomplete: ${result.status}`);
        } catch (err) {
            console.error(err);
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSecondFactor(e: React.FormEvent) {
        e.preventDefault();

        if (!isLoaded) return;

        try {
            setLoading(true);
            setError("");

            const result = await signIn.attemptSecondFactor({
                strategy: "totp",
                code: secondFactorCode,
            });

            console.log("Second factor result:", result);

            if (result.status === "complete" && result.createdSessionId) {
                await setActive({ session: result.createdSessionId });
                router.push("/");
                router.refresh();
                return;
            }

            setError(`Second factor incomplete: ${result.status}`);
        } catch (err) {
            console.error(err);
            setError("Invalid verification code.");
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

                        {!needsSecondFactor ? (
                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                <div>
                                    <label className="text-sm text-zinc-400">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-red-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-zinc-400">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-red-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                                >
                                    {loading ? "Signing in..." : "Sign In"}
                                </button>
                            </form>
                        ) : (
                            <form
                                onSubmit={handleSecondFactor}
                                className="mt-8 space-y-5"
                            >
                                <div>
                                    <label className="text-sm text-zinc-400">
                                        Verification code
                                    </label>

                                    <input
                                        type="text"
                                        value={secondFactorCode}
                                        onChange={(e) =>
                                            setSecondFactorCode(e.target.value)
                                        }
                                        placeholder="123456"
                                        required
                                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-red-500"
                                    />
                                </div>

                                {error && (
                                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                                >
                                    {loading ? "Verifying..." : "Verify code"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setNeedsSecondFactor(false);
                                        setSecondFactorCode("");
                                        setError("");
                                    }}
                                    className="w-full text-sm text-zinc-400 hover:text-white"
                                >
                                    Back to login
                                </button>
                            </form>
                        )}

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
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}