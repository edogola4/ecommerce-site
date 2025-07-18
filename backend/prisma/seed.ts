import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'Electronics' },
      { name: 'Fashion' },
      { name: 'Books' }
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
