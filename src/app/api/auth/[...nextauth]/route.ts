import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import mysql from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2';

type UserRow = RowDataPacket & {
	id: number;
	nama: string;
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
				if (!credentials?.email || !credentials.password) return null;

				const conn = await mysql.createConnection({
					host: process.env.DB_HOST,
					user: process.env.DB_USER,
					password: process.env.DB_PASS,
					database: process.env.DB_NAME
				});

				const [rows] = await conn.query<UserRow[]>(
					'SELECT id, nama, email, password FROM users WHERE email = ? LIMIT 1',
					[credentials.email]
				);

				await conn.end();

				const user = rows[0];
				if (!user) return null;

				// Sementara untuk testing - gunakan plain text comparison
				// Ganti ini dengan bcrypt setelah password di database sudah di-hash
				const isPasswordValid = credentials.password === user.password;

				// Untuk production, gunakan ini setelah password di-hash:
				// const isPasswordValid = await compare(credentials.password, user.password);

				if (!isPasswordValid) return null;

				return {
					id: String(user.id),
					name: user.nama,
					email: user.email
				};
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
