"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useSignUp } from "@clerk/nextjs/legacy";
import { syncAccount } from "@/lib/api";

// TODO: Add modal that says creating account

export default function SignUpPage() {
    const router = useRouter();
    const { getToken } = useAuth();
    const { signUp, setActive, isLoaded } = useSignUp();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [verificationCode, setVerificationCode] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!isLoaded) return;

        try {
            setLoading(true);
            setError("");

            await signUp.create({
                username: formData.username.trim(),
                emailAddress: formData.email,
                password: formData.password,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setPendingVerification(true);
        } catch (err) {
            console.error(err);
            setError("Could not create account.");
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            setLoading(true);
            setError("");

            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });

            if (result.status === "complete" && result.createdSessionId) {
                await setActive({
                    session: result.createdSessionId,
                });

                const token = await getToken();

                if (token) {
                    await syncAccount(token);
                }

                router.push("/");
                router.refresh();
                return;
            }

            setError(`Sign up incomplete: ${result.status}`);
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
                        src="/backgrounds/sign-up.jpg"
                        alt="Sim racing"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-transparent" />

                    <div className="relative z-10 flex h-full flex-col justify-end p-10">
                        <h1 className="text-5xl font-bold leading-tight">
                            Join the pit lane.
                        </h1>

                        <p className="mt-4 max-w-md text-zinc-300 text-lg">
                            Upload, save, and discover sim racing setups by game,
                            car, track, weather, and driving style.
                        </p>

                        <p className="mt-8 text-sm text-zinc-500">
                            © 2026 Pitlane
                        </p>
                    </div>
                </div>

                <div className="w-1/2 bg-zinc-950 flex items-center">
                    <div className="w-full max-w-md mx-auto px-10">
                        <h2 className="text-3xl font-bold">
                            {pendingVerification ? "Verify email" : "Create account"}
                        </h2>

                        <p className="mt-2 text-zinc-400">
                            {pendingVerification
                                ? "Enter the code sent to your email."
                                : "Start sharing and saving setups."}
                        </p>

                        {error && (
                            <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {error}
                            </p>
                        )}

                        {!pendingVerification ? (
                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                <div>
                                    <label className="text-sm text-zinc-400">
                                        Username
                                    </label>

                                    <input
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="franzhermann"
                                        required
                                        className="mt-2 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none focus:border-red-500"
                                    />
                                </div>

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

                                <div id="clerk-captcha" className="mt-2" />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-500 transition disabled:opacity-60"
                                >
                                    {loading ? "Creating account..." : "Create account"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerify} className="mt-8 space-y-5">
                                <div>
                                    <label className="text-sm text-zinc-400">
                                        Verification code
                                    </label>

                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) =>
                                            setVerificationCode(e.target.value)
                                        }
                                        placeholder="123456"
                                        required
                                        className="mt-2 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none focus:border-red-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-500 transition disabled:opacity-60"
                                >
                                    {loading ? "Verifying..." : "Verify email"}
                                </button>
                            </form>
                        )}

                        <div className="flex justify-center mt-6">
                            <p className="text-sm text-zinc-400">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-red-400 hover:text-red-300"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}