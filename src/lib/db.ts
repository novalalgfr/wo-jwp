import mysql from 'mysql2/promise';

export const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS || '',
	database: process.env.DB_NAME,
	port: 3306,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

// Test connection function (opsional)
export async function testConnection() {
	try {
		const connection = await db.getConnection();
		console.log('Database connected successfully');
		connection.release();
		return true;
	} catch (error: unknown) {
		console.error('Database connection failed:', error instanceof Error ? error.message : String(error));
		return false;
	}
}
