/// <reference types="node" />

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type GameSeed = {
  name: string;
  slug: string;
  imageUrl: string;
};

type TrackSeed = {
  name: string;
  slug: string;
  country: string;
  lengthKm: number;
  imageUrl?: string | null;
};

type CarSeed = {
  name: string;
  slug?: string;
  manufacturer?: string | null;
  class?: string | null;
  imageUrl?: string | null;
};

const games: GameSeed[] = [
  {
    name: "Assetto Corsa Competizione",
    slug: "assetto-corsa-competizione",
    imageUrl: "/games/acc.jpg",
  },
  {
    name: "iRacing",
    slug: "iracing",
    imageUrl: "/games/iracing.jpg",
  },
  {
    name: "Assetto Corsa",
    slug: "assetto-corsa",
    imageUrl: "/games/ac.png",
  },
  {
    name: "rFactor 2",
    slug: "rfactor-2",
    imageUrl: "/games/rf2.jpg",
  },
  {
    name: "Le Mans Ultimate",
    slug: "le-mans-ultimate",
    imageUrl: "/games/lmu.jpg",
  },
  {
    name: "Automobilista 2",
    slug: "automobilista-2",
    imageUrl: "/games/ams2.jpg",
  },
  {
    name: "RaceRoom Racing Experience",
    slug: "raceroom-racing-experience",
    imageUrl: "/games/raceroom.jpg",
  },
];

