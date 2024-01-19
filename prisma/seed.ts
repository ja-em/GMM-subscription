import { Prisma, PrismaClient } from '@prisma/client';

(async function seed() {
  const prisma = new PrismaClient();
  try {
    const services: Array<Prisma.ServiceCreateManyInput> = new Array(10)
      .fill(null)
      .map((_, i) => ({ detail: `service detail ${i + 1}` }));
    await prisma.service.deleteMany();
    await prisma.service.createMany({ data: services });
    console.log('DB SEED');
  } catch (e) {
    console.error(e);
    prisma.$disconnect();
  } finally {
    prisma.$disconnect();
  }
})();
