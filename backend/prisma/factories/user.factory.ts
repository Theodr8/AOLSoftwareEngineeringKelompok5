import { PrismaClient, AccountStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedUsers(prisma: PrismaClient, count: number) {
    console.log(`👤 Generating ${count} users...`);

    const usersData = Array.from({ length: count }).map(() => ({
        email: faker.internet.email(),
        username: faker.internet.username() + faker.string.alphanumeric(5),
        passwordHash: faker.internet.password(), // Standard faker string is fine for testing
        displayName: faker.person.fullName(),
        bio: faker.person.bio(),
        avatarUrl: faker.image.avatar(),
        websiteUrl: faker.internet.url(),
        githubUrl: `https://github.com/${faker.internet.username()}`,
        location: faker.location.city() + ', ' + faker.location.country(),
        status: faker.helpers.enumValue(AccountStatus),
        createdAt: faker.date.past({ years: 1 }),
    }));

    // CreateMany doesn't return records in Postgres by default, so we fetch them back
    await prisma.user.createMany({ data: usersData, skipDuplicates: true });
    return await prisma.user.findMany();
}