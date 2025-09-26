import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const uploadDir = path.join(process.cwd(), 'public/uploads');

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

interface PaketWedding extends RowDataPacket {
	id: number;
	nama_paket: string;
	deskripsi_paket: string;
	harga_paket: number;
	gambar_paket: string | null;
}

// GET - Fetch all paket wedding
export async function GET() {
	try {
		console.log('Getting paket wedding data...');
		const [rows] = await db.execute<PaketWedding[]>('SELECT * FROM paket_wedding ORDER BY id DESC');
		console.log('Data fetched successfully:', rows.length, 'rows');

		return NextResponse.json({ data: rows }, { status: 200 });
	} catch (error) {
		console.error('Error fetching paket wedding:', error);
		return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
	}
}

// POST - Create new paket wedding
export async function POST(request: NextRequest) {
	try {
		console.log('Creating paket wedding...');

		const formData = await request.formData();

		const nama_paket = formData.get('nama_paket') as string;
		const deskripsi_paket = formData.get('deskripsi_paket') as string;
		const harga_paket = parseFloat(formData.get('harga_paket') as string);
		const gambar_file = formData.get('gambar_paket') as File | null;

		console.log('Parsed data:', { nama_paket, deskripsi_paket, harga_paket });

		let gambar_paket: string | null = null;

		if (gambar_file && gambar_file.size > 0) {
			const fileName = `${Date.now()}-${gambar_file.name}`;
			const filePath = path.join(uploadDir, fileName);

			const arrayBuffer = await gambar_file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			fs.writeFileSync(filePath, buffer);
			gambar_paket = `/uploads/${fileName}`;
			console.log('File uploaded:', gambar_paket);
		}

		const [result] = await db.execute<ResultSetHeader>(
			'INSERT INTO paket_wedding (nama_paket, deskripsi_paket, harga_paket, gambar_paket) VALUES (?, ?, ?, ?)',
			[nama_paket, deskripsi_paket, harga_paket, gambar_paket]
		);

		console.log('Data inserted with ID:', result.insertId);

		return NextResponse.json(
			{
				message: 'Paket wedding berhasil dibuat',
				id: result.insertId
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating paket wedding:', error);
		return NextResponse.json({ message: 'Failed to create paket wedding' }, { status: 500 });
	}
}

// PUT - Update paket wedding
export async function PUT(request: NextRequest) {
	try {
		console.log('Updating paket wedding...');

		const formData = await request.formData();

		const id = formData.get('id') as string;
		const nama_paket = formData.get('nama_paket') as string;
		const deskripsi_paket = formData.get('deskripsi_paket') as string;
		const harga_paket = parseFloat(formData.get('harga_paket') as string);
		const gambar_file = formData.get('gambar_paket') as File | null;

		console.log('Updating ID:', id, 'with data:', { nama_paket, deskripsi_paket, harga_paket });

		// Get existing record to handle image
		const [existingRows] = await db.execute<PaketWedding[]>('SELECT gambar_paket FROM paket_wedding WHERE id = ?', [
			id
		]);
		let gambar_paket = existingRows[0]?.gambar_paket;

		// Handle new image upload
		if (gambar_file && gambar_file.size > 0) {
			const fileName = `${Date.now()}-${gambar_file.name}`;
			const filePath = path.join(uploadDir, fileName);

			const arrayBuffer = await gambar_file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			fs.writeFileSync(filePath, buffer);

			// Delete old image if exists
			if (gambar_paket) {
				const oldImagePath = path.join(process.cwd(), 'public', gambar_paket);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			gambar_paket = `/uploads/${fileName}`;
			console.log('New file uploaded:', gambar_paket);
		}

		await db.execute<ResultSetHeader>(
			'UPDATE paket_wedding SET nama_paket = ?, deskripsi_paket = ?, harga_paket = ?, gambar_paket = ? WHERE id = ?',
			[nama_paket, deskripsi_paket, harga_paket, gambar_paket, id]
		);

		console.log('Data updated successfully');

		return NextResponse.json({ message: 'Paket wedding berhasil diupdate' }, { status: 200 });
	} catch (error) {
		console.error('Error updating paket wedding:', error);
		return NextResponse.json({ message: 'Failed to update paket wedding' }, { status: 500 });
	}
}

// DELETE - Delete paket wedding
export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ message: 'ID is required' }, { status: 400 });
		}

		console.log('Deleting paket wedding with ID:', id);

		// Get existing record to delete image
		const [existingRows] = await db.execute<PaketWedding[]>('SELECT gambar_paket FROM paket_wedding WHERE id = ?', [
			id
		]);
		const gambar_paket = existingRows[0]?.gambar_paket;

		// Delete record from database
		await db.execute<ResultSetHeader>('DELETE FROM paket_wedding WHERE id = ?', [id]);

		// Delete image file if exists
		if (gambar_paket) {
			const imagePath = path.join(process.cwd(), 'public', gambar_paket);
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
				console.log('Image file deleted:', imagePath);
			}
		}

		console.log('Data deleted successfully');

		return NextResponse.json({ message: 'Paket wedding berhasil dihapus' }, { status: 200 });
	} catch (error) {
		console.error('Error deleting paket wedding:', error);
		return NextResponse.json({ message: 'Failed to delete paket wedding' }, { status: 500 });
	}
}
