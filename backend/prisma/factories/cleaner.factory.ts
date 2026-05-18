import { PrismaClient } from '@prisma/client';

export async function cleanDatabase(prisma: PrismaClient) {
    console.log('🧹 Cleaning database...');

    // Delete in reverse order of relationships to respect "Restrict" rules
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();

    await prisma.postComment.deleteMany();
    await prisma.projectComment.deleteMany();
    await prisma.postLike.deleteMany();
    await prisma.projectLike.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.block.deleteMany();

    await prisma.postTag.deleteMany();
    await prisma.projectTag.deleteMany();
    await prisma.job.deleteMany();
    await prisma.post.deleteMany();
    await prisma.project.deleteMany();

    await prisma.userSkill.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
}