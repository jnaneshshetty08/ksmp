import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock user database (in production, use a real database)
const users: any[] = [
  {
    id: '1',
    email: 'admin@kalpla.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    isVerified: true,
  },
  {
    id: '2',
    email: 'mentor@kalpla.com',
    password: 'mentor123',
    name: 'Mentor User',
    role: 'mentor',
    isVerified: true,
  },
  {
    id: '3',
    email: 'student@kalpla.com',
    password: 'student123',
    name: 'Student User',
    role: 'student',
    isVerified: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'mentor', 'student'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      password, // In production, hash this password
      name,
      role,
      isVerified: false, // In production, send verification email
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = newUser;

    const response = NextResponse.json({
      message: 'Signup successful',
      user: userWithoutPassword,
      token,
    });

    // Set HTTP-only cookie
    response.cookies.set('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
