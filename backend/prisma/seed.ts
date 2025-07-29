import { prisma } from "../src/lib/prisma";

async function main() {
  const classes = [
    { name: "Yoga", description: "Mind-body harmony through asanas." },
    { name: "Spin", description: "High-energy cycling for cardio endurance." },
    {
      name: "Boot Camp",
      description: "Intense interval training for full-body strength.",
    },
    { name: "Barre", description: "Ballet-inspired sculpting and toning." },
    {
      name: "Pilates",
      description: "Core-focused conditioning and flexibility.",
    },
    {
      name: "Orangetheory",
      description: "Heart-rate monitored workouts for optimal burn.",
    },
    {
      name: "CrossFit",
      description: "Functional movements at high intensity.",
    },
    { name: "Hybrid", description: "Blended classes for versatile fitness." },
  ];

  for (const cls of classes) {
    const createdClass = await prisma.class.upsert({
      where: { name: cls.name },
      update: {},
      create: cls,
    });

    const sessions = ["morning", "afternoon", "evening"];
    for (const timeSlot of sessions) {
      await prisma.session.upsert({
        where: { classId_timeSlot: { classId: createdClass.id, timeSlot } },
        update: {},
        create: {
          classId: createdClass.id,
          timeSlot,
          capacity: 20, // Exemplary quota; adjust as thy wisdom dictates
          bookings: 0,
        },
      });
    }
  }

  console.log("Seeding complete: Classes and sessions instantiated.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
