import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 'user-uuid-123' },
    update: {},
    create: {
      id: 'user-uuid-123',
      name: 'Gerson Architect',
      email: 'gerson.architect@example.com',
      phone: '+5491123456789',
    },
  });
  console.log(`✅ Test user successfully seeded:`, user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
