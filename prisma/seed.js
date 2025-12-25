import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // 查找或创建一个用户
    let user = await prisma.user.findFirst({
      where: {
        username: 'testuser'
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: 'testuser',
          password: 'password123'
        }
      });
      console.log('创建新用户:', user);
    } else {
      console.log('使用现有用户:', user);
    }

    // 添加 5 条笔记
    const notesData = [
      {
        title: '学习 React 19 新特性',
        content: '今天学习了 useActionState、useOptimistic、useDeferredValue 等新 Hook...',
      },
      {
        title: '项目开发进度',
        content: '完成了用户认证模块，下一步需要优化数据库查询性能...',
      },
      {
        title: 'TypeScript 最佳实践',
        content: '总结了在项目中使用 TypeScript 的一些最佳实践和常见错误...',
      },
      {
        title: 'Prisma 数据库操作',
        content: '记录了如何使用 Prisma 进行常见的 CRUD 操作和关系查询...',
      },
      {
        title: '前端性能优化',
        content: '分析了项目中的性能瓶颈，包括代码分割、缓存策略等优化方案...',
      }
    ];

    for (const noteData of notesData) {
      const note = await prisma.note.create({
        data: {
          title: noteData.title,
          content: noteData.content,
          authorId: user.id
        }
      });
      console.log('✓ 添加笔记:', note.title);
    }

    console.log('\n✅ 成功添加 5 条笔记！');
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
