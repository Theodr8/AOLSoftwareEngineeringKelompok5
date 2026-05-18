import { PrismaClient, User, Tag, JobStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedJobs(prisma: PrismaClient, users: User[], tags: Tag[], count: number) {
    console.log(`💼 Generating ${count} jobs...`);

    const tagNames = tags.map(t => t.name);

    const jobsData = Array.from({ length: count }).map(() => {
        const isRemote = faker.datatype.boolean();
        return {
            posterId: faker.helpers.arrayElement(users).id,
            title: faker.person.jobTitle(),
            company: faker.company.name(),
            description: faker.lorem.paragraphs(3),
            location: isRemote ? null : faker.location.city(),
            isRemote: isRemote,
            salaryMin: faker.number.int({ min: 50000, max: 90000 }),
            salaryMax: faker.number.int({ min: 100000, max: 180000 }),
            status: faker.helpers.enumValue(JobStatus),
            skillNames: faker.helpers.arrayElements(tagNames, { min: 1, max: 4 }), // Direct array injection
            createdAt: faker.date.recent({ days: 30 }),
        };
    });

    await prisma.job.createMany({ data: jobsData });
}