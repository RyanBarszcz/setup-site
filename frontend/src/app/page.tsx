import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import GameGrid from "@/components/landing/GameGrid";
import FeatureStrip from "@/components/landing/FeatureStrip";

// TODO: Make setups clickable and have their own page or when you click on it make it a modal that is large

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background Image */}
      <div className="fixed inset-0">
        <img
          src="/hero4.jpg"
          alt="Background"
          className="h-full w-full object-cover"
        />

        {/* Dark overlay */}
        <div className="fixed inset-0 bg-black/10" />

        {/* Red cinematic glow */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255, 255, 255, 0.28),transparent_40%)]" />

        {/* Bottom fade */}
        <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#050505]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        <div className="mx-auto max-w-[1800px] px-12 pt-20 pb-20">
          <HeroSection />
          <GameGrid />
          <FeatureStrip />
        </div>
      </div>
    </main>
  );
}