const tracks: TrackSeed[] = [
  {
    name: "Circuit de Spa-Francorchamps",
    slug: "spa-francorchamps",
    country: "Belgium",
    lengthKm: 7.004,
    imageUrl: "/tracks/spa-francorchamps.jpg",
  },
  {
    name: "Autodromo Nazionale Monza",
    slug: "monza",
    country: "Italy",
    lengthKm: 5.793,
    imageUrl: "/tracks/monza.jpg",
  },
  {
    name: "Autodromo Internazionale Enzo e Dino Ferrari",
    slug: "imola",
    country: "Italy",
    lengthKm: 4.909,
    imageUrl: "/tracks/imola.jpg",
  },
  {
    name: "Silverstone Circuit",
    slug: "silverstone",
    country: "United Kingdom",
    lengthKm: 5.891,
    imageUrl: "/tracks/silverstone.jpg",
  },
  {
    name: "Brands Hatch",
    slug: "brands-hatch",
    country: "United Kingdom",
    lengthKm: 3.916,
    imageUrl: "/tracks/brands-hatch.jpg",
  },
  {
    name: "Donington Park",
    slug: "donington-park",
    country: "United Kingdom",
    lengthKm: 4.023,
    imageUrl: "/tracks/donington-park.jpg",
  },
  {
    name: "Oulton Park",
    slug: "oulton-park",
    country: "United Kingdom",
    lengthKm: 4.307,
    imageUrl: "/tracks/oulton-park.jpg",
  },
  {
    name: "Snetterton",
    slug: "snetterton",
    country: "United Kingdom",
    lengthKm: 4.779,
    imageUrl: "/tracks/snetterton.jpg",
  },
  {
    name: "Circuit Zolder",
    slug: "zolder",
    country: "Belgium",
    lengthKm: 4.011,
    imageUrl: "/tracks/zolder.jpg",
  },
  {
    name: "Misano World Circuit",
    slug: "misano",
    country: "Italy",
    lengthKm: 4.226,
    imageUrl: "/tracks/misano.jpg",
  },
  {
    name: "Circuit Paul Ricard",
    slug: "paul-ricard",
    country: "France",
    lengthKm: 5.842,
    imageUrl: "/tracks/paul-ricard.jpg",
  },
  {
    name: "Circuit de Barcelona-Catalunya",
    slug: "barcelona-catalunya",
    country: "Spain",
    lengthKm: 4.657,
    imageUrl: "/tracks/barcelona-catalunya.jpg",
  },
  {
    name: "Circuit Ricardo Tormo",
    slug: "valencia",
    country: "Spain",
    lengthKm: 4.005,
    imageUrl: "/tracks/valencia.jpg",
  },
  {
    name: "Hungaroring",
    slug: "hungaroring",
    country: "Hungary",
    lengthKm: 4.381,
    imageUrl: "/tracks/hungaroring.jpg",
  },
  {
    name: "Red Bull Ring",
    slug: "red-bull-ring",
    country: "Austria",
    lengthKm: 4.318,
    imageUrl: "/tracks/red-bull-ring.jpg",
  },
  {
    name: "Nürburgring GP",
    slug: "nurburgring-gp",
    country: "Germany",
    lengthKm: 5.148,
    imageUrl: "/tracks/nurburgring-gp.jpg",
  },
  {
    name: "Nürburgring Nordschleife",
    slug: "nurburgring-nordschleife",
    country: "Germany",
    lengthKm: 20.832,
    imageUrl: "/tracks/nurburgring-nordschleife.jpg",
  },
  {
    name: "Hockenheimring",
    slug: "hockenheimring",
    country: "Germany",
    lengthKm: 4.574,
    imageUrl: "/tracks/hockenheimring.jpg",
  },
  {
    name: "Sachsenring",
    slug: "sachsenring",
    country: "Germany",
    lengthKm: 3.671,
    imageUrl: "/tracks/sachsenring.jpg",
  },
  {
    name: "Mugello Circuit",
    slug: "mugello",
    country: "Italy",
    lengthKm: 5.245,
    imageUrl: "/tracks/mugello.jpg",
  },
  {
    name: "Watkins Glen International",
    slug: "watkins-glen",
    country: "United States",
    lengthKm: 5.552,
    imageUrl: "/tracks/watkins-glen.jpg",
  },
  {
    name: "Road America",
    slug: "road-america",
    country: "United States",
    lengthKm: 6.515,
    imageUrl: "/tracks/road-america.jpg",
  },
  {
    name: "Road Atlanta",
    slug: "road-atlanta",
    country: "United States",
    lengthKm: 4.088,
    imageUrl: "/tracks/road-atlanta.jpg",
  },
  {
    name: "Daytona International Speedway",
    slug: "daytona",
    country: "United States",
    lengthKm: 5.729,
    imageUrl: "/tracks/daytona.jpg",
  },
  {
    name: "Sebring International Raceway",
    slug: "sebring",
    country: "United States",
    lengthKm: 6.019,
    imageUrl: "/tracks/sebring.jpg",
  },
  {
    name: "Indianapolis Motor Speedway",
    slug: "indianapolis",
    country: "United States",
    lengthKm: 4.192,
    imageUrl: "/tracks/indianapolis.jpg",
  },
  {
    name: "Virginia International Raceway",
    slug: "vir",
    country: "United States",
    lengthKm: 5.262,
    imageUrl: "/tracks/vir.jpg",
  },
  {
    name: "WeatherTech Raceway Laguna Seca",
    slug: "laguna-seca",
    country: "United States",
    lengthKm: 3.602,
    imageUrl: "/tracks/laguna-seca.jpg",
  },
  {
    name: "Fuji Speedway",
    slug: "fuji-speedway",
    country: "Japan",
    lengthKm: 4.563,
    imageUrl: "/tracks/fuji-speedway.jpg",
  },
  {
    name: "Mount Panorama Circuit",
    slug: "mount-panorama",
    country: "Australia",
    lengthKm: 6.213,
    imageUrl: "/tracks/mount-panorama.jpg",
  },
];

