import { PrismaClient, User, Tag } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedTagsAndSkills(prisma: PrismaClient) {
    console.log('🏷️ Generating tags and skills...');

    const techStack = ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Prisma', 'Next.js', 'Go', 'Python', 'AWS', 'Docker'];

    await prisma.tag.createMany({
        data: techStack.map(name => ({ name })),
        skipDuplicates: true,
    });

    await prisma.skill.createMany({
        data: techStack.map(name => ({ name })),
        skipDuplicates: true,
    });

    return await prisma.tag.findMany();
}

export async function seedPostsAndProjects(prisma: PrismaClient, users: User[], tags: Tag[], postCount: number, projectCount: number) {
    console.log(`📝 Generating ${postCount} posts and ${projectCount} projects...`);

    // 1. Generate Posts
    const postsData = Array.from({ length: postCount }).map(() => ({
        authorId: faker.helpers.arrayElement(users).id,
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(4),
        likeCount: faker.number.int({ min: 0, max: 150 }),
        createdAt: faker.date.recent({ days: 60 }),
    }));

    await prisma.post.createMany({ data: postsData });
    const posts = await prisma.post.findMany();

    // 2. Generate Projects
    const projectsData = Array.from({ length: projectCount }).map(() => ({
        authorId: faker.helpers.arrayElement(users).id,
        title: faker.company.catchPhrase(),
        description: faker.lorem.paragraphs(2),
        repositoryUrl: faker.internet.url(),
        likeCount: faker.number.int({ min: 0, max: 300 }),
        createdAt: faker.date.recent({ days: 90 }),
    }));

    await prisma.project.createMany({ data: projectsData });
    const projects = await prisma.project.findMany();

    // 3. Attach Random Tags
    console.log('🔗 Attaching tags to content...');
    for (const post of posts) {
        const selectedTags = faker.helpers.arrayElements(tags, { min: 1, max: 3 });
        await prisma.postTag.createMany({
            data: selectedTags.map(tag => ({ postId: post.id, tagId: tag.id })),
            skipDuplicates: true,
        });
    }

    return { posts, projects };
}