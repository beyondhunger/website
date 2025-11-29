const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Remove existing services so we can reseed without unique constraint errors.
  await prisma.service.deleteMany();

  await prisma.service.createMany({
    data: [
      {
        name: "Photography Package",
        slug: "photography-package",
        description: "High-quality photos for your brand.",
        price: 50,
        currency: "GBP",
      },
      {
        name: "Reel Creation Package",
        slug: "reel-creation-package",
        description: "Professional 30–60 second reels.",
        price: 40,
        currency: "GBP",
      },
      {
        name: "Full Content Package",
        slug: "full-content-package",
        description: "Photos + Reels + Behind the Scenes.",
        price: 70,
        currency: "GBP",
      }
    ],
  });

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