const carsByGameSlug: Record<string, CarSeed[]> = {
  "assetto-corsa-competizione": [
    { name: "Ferrari 296 GT3", manufacturer: "Ferrari", class: "GT3" },
    { name: "Porsche 911 GT3 R (992)", manufacturer: "Porsche", class: "GT3" },
    { name: "BMW M4 GT3", manufacturer: "BMW", class: "GT3" },
    { name: "Mercedes-AMG GT3 Evo", manufacturer: "Mercedes-AMG", class: "GT3" },
    { name: "McLaren 720S GT3 Evo", manufacturer: "McLaren", class: "GT3" },
    { name: "Audi R8 LMS GT3 Evo II", manufacturer: "Audi", class: "GT3" },
    { name: "Lamborghini Huracán GT3 Evo2", manufacturer: "Lamborghini", class: "GT3" },
    { name: "Aston Martin Vantage AMR GT3", manufacturer: "Aston Martin", class: "GT3" },
    { name: "Ford Mustang GT3", manufacturer: "Ford", class: "GT3" },
    { name: "Chevrolet Corvette Z06 GT3.R", manufacturer: "Chevrolet", class: "GT3" },
    { name: "Honda NSX GT3 Evo22", manufacturer: "Honda", class: "GT3" },
    { name: "Nissan GT-R Nismo GT3", manufacturer: "Nissan", class: "GT3" },
  ],

  iracing: [
    { name: "Mazda MX-5 Cup", manufacturer: "Mazda", class: "Cup" },
    { name: "Toyota GR86", manufacturer: "Toyota", class: "Sports Car" },
    { name: "BMW M4 GT4", manufacturer: "BMW", class: "GT4" },
    { name: "Porsche 718 Cayman GT4 Clubsport MR", manufacturer: "Porsche", class: "GT4" },
    { name: "Ferrari 296 GT3", manufacturer: "Ferrari", class: "GT3" },
    { name: "Porsche 911 GT3 R (992)", manufacturer: "Porsche", class: "GT3" },
    { name: "BMW M4 GT3", manufacturer: "BMW", class: "GT3" },
    { name: "Mercedes-AMG GT3 2020", manufacturer: "Mercedes-AMG", class: "GT3" },
    { name: "McLaren 720S GT3 Evo", manufacturer: "McLaren", class: "GT3" },
    { name: "Super Formula SF23 - Toyota", manufacturer: "Dallara", class: "Formula" },
    { name: "Super Formula SF23 - Honda", manufacturer: "Dallara", class: "Formula" },
    { name: "Dallara F3", manufacturer: "Dallara", class: "Formula" },
    { name: "Dallara P217", manufacturer: "Dallara", class: "LMP2" },
    { name: "Ferrari 499P", manufacturer: "Ferrari", class: "GTP/Hypercar" },
    { name: "Porsche 963", manufacturer: "Porsche", class: "GTP/Hypercar" },
    { name: "Cadillac V-Series.R GTP", manufacturer: "Cadillac", class: "GTP/Hypercar" },
    { name: "NASCAR Cup Series Chevrolet Camaro ZL1", manufacturer: "Chevrolet", class: "NASCAR" },
    { name: "NASCAR Cup Series Ford Mustang Dark Horse", manufacturer: "Ford", class: "NASCAR" },
    { name: "NASCAR Cup Series Toyota Camry XSE", manufacturer: "Toyota", class: "NASCAR" },
  ],

  "assetto-corsa": [
    { name: "Mazda MX-5 Cup", manufacturer: "Mazda", class: "Cup" },
    { name: "Toyota GR86", manufacturer: "Toyota", class: "Sports Car" },
    { name: "BMW M3 E30 Group A", manufacturer: "BMW", class: "Touring" },
    { name: "BMW M4 GT3", manufacturer: "BMW", class: "GT3" },
    { name: "Ferrari 296 GT3", manufacturer: "Ferrari", class: "GT3" },
    { name: "Porsche 911 GT3 R", manufacturer: "Porsche", class: "GT3" },
    { name: "Mercedes-AMG GT3", manufacturer: "Mercedes-AMG", class: "GT3" },
    { name: "McLaren 720S GT3", manufacturer: "McLaren", class: "GT3" },
    { name: "Toyota Supra GT4", manufacturer: "Toyota", class: "GT4" },
    { name: "Porsche 718 Cayman GT4", manufacturer: "Porsche", class: "GT4" },
    { name: "Formula Hybrid", manufacturer: "Race Sim Studio", class: "Formula" },
    { name: "Formula RSS", manufacturer: "Race Sim Studio", class: "Formula" },
  ],

  "rfactor-2": [
    { name: "BMW M4 GT3", manufacturer: "BMW", class: "GT3" },
    { name: "Porsche 911 GT3 R", manufacturer: "Porsche", class: "GT3" },
    { name: "Ferrari 488 GT3 Evo", manufacturer: "Ferrari", class: "GT3" },
    { name: "McLaren 720S GT3", manufacturer: "McLaren", class: "GT3" },
    { name: "Mercedes-AMG GT3", manufacturer: "Mercedes-AMG", class: "GT3" },
    { name: "Aston Martin Vantage GT3", manufacturer: "Aston Martin", class: "GT3" },
    { name: "Audi R8 LMS GT3", manufacturer: "Audi", class: "GT3" },
    { name: "Dallara IR-18", manufacturer: "Dallara", class: "IndyCar" },
    { name: "Oreca 07 LMP2", manufacturer: "Oreca", class: "LMP2" },
    { name: "Ligier JS P320", manufacturer: "Ligier", class: "LMP3" },
    { name: "BMW M2 CS Racing", manufacturer: "BMW", class: "Cup" },
    { name: "Tatuus FT-60", manufacturer: "Tatuus", class: "Formula" },
  ],

  "le-mans-ultimate": [
    { name: "Ferrari 499P", manufacturer: "Ferrari", class: "Hypercar" },
    { name: "Porsche 963", manufacturer: "Porsche", class: "Hypercar" },
    { name: "Cadillac V-Series.R", manufacturer: "Cadillac", class: "Hypercar" },
    { name: "Toyota GR010 Hybrid", manufacturer: "Toyota", class: "Hypercar" },
    { name: "BMW M Hybrid V8", manufacturer: "BMW", class: "Hypercar" },
    { name: "Peugeot 9X8", manufacturer: "Peugeot", class: "Hypercar" },
    { name: "Alpine A424", manufacturer: "Alpine", class: "Hypercar" },
    { name: "Ferrari 296 LMGT3", manufacturer: "Ferrari", class: "LMGT3" },
    { name: "Porsche 911 GT3 R LMGT3", manufacturer: "Porsche", class: "LMGT3" },
    { name: "BMW M4 LMGT3", manufacturer: "BMW", class: "LMGT3" },
    { name: "Ford Mustang LMGT3", manufacturer: "Ford", class: "LMGT3" },
    { name: "Chevrolet Corvette Z06 LMGT3.R", manufacturer: "Chevrolet", class: "LMGT3" },
    { name: "Lamborghini Huracán LMGT3 Evo2", manufacturer: "Lamborghini", class: "LMGT3" },
    { name: "McLaren 720S LMGT3 Evo", manufacturer: "McLaren", class: "LMGT3" },
    { name: "Aston Martin Vantage AMR LMGT3", manufacturer: "Aston Martin", class: "LMGT3" },
    { name: "Oreca 07 Gibson", manufacturer: "Oreca", class: "LMP2" },
  ],

  "automobilista-2": [
    { name: "Porsche 911 GT3 R", manufacturer: "Porsche", class: "GT3" },
    { name: "Ferrari 296 GT3", manufacturer: "Ferrari", class: "GT3" },
    { name: "BMW M4 GT3", manufacturer: "BMW", class: "GT3" },
    { name: "Mercedes-AMG GT3 Evo", manufacturer: "Mercedes-AMG", class: "GT3" },
    { name: "McLaren 720S GT3 Evo", manufacturer: "McLaren", class: "GT3" },
    { name: "Lamborghini Huracán GT3 Evo2", manufacturer: "Lamborghini", class: "GT3" },
    { name: "Porsche 718 Cayman GT4 Clubsport", manufacturer: "Porsche", class: "GT4" },
    { name: "McLaren 570S GT4", manufacturer: "McLaren", class: "GT4" },
    { name: "Formula Ultimate Gen2", manufacturer: "Formula Ultimate", class: "Formula" },
    { name: "Formula USA Gen 3", manufacturer: "Formula USA", class: "Formula" },
    { name: "Stock Car Pro Series Chevrolet Cruze", manufacturer: "Chevrolet", class: "Stock Car" },
    { name: "Stock Car Pro Series Toyota Corolla", manufacturer: "Toyota", class: "Stock Car" },
    { name: "P1 Ginetta G58", manufacturer: "Ginetta", class: "Prototype" },
    { name: "Metalmoro AJR", manufacturer: "Metalmoro", class: "Prototype" },
  ],

  "raceroom-racing-experience": [
    { name: "BMW M4 GT3", manufacturer: "BMW", class: "GT3" },
    { name: "Porsche 911 GT3 R", manufacturer: "Porsche", class: "GT3" },
    { name: "Mercedes-AMG GT3 Evo", manufacturer: "Mercedes-AMG", class: "GT3" },
    { name: "Audi R8 LMS GT3 Evo II", manufacturer: "Audi", class: "GT3" },
    { name: "Ferrari 296 GT3", manufacturer: "Ferrari", class: "GT3" },
    { name: "McLaren 720S GT3 Evo", manufacturer: "McLaren", class: "GT3" },
    { name: "Lamborghini Huracán GT3 Evo2", manufacturer: "Lamborghini", class: "GT3" },
    { name: "Ford Mustang GT3", manufacturer: "Ford", class: "GT3" },
    { name: "Chevrolet Corvette Z06 GT3.R", manufacturer: "Chevrolet", class: "GT3" },
    { name: "BMW M2 CS Racing", manufacturer: "BMW", class: "Cup" },
    { name: "Porsche 911 GT3 Cup", manufacturer: "Porsche", class: "Cup" },
    { name: "Tatuus F4", manufacturer: "Tatuus", class: "Formula" },
  ],
};

