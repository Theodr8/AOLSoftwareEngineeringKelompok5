import { PrismaClient, User, Post, Project } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedSocialGraph(prisma: PrismaClient, users: User[], posts: Post[], projects: Project[]) {
    console.log('🤝 Building social graph and user engagements...');

    // 1. Follows
    const followData = [];
    for (let i = 0; i < 50; i++) {
        const follower = faker.helpers.arrayElement(users);
        const following = faker.helpers.arrayElement(users.filter(u => u.id !== follower.id));
        followData.push({ followerId: follower.id, followingId: following.id });
    }
    await prisma.follow.createMany({ data: followData, skipDuplicates: true });

    // 2. Post Comments
    const postComments = Array.from({ length: 100 }).map(() => ({
        authorId: faker.helpers.arrayElement(users).id,
        postId: faker.helpers.arrayElement(posts).id,
        body: faker.lorem.sentences(2),
        createdAt: faker.date.recent({ days: 30 }),
    }));
    await prisma.postComment.createMany({ data: postComments });

    // 3. Post Likes
    const postLikes = Array.from({ length: 150 }).map(() => ({
        userId: faker.helpers.arrayElement(users).id,
        postId: faker.helpers.arrayElement(posts).id,
    }));
    await prisma.postLike.createMany({ data: postLikes, skipDuplicates: true });
}