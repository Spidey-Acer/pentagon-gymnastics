import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Create admin user
  const adminEmail = "admin@abcgym.com";
  const adminPassword = await bcrypt.hash("admin123", 10);
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      forename: "Admin",
      surname: "User", 
      address: "123 Gym Street",
      dateOfBirth: new Date("1990-01-01"),
      phoneNumber: "555-0123",
    },
  });

  console.log("Admin user created: admin@abcgym.com / admin123");

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
          bookingCount: 0,
        },
      });
    }
  }

  console.log("Seeding complete: Classes and sessions instantiated.");
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