async function upsertGame(game: GameSeed) {
  return prisma.game.upsert({
    where: { slug: game.slug },
    update: {
      name: game.name,
      imageUrl: game.imageUrl,
      active: true,
    },
    create: {
      name: game.name,
      slug: game.slug,
      imageUrl: game.imageUrl,
      active: true,
    },
  });
}

async function upsertTrack(track: TrackSeed) {
  return prisma.track.upsert({
    where: { slug: track.slug },
    update: {
      name: track.name,
      country: track.country,
      lengthKm: track.lengthKm,
      imageUrl: track.imageUrl ?? null,
    },
    create: {
      name: track.name,
      slug: track.slug,
      country: track.country,
      lengthKm: track.lengthKm,
      imageUrl: track.imageUrl ?? null,
    },
  });
}

async function upsertCar(gameId: string, car: CarSeed) {
  const slug = car.slug ?? slugify(car.name);

  const existing = await prisma.car.findFirst({
    where: {
      gameId,
      slug,
    },
  });

  if (existing) {
    return prisma.car.update({
      where: { id: existing.id },
      data: {
        name: car.name,
        imageUrl: car.imageUrl ?? null,
        manufacturer: car.manufacturer ?? null,
        class: car.class ?? null,
      },
    });
  }

  return prisma.car.create({
    data: {
      gameId,
      name: car.name,
      slug,
      imageUrl: car.imageUrl ?? null,
      manufacturer: car.manufacturer ?? null,
      class: car.class ?? null,
    },
  });
}

