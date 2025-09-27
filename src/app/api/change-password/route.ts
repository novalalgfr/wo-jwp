import { NextRequest, NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import mysql from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2';

type UserRow = RowDataPacket & {
	id: number;
	name: string;
	email: string;
	password: string;
};

export async function POST(request: NextRequest) {
	try {
		const { email, current_password, new_password } = await request.json();

		// Input validation
		if (!email || !current_password || !new_password) {
			return NextResponse.json(
				{ message: 'Email, current password, and new password are required' },
				{ status: 400 }
			);
		}

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
		}

		// New password length validation
		if (new_password.length < 6) {
			return NextResponse.json({ message: 'New password must be at least 6 characters long' }, { status: 400 });
		}

		// Database connection
		const conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});

		try {
			// Find user by email
			const [rows] = await conn.query<UserRow[]>(
				'SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1',
				[email]
			);

			const user = rows[0];
			if (!user) {
				return NextResponse.json({ message: 'Email not found' }, { status: 404 });
			}

			// Verify current password
			const isCurrentPasswordValid = await compare(current_password, user.password);
			if (!isCurrentPasswordValid) {
				return NextResponse.json({ message: 'Incorrect current password' }, { status: 401 });
			}

			// Check if the new password is the same as the old one
			const isSamePassword = await compare(new_password, user.password);
			if (isSamePassword) {
				return NextResponse.json(
					{ message: 'New password cannot be the same as the old password' },
					{ status: 400 }
				);
			}

			// Hash the new password
			const hashedNewPassword = await hash(new_password, 10);

			// Update the password in the database
			await conn.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, user.id]);

			console.log(`✅ Password updated successfully for user: ${user.email}`);

			return NextResponse.json(
				{
					message: 'Password changed successfully',
					user: {
						id: user.id,
						name: user.name,
						email: user.email
					}
				},
				{ status: 200 }
			);
		} finally {
			await conn.end();
		}
	} catch (error) {
		console.error('❌ Change password error:', error);
		return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
	}
}

// Other methods are not allowed
export async function GET() {
	return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
