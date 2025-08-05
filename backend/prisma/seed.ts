import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Create admin user
  const adminEmail = "admin@Pentagongym.com";
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

  console.log("Admin user created: admin@Pentagongym.com / admin123");

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

  // Create packages
  const packages = [
    {
      name: "Premium",
      description: "All fitness classes with priority access and premium facilities",
      price: 100.0,
      maxClasses: null, // Unlimited
      priority: 3,
    },
    {
      name: "Standard", 
      description: "Choose any 3 fitness classes from our selection",
      price: 70.0,
      maxClasses: 3,
      priority: 2,
    },
    {
      name: "Basic",
      description: "Choose any 2 fitness classes from our selection", 
      price: 50.0,
      maxClasses: 2,
      priority: 1,
    },
  ];

  // Create packages
  for (const packageData of packages) {
    await prisma.package.upsert({
      where: { name: packageData.name },
      update: {},
      create: packageData,
    });
  }

  // For Premium package, add all classes
  const premiumPackage = await prisma.package.findUnique({
    where: { name: "Premium" },
  });
  
  const allClasses = await prisma.class.findMany();
  
  if (premiumPackage) {
    for (const class_ of allClasses) {
      await prisma.packageClass.upsert({
        where: {
          packageId_classId: {
            packageId: premiumPackage.id,
            classId: class_.id,
          },
        },
        update: {},
        create: {
          packageId: premiumPackage.id,
          classId: class_.id,
        },
      });
    }
  }

  // Create gear items
  const gearItems = [
    {
      name: "Pentagon Gym Vest",
      description: "Custom-branded vest with Pentagon Gymnastics logo",
      price: 30.0,
    },
    {
      name: "Pentagon Gym Shorts", 
      description: "Comfortable shorts with Pentagon Gymnastics branding",
      price: 30.0,
    },
    {
      name: "Pentagon Gym Trousers",
      description: "Full-length training trousers with Pentagon Gymnastics logo",
      price: 30.0,
    },
  ];

  for (const gearData of gearItems) {
    const existingGear = await prisma.gearItem.findFirst({
      where: { name: gearData.name },
    });
    
    if (!existingGear) {
      await prisma.gearItem.create({
        data: gearData,
      });
    }
  }

  console.log("✅ Database seeded successfully!");
  console.log("📦 Created packages: Premium (£100), Standard (£70), Basic (£50)");
  console.log("👕 Created gear items: Vest, Shorts, Trousers (£30 each)");
  console.log("🏃‍♀️ Created 8 fitness classes with morning, afternoon, evening sessions");
  console.log("👨‍💼 Admin login: admin@Pentagongym.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
