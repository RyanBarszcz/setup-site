import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    /*
     * Games
     */

    const iracing = await prisma.game.upsert({
        where: { slug: "iracing" },
        update: {},
        create: {
            name: "iRacing",
            slug: "iracing",
        },
    });

    const acc = await prisma.game.upsert({
        where: { slug: "assetto-corsa-competizione" },
        update: {},
        create: {
            name: "Assetto Corsa Competizione",
            slug: "assetto-corsa-competizione",
        },
    });

    const ac = await prisma.game.upsert({
        where: { slug: "assetto-corsa" },
        update: {},
        create: {
            name: "Assetto Corsa",
            slug: "assetto-corsa",
        },
    });

    const rf2 = await prisma.game.upsert({
        where: { slug: "rfactor-2" },
        update: {},
        create: {
            name: "rFactor 2",
            slug: "rfactor-2",
        },
    });

    const lmu = await prisma.game.upsert({
        where: { slug: "le-mans-ultimate" },
        update: {},
        create: {
            name: "Le Mans Ultimate",
            slug: "le-mans-ultimate",
        },
    });

    const ams2 = await prisma.game.upsert({
        where: { slug: "automobilista-2" },
        update: {},
        create: {
            name: "Automobilista 2",
            slug: "automobilista-2",
        },
    });

    /*
     * Tracks
     */

    const spa = await prisma.track.upsert({
        where: { slug: "spa-francorchamps" },
        update: {},
        create: {
            name: "Spa-Francorchamps",
            slug: "spa-francorchamps",
            country: "Belgium",
            lengthKm: 7.004,
        },
    });

    const monza = await prisma.track.upsert({
        where: { slug: "monza" },
        update: {},
        create: {
            name: "Monza",
            slug: "monza",
            country: "Italy",
            lengthKm: 5.793,
        },
    });

    const watkins = await prisma.track.upsert({
        where: { slug: "watkins-glen" },
        update: {},
        create: {
            name: "Watkins Glen",
            slug: "watkins-glen",
            country: "United States",
            lengthKm: 5.43,
        },
    });

    /*
     * GameTrack Relationships
     */

    await prisma.gameTrack.upsert({
        where: {
            gameId_trackId_layoutName: {
                gameId: iracing.id,
                trackId: watkins.id,
                layoutName: "Boot",
            },
        },
        update: {},
        create: {
            gameId: iracing.id,
            trackId: watkins.id,
            layoutName: "Boot",
        },
    });

    await prisma.gameTrack.upsert({
        where: {
            gameId_trackId_layoutName: {
                gameId: acc.id,
                trackId: spa.id,
                layoutName: "Default",
            },
        },
        update: {},
        create: {
            gameId: acc.id,
            trackId: spa.id,
            layoutName: "Default",
        },
    });

    /*
     * Cars
     */

    await prisma.car.upsert({
        where: {
            gameId_slug: {
                gameId: acc.id,
                slug: "ferrari-296-gt3",
            },
        },
        update: {},
        create: {
            gameId: acc.id,
            name: "Ferrari 296 GT3",
            slug: "ferrari-296-gt3",
            manufacturer: "Ferrari",
            class: "GT3",
            drivetrain: "RWD",
        },
    });

    await prisma.car.upsert({
        where: {
            gameId_slug: {
                gameId: acc.id,
                slug: "porsche-911-gt3-r",
            },
        },
        update: {},
        create: {
            gameId: acc.id,
            name: "Porsche 911 GT3 R",
            slug: "porsche-911-gt3-r",
            manufacturer: "Porsche",
            class: "GT3",
            drivetrain: "RWD",
        },
    });

    await prisma.car.upsert({
        where: {
            gameId_slug: {
                gameId: iracing.id,
                slug: "mazda-mx5-cup",
            },
        },
        update: {},
        create: {
            gameId: iracing.id,
            name: "Mazda MX-5 Cup",
            slug: "mazda-mx5-cup",
            manufacturer: "Mazda",
            class: "Cup",
            drivetrain: "RWD",
        },
    });

    /*
     * Tags
     */

    const tags = [
        {
            name: "Stable",
            slug: "stable",
            category: "handling",
        },
        {
            name: "Aggressive",
            slug: "aggressive",
            category: "handling",
        },
        {
            name: "Top Speed",
            slug: "top-speed",
            category: "strategy",
        },
        {
            name: "Tire Saving",
            slug: "tire-saving",
            category: "strategy",
        },
        {
            name: "Beginner Friendly",
            slug: "beginner-friendly",
            category: "difficulty",
        },
        {
            name: "Qualifying",
            slug: "qualifying",
            category: "session",
        },
        {
            name: "Race",
            slug: "race",
            category: "session",
        },
    ];

    for (const tag of tags) {
        await prisma.tag.upsert({
            where: {
                slug: tag.slug,
            },
            update: {},
            create: tag,
        });
    }

    const demoUser = await prisma.user.upsert({
    where: {
        clerkId: "demo_clerk_user_1",
    },
    update: {},
    create: {
        clerkId: "demo_clerk_user_1",
        username: "apexhunter",
        email: "apexhunter@example.com",
        bio: "GT3 setup builder focused on stable race setups.",
    },
});