async function ensureGameTrack(gameId: string, trackId: string) {
  const existing = await prisma.gameTrack.findFirst({
    where: {
      gameId,
      trackId,
      layoutName: "Default",
    },
  });

  if (existing) {
    return prisma.gameTrack.update({
      where: { id: existing.id },
      data: {
        active: true,
      },
    });
  }

  return prisma.gameTrack.create({
    data: {
      gameId,
      trackId,
      layoutName: "Default",
      active: true,
    },
  });
}

async function main() {
  console.log("🌱 Seeding games...");
  const gameRecords = new Map<string, Awaited<ReturnType<typeof upsertGame>>>();

  for (const game of games) {
    const gameRecord = await upsertGame(game);
    gameRecords.set(game.slug, gameRecord);
  }

  console.log("🌱 Seeding tracks...");
  const trackRecords = [];

  for (const track of tracks) {
    const trackRecord = await upsertTrack(track);
    trackRecords.push(trackRecord);
  }

  console.log("🌱 Linking games to tracks...");
  for (const game of games) {
    const gameRecord = gameRecords.get(game.slug);

    if (!gameRecord) continue;

    for (const trackRecord of trackRecords) {
      await ensureGameTrack(gameRecord.id, trackRecord.id);
    }
  }

  console.log("🌱 Seeding cars...");
  for (const [gameSlug, cars] of Object.entries(carsByGameSlug)) {
    const gameRecord = gameRecords.get(gameSlug);

    if (!gameRecord) {
      console.warn(`Skipping cars for unknown game slug: ${gameSlug}`);
      continue;
    }

    for (const car of cars) {
      await upsertCar(gameRecord.id, car);
    }
  }

  console.log("✅ Seed complete");
  console.log(`Games: ${games.length}`);
  console.log(`Tracks: ${tracks.length}`);
  console.log(
    `Cars: ${Object.values(carsByGameSlug).reduce(
      (total, cars) => total + cars.length,
      0
    )}`
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
