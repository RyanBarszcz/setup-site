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