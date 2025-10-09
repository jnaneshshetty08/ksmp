import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock user database
const users = [
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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: 'Login successful',
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
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
