import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
    cleanDatabase,
    seedUsers,
    seedTagsAndSkills,
    seedPostsAndProjects,
    seedJobs,
    seedSocialGraph
} from './factories';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// 2. Attach it to the Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting database seed...\n');

    // 1. Wipe existing data safely
    await cleanDatabase(prisma);

    // 2. Base Entities (No Dependencies)
    const tags = await seedTagsAndSkills(prisma);
    const users = await seedUsers(prisma, 30); // Generate 30 users

    // 3. First-Degree Relations (Depend on Users & Tags)
    const { posts, projects } = await seedPostsAndProjects(prisma, users, tags, 50, 20);
    await seedJobs(prisma, users, tags, 15);

    // 4. Second-Degree Relations (Social Graph, Comments, Likes)
    await seedSocialGraph(prisma, users, posts, projects);

    console.log('\n✅ Seeding finished successfully.');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });