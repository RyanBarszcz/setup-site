const features = [
    {
        icon: "⚡",
        title: "Faster Lap Times",
        text: "Find high quality setups built by fast drivers.",
    },
    {
        icon: "👥",
        title: "Active Community",
        text: "Join sim racers sharing and improving setups.",
    },
    {
        icon: "⬆",
        title: "Share Your Setups",
        text: "Upload your setups and help others go faster.",
    },
    {
        icon: "🛡",
        title: "Trusted & Verified",
        text: "Community rated and verified by real drivers.",
    },
];

export default function FeatureStrip() {
    return (
        <div className="mt-6 grid grid-cols-4 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            {features.map((feature) => (
                <div
                    key={feature.title}
                    className="border-r border-white/10 px-8 last:border-r-0"
                >
                    <div className="text-3xl text-red-500">{feature.icon}</div>
                    <h3 className="mt-3 font-bold uppercase">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {feature.text}
                    </p>
                </div>
            ))}
        </div>
    );
}