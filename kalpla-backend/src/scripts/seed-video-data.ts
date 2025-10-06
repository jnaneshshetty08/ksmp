import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedVideoData() {
  try {
    console.log('🌱 Starting video data seeding...');

    // Create a test program
    const program = await prisma.program.upsert({
      where: { id: 'kalpla-program-1' },
      update: {},
      create: {
        id: 'kalpla-program-1',
        name: 'Kalpla Startup Mentorship Program',
        description: 'A comprehensive 12-month program to transform your startup idea into reality',
        duration: 12, // 12 months
        price: 4999900, // ₹49,999 in paise
        isActive: true,
      },
    });

    console.log('✅ Program created:', program.name);

    // Create 12 modules (one for each month)
    const modules = [];
    const moduleTitles = [
      'Ideation & Validation',
      'Business Model Design',
      'Market Research',
      'Product Development',
      'Marketing Strategy',
      'Sales & Revenue',
      'Operations & Scaling',
      'Team Building',
      'Financial Management',
      'Fundraising',
      'Legal & Compliance',
      'Launch & Growth'
    ];

    for (let i = 0; i < 12; i++) {
      const module = await prisma.module.upsert({
        where: { id: `module-${i + 1}` },
        update: {},
        create: {
          id: `module-${i + 1}`,
          programId: program.id,
          title: moduleTitles[i],
          description: `Learn ${moduleTitles[i].toLowerCase()} with expert guidance`,
          order: i + 1,
          duration: 4, // 4 weeks per module
          isActive: true,
        },
      });
      modules.push(module);
    }

    console.log('✅ Modules created:', modules.length);

    // Create a test mentor
    const mentor = await prisma.user.upsert({
      where: { email: 'mentor@kalpla.com' },
      update: {},
      create: {
        id: 'mentor-1',
        cognitoId: 'mentor-cognito-1',
        email: 'mentor@kalpla.com',
        name: 'John Doe',
        role: 'MENTOR',
        status: 'ACTIVE',
        paymentStatus: 'COMPLETED',
        paymentAmount: 0,
        enrollmentDate: new Date(),
      },
    });

    console.log('✅ Mentor created:', mentor.name);

    // Create a test student
    const student = await prisma.user.upsert({
      where: { email: 'student@kalpla.com' },
      update: {},
      create: {
        id: 'student-1',
        cognitoId: 'student-cognito-1',
        email: 'student@kalpla.com',
        name: 'Jane Smith',
        role: 'STUDENT',
        status: 'ACTIVE',
        paymentStatus: 'COMPLETED',
        paymentAmount: 4999900,
        transactionId: 'txn-123456',
        enrollmentDate: new Date(),
      },
    });

    console.log('✅ Student created:', student.name);

    // Create a test admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@kalpla.com' },
      update: {},
      create: {
        id: 'admin-1',
        cognitoId: 'admin-cognito-1',
        email: 'admin@kalpla.com',
        name: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE',
        paymentStatus: 'COMPLETED',
        paymentAmount: 0,
        enrollmentDate: new Date(),
      },
    });

    console.log('✅ Admin created:', admin.name);

    // Create enrollment
    const enrollment = await prisma.enrollment.upsert({
      where: { 
        userId_programId: {
          userId: student.id,
          programId: program.id,
        }
      },
      update: {},
      create: {
        id: 'enrollment-1',
        userId: student.id,
        programId: program.id,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      },
    });

    console.log('✅ Enrollment created');

    // Create sessions for each module (20 sessions per module)
    const sessions = [];
    for (const module of modules) {
      for (let i = 1; i <= 20; i++) {
        const session = await prisma.session.upsert({
          where: { id: `session-${module.id}-${i}` },
          update: {},
          create: {
            id: `session-${module.id}-${i}`,
            moduleId: module.id,
            title: `Session ${i}: ${module.title} - Part ${i}`,
            description: `Detailed session on ${module.title} covering key concepts and practical applications`,
            type: 'RECORDED',
            status: 'COMPLETED',
            startTime: new Date(Date.now() - (12 - module.order) * 30 * 24 * 60 * 60 * 1000), // Staggered dates
            endTime: new Date(Date.now() - (12 - module.order) * 30 * 24 * 60 * 60 * 1000 + 3600000), // 1 hour later
            maxParticipants: 100,
            videoS3Key: `modules/module-${module.order}/session-${i}.mp4`,
            duration: 3600, // 1 hour in seconds
            orderIndex: i,
            isLive: false,
            creatorId: mentor.id,
          },
        });
        sessions.push(session);
      }
    }

    console.log('✅ Sessions created:', sessions.length);

    // Create some video progress for the student (partial completion of first few modules)
    const videoProgress = [];
    
    // Module 1: 100% complete
    for (let i = 1; i <= 20; i++) {
      const sessionId = `session-module-1-${i}`;
      const progress = await prisma.videoProgress.upsert({
        where: {
          studentId_sessionId: {
            studentId: student.id,
            sessionId,
          },
        },
        update: {},
        create: {
          id: `progress-${student.id}-${sessionId}`,
          studentId: student.id,
          sessionId,
          watchedSeconds: 3600, // Full duration
          completed: true,
          lastWatched: new Date(),
        },
      });
      videoProgress.push(progress);
    }

    // Module 2: 60% complete (12 out of 20 sessions)
    for (let i = 1; i <= 12; i++) {
      const sessionId = `session-module-2-${i}`;
      const progress = await prisma.videoProgress.upsert({
        where: {
          studentId_sessionId: {
            studentId: student.id,
            sessionId,
          },
        },
        update: {},
        create: {
          id: `progress-${student.id}-${sessionId}`,
          studentId: student.id,
          sessionId,
          watchedSeconds: 3600, // Full duration
          completed: true,
          lastWatched: new Date(),
        },
      });
      videoProgress.push(progress);
    }

    // Module 2: Partial progress on session 13
    const partialSessionId = 'session-module-2-13';
    const partialProgress = await prisma.videoProgress.upsert({
      where: {
        studentId_sessionId: {
          studentId: student.id,
          sessionId: partialSessionId,
        },
      },
      update: {},
      create: {
        id: `progress-${student.id}-${partialSessionId}`,
        studentId: student.id,
        sessionId: partialSessionId,
        watchedSeconds: 1800, // Half duration
        completed: false,
        lastWatched: new Date(),
      },
    });
    videoProgress.push(partialProgress);

    console.log('✅ Video progress created:', videoProgress.length);

    // Create some analytics events
    const analyticsEvents = [];
    for (let i = 0; i < 50; i++) {
      const event = await prisma.analyticsEvent.create({
        data: {
          userId: student.id,
          sessionId: sessions[Math.floor(Math.random() * sessions.length)].id,
          event: 'video_progress_updated',
          properties: {
            watchedSeconds: Math.floor(Math.random() * 3600),
            progressPercentage: Math.floor(Math.random() * 100),
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          },
        },
      });
      analyticsEvents.push(event);
    }

    console.log('✅ Analytics events created:', analyticsEvents.length);

    console.log('🎉 Video data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Program: ${program.name}`);
    console.log(`- Modules: ${modules.length}`);
    console.log(`- Sessions: ${sessions.length}`);
    console.log(`- Student: ${student.name} (${student.email})`);
    console.log(`- Mentor: ${mentor.name} (${mentor.email})`);
    console.log(`- Admin: ${admin.name} (${admin.email})`);
    console.log(`- Video Progress: ${videoProgress.length} records`);
    console.log(`- Analytics Events: ${analyticsEvents.length} records`);

    console.log('\n🔑 Test Credentials:');
    console.log(`Student ID: ${student.id}`);
    console.log(`Student Email: ${student.email}`);
    console.log(`Mentor ID: ${mentor.id}`);
    console.log(`Mentor Email: ${mentor.email}`);
    console.log(`Admin ID: ${admin.id}`);
    console.log(`Admin Email: ${admin.email}`);

  } catch (error) {
    console.error('❌ Error seeding video data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedVideoData()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedVideoData };
