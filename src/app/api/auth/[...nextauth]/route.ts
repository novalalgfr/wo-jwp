import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import mysql from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2';

type UserRow = RowDataPacket & {
	id: number;
	name: string;
	email: string;
	password: string;
};

export const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					console.log('Missing credentials');
					return null;
				}

				try {
					console.log('=== LOGIN DEBUG ===');
					console.log('Email received:', credentials.email);
					console.log('Password received:', credentials.password);

					const conn = await mysql.createConnection({
						host: process.env.DB_HOST,
						user: process.env.DB_USER,
						password: process.env.DB_PASS,
						database: process.env.DB_NAME
					});

					const [rows] = await conn.query<UserRow[]>(
						'SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1',
						[credentials.email]
					);

					await conn.end();

					const user = rows[0];
					if (!user) {
						console.log('❌ User not found for email:', credentials.email);
						return null;
					}

					console.log('✅ User found:', {
						id: user.id,
						name: user.name,
						email: user.email
					});
					console.log('Hash from DB:', user.password);
					console.log('Plain password to compare:', credentials.password);

					// Gunakan bcrypt untuk membandingkan password
					const isPasswordValid = await compare(credentials.password, user.password);

					console.log('Password comparison result:', isPasswordValid);

					if (!isPasswordValid) {
						console.log('❌ Password mismatch!');
						console.log('Expected hash:', user.password);
						console.log('Input password:', credentials.password);

						// Test dengan hash manual untuk debug
						const { hash } = await import('bcryptjs');
						const testHash = await hash(credentials.password, 10);
						console.log('New hash generated for input:', testHash);

						return null;
					}

					console.log('✅ Login successful!');
					return {
						id: String(user.id),
						name: user.name,
						email: user.email
					};
				} catch (error) {
					console.error('❌ Auth error:', error);
					return null;
				}
			}
		})
	],
	pages: {
		signIn: '/login'
	},
	session: {
		strategy: 'jwt'
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				(token as unknown as { user?: unknown }).user = user;
			}
			return token;
		},
		async session({ session, token }) {
			const t = token as unknown as { user?: unknown };
			if (t.user) {
				session.user = t.user as typeof session.user;
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			// Redirect ke admin setelah login sukses
			if (url === baseUrl + '/login') {
				return baseUrl + '/admin/website-profile';
			}
			return url;
		}
	}
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
