import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface Pesanan extends RowDataPacket {
	id: number;
	paket_id: number;
	nama_pemesan: string;
	no_telp: string;
	email: string;
	status: string;
}

// GET - Fetch all pesanan
export async function GET() {
	try {
		console.log('Getting pesanan data...');
		const [rows] = await db.execute<Pesanan[]>(`
			SELECT p.*, pw.nama_paket 
			FROM pesanan p 
			LEFT JOIN paket_wedding pw ON p.paket_id = pw.id 
			ORDER BY p.id DESC
		`);
		console.log('Data fetched successfully:', rows.length, 'rows');

		return NextResponse.json({ data: rows }, { status: 200 });
	} catch (error) {
		console.error('Error fetching pesanan:', error);
		return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
	}
}

// POST - Create new pesanan
export async function POST(request: NextRequest) {
	try {
		console.log('Creating pesanan...');

		const formData = await request.formData();

		const paket_id = parseInt(formData.get('paket_id') as string);
		const nama_pemesan = formData.get('nama_pemesan') as string;
		const no_telp = formData.get('no_telp') as string;
		const email = formData.get('email') as string;
		const status = 'request'; // Default status

		console.log('Parsed data:', { paket_id, nama_pemesan, no_telp, email, status });

		// Validate required fields
		if (!paket_id || !nama_pemesan || !no_telp || !email) {
			return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 });
		}

		// Check if paket_id exists
		const [paketExists] = await db.execute<RowDataPacket[]>('SELECT id FROM paket_wedding WHERE id = ?', [
			paket_id
		]);

		if (paketExists.length === 0) {
			return NextResponse.json({ message: 'Paket wedding tidak ditemukan' }, { status: 400 });
		}

		const [result] = await db.execute<ResultSetHeader>(
			'INSERT INTO pesanan (paket_id, nama_pemesan, no_telp, email, status) VALUES (?, ?, ?, ?, ?)',
			[paket_id, nama_pemesan, no_telp, email, status]
		);

		console.log('Data inserted with ID:', result.insertId);

		return NextResponse.json(
			{
				message: 'Pesanan berhasil dibuat',
				id: result.insertId
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating pesanan:', error);
		return NextResponse.json({ message: 'Failed to create pesanan' }, { status: 500 });
	}
}

// PUT - Update pesanan (status only untuk admin, atau full update)
export async function PUT(request: NextRequest) {
	try {
		console.log('Updating pesanan...');

		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);

		// Check if this is a status-only update
		const statusOnly = formData.get('status') && !formData.get('nama_pemesan');

		if (statusOnly) {
			// Status update only (for admin)
			const status = formData.get('status') as string;

			console.log('Updating status for ID:', id, 'to status:', status);

			if (!id || !status) {
				return NextResponse.json({ message: 'ID dan status wajib diisi' }, { status: 400 });
			}

			// Validate status values
			if (!['request', 'approved', 'rejected'].includes(status)) {
				return NextResponse.json({ message: 'Status tidak valid' }, { status: 400 });
			}

			await db.execute<ResultSetHeader>('UPDATE pesanan SET status = ? WHERE id = ?', [status, id]);

			console.log('Status updated successfully');
			return NextResponse.json({ message: 'Status pesanan berhasil diupdate' }, { status: 200 });
		} else {
			// Full update (original functionality)
			const paket_id = parseInt(formData.get('paket_id') as string);
			const nama_pemesan = formData.get('nama_pemesan') as string;
			const no_telp = formData.get('no_telp') as string;
			const email = formData.get('email') as string;
			const status = formData.get('status') as string;

			console.log('Full update for ID:', id, 'with data:', { paket_id, nama_pemesan, no_telp, email, status });

			// Validate required fields
			if (!id || !paket_id || !nama_pemesan || !no_telp || !email || !status) {
				return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 });
			}

			// Check if paket_id exists
			const [paketExists] = await db.execute<RowDataPacket[]>('SELECT id FROM paket_wedding WHERE id = ?', [
				paket_id
			]);

			if (paketExists.length === 0) {
				return NextResponse.json({ message: 'Paket wedding tidak ditemukan' }, { status: 400 });
			}

			await db.execute<ResultSetHeader>(
				'UPDATE pesanan SET paket_id = ?, nama_pemesan = ?, no_telp = ?, email = ?, status = ? WHERE id = ?',
				[paket_id, nama_pemesan, no_telp, email, status, id]
			);

			console.log('Data updated successfully');
			return NextResponse.json({ message: 'Pesanan berhasil diupdate' }, { status: 200 });
		}
	} catch (error) {
		console.error('Error updating pesanan:', error);
		return NextResponse.json({ message: 'Failed to update pesanan' }, { status: 500 });
	}
}

// DELETE - Delete pesanan
export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ message: 'ID is required' }, { status: 400 });
		}

		console.log('Deleting pesanan with ID:', id);

		await db.execute<ResultSetHeader>('DELETE FROM pesanan WHERE id = ?', [id]);

		console.log('Data deleted successfully');

		return NextResponse.json({ message: 'Pesanan berhasil dihapus' }, { status: 200 });
	} catch (error) {
		console.error('Error deleting pesanan:', error);
		return NextResponse.json({ message: 'Failed to delete pesanan' }, { status: 500 });
	}
}