const stableTag = await prisma.tag.findUniqueOrThrow({
    where: { slug: "stable" },
});

const raceTag = await prisma.tag.findUniqueOrThrow({
    where: { slug: "race" },
});

const topSpeedTag = await prisma.tag.findUniqueOrThrow({
    where: { slug: "top-speed" },
});

const tireSavingTag = await prisma.tag.findUniqueOrThrow({
    where: { slug: "tire-saving" },
});

const ferrari296 = await prisma.car.findFirstOrThrow({
    where: {
        slug: "ferrari-296-gt3",
        gameId: acc.id,
    },
});

const porsche911 = await prisma.car.findFirstOrThrow({
    where: {
        slug: "porsche-911-gt3-r",
        gameId: acc.id,
    },
});

const mazdaMx5 = await prisma.car.findFirstOrThrow({
    where: {
        slug: "mazda-mx5-cup",
        gameId: iracing.id,
    },
});

const spaFerrariSetup = await prisma.setup.upsert({
    where: {
        id: "demo-spa-ferrari-stable-race",
    },
    update: {},
    create: {
        id: "demo-spa-ferrari-stable-race",
        userId: demoUser.id,
        gameId: acc.id,
        trackId: spa.id,
        carId: ferrari296.id,
        title: "Ferrari 296 GT3 Stable Race Setup",
        description:
            "Stable race setup for Spa focused on consistency, tire saving, and clean exits.",
        fileUrl: "https://example.com/setups/ferrari-296-spa-race.json",
        fileKey: "demo/setups/ferrari_296_spa_race.json",
        fileName: "ferrari_296_spa_race.json",
        fileSize: 4200,
        fileType: "application/json",
        lapTimeMs: 138450,
        setupType: "RACE",
        weatherType: "DRY",
        trackCondition: "Optimum",
        temperatureF: 72,
        fuelLoad: 60,
        tireCompound: "Dry",
        downloadCount: 18,
        upvoteCount: 7,
    },
});

const monzaPorscheSetup = await prisma.setup.upsert({
    where: {
        id: "demo-monza-porsche-top-speed",
    },
    update: {},
    create: {
        id: "demo-monza-porsche-top-speed",
        userId: demoUser.id,
        gameId: acc.id,
        trackId: monza.id,
        carId: porsche911.id,
        title: "Porsche 911 GT3 R Monza Top Speed Setup",
        description:
            "Low-drag Monza setup built around straight-line speed and stable braking.",
        fileUrl: "https://example.com/setups/porsche-911-monza-speed.json",
        fileKey: "demo/setups/porsche_911_monza_speed.json",
        fileName: "porsche_911_monza_speed.json",
        fileSize: 3900,
        fileType: "application/json",
        lapTimeMs: 107900,
        setupType: "QUALIFYING",
        weatherType: "DRY",
        trackCondition: "Fast",
        temperatureF: 78,
        fuelLoad: 15,
        tireCompound: "Dry",
        downloadCount: 31,
        upvoteCount: 13,
    },
});

const watkinsMazdaSetup = await prisma.setup.upsert({
    where: {
        id: "demo-watkins-mazda-beginner",
    },
    update: {},
    create: {
        id: "demo-watkins-mazda-beginner",
        userId: demoUser.id,
        gameId: iracing.id,
        trackId: watkins.id,
        carId: mazdaMx5.id,
        title: "Mazda MX-5 Watkins Glen Beginner Race Setup",
        description:
            "Beginner-friendly iRacing setup with predictable rotation and safe curb behavior.",
        fileUrl: "https://example.com/setups/mx5-watkins-beginner.sto",
        fileKey: "demo/setups/mx5_watkins_beginner.sto",
        fileName: "mx5_watkins_beginner.sto",
        fileSize: 2800,
        fileType: "application/octet-stream",
        lapTimeMs: 134200,
        setupType: "RACE",
        weatherType: "UNKNOWN",
        trackCondition: "Moderate",
        temperatureF: 70,
        fuelLoad: 35,
        tireCompound: "Default",
        downloadCount: 9,
        upvoteCount: 4,
    },
});

await prisma.setupTag.createMany({
    data: [
        { setupId: spaFerrariSetup.id, tagId: stableTag.id },
        { setupId: spaFerrariSetup.id, tagId: raceTag.id },
        { setupId: spaFerrariSetup.id, tagId: tireSavingTag.id },

        { setupId: monzaPorscheSetup.id, tagId: topSpeedTag.id },

        { setupId: watkinsMazdaSetup.id, tagId: stableTag.id },
        { setupId: watkinsMazdaSetup.id, tagId: raceTag.id },
    ],
    skipDuplicates: true,
});

    console.log("Database seeded successfully.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });