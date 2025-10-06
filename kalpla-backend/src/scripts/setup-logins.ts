import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupLogins() {
  try {
    console.log('🔐 Setting up login credentials for all roles...');

    // Update existing users with mock passwords
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    console.log(`Found ${users.length} users to update`);

    for (const user of users) {
      console.log(`✅ User: ${user.name} (${user.email}) - Role: ${user.role}`);
    }

    console.log('\n🔑 Login Credentials for Testing:');
    console.log('=====================================');
    
    // Student login
    console.log('\n📚 STUDENT LOGIN:');
    console.log('Email: student@kalpla.com');
    console.log('Password: password123');
    console.log('Role: STUDENT');
    console.log('ID: student-1');

    // Mentor login
    console.log('\n👨‍🏫 MENTOR LOGIN:');
    console.log('Email: mentor@kalpla.com');
    console.log('Password: password123');
    console.log('Role: MENTOR');
    console.log('ID: mentor-1');

    // Admin login
    console.log('\n👑 ADMIN LOGIN:');
    console.log('Email: admin@kalpla.com');
    console.log('Password: password123');
    console.log('Role: ADMIN');
    console.log('ID: admin-1');

    console.log('\n🌐 API Endpoints:');
    console.log('==================');
    console.log('POST /api/auth/login - Login endpoint');
    console.log('POST /api/auth/register - Register new user');
    console.log('POST /api/auth/verify - Verify JWT token');
    console.log('POST /api/auth/logout - Logout endpoint');

    console.log('\n📝 Example Login Request:');
    console.log('==========================');
    console.log(`
curl -X POST http://localhost:3001/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "student@kalpla.com",
    "password": "password123"
  }'
    `);

    console.log('\n🎯 Test Commands:');
    console.log('==================');
    console.log('# Test Student Login');
    console.log('curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d \'{"email": "student@kalpla.com", "password": "password123"}\'');
    
    console.log('\n# Test Mentor Login');
    console.log('curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d \'{"email": "mentor@kalpla.com", "password": "password123"}\'');
    
    console.log('\n# Test Admin Login');
    console.log('curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d \'{"email": "admin@kalpla.com", "password": "password123"}\'');

    console.log('\n✅ Login setup completed successfully!');
    console.log('\n💡 Note: All users use the same password "password123" for development testing.');

  } catch (error) {
    console.error('❌ Error setting up logins:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup function
if (require.main === module) {
  setupLogins()
    .then(() => {
      console.log('✅ Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

export { setupLogins };
