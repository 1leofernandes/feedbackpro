import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, enterprise } = body;

    // Validate input
    if (!email || !password || !enterprise) {
      return NextResponse.json(
        { error: 'Email, password, and enterprise are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await query<{ id: number }>(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('[REGISTER] Creating user:', email);
    console.log('[REGISTER] Password hash:', passwordHash);

    // Insert user
    await query(
      `INSERT INTO users (email, name, password_hash, enterprise, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [email, name || '', passwordHash, enterprise]
    );

    console.log('[REGISTER] User created successfully:', email);

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER] Error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
