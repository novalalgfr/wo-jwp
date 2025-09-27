import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const uploadDir = path.join(process.cwd(), 'public/uploads');

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

interface WeddingPackage extends RowDataPacket {
	id: number;
	package_name: string;
	package_description: string;
	package_price: number;
	package_image: string | null;
}

function addImageUrl(data: WeddingPackage[], baseUrl: string) {
	return data.map((item) => ({
		...item,
		package_image_url: item.package_image && item.package_image !== '' ? `${baseUrl}${item.package_image}` : null
	}));
}

export async function GET(request: NextRequest) {
	try {
		console.log('Getting wedding package data...');
		const [rows] = await db.execute<WeddingPackage[]>('SELECT * FROM wedding_packages ORDER BY id DESC');
		console.log('Data fetched successfully:', rows.length, 'rows');

		const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
		const dataWithUrls = addImageUrl(rows, baseUrl);

		return NextResponse.json({ data: dataWithUrls }, { status: 200 });
	} catch (error) {
		console.error('Error fetching wedding packages:', error);
		return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		console.log('Creating wedding package...');

		const formData = await request.formData();

		const package_name = formData.get('package_name') as string;
		const package_description = formData.get('package_description') as string;
		const package_price = parseFloat(formData.get('package_price') as string);
		const package_file = formData.get('package_image') as File | null;

		console.log('Parsed data:', { package_name, package_description, package_price });

		let package_image: string | null = null;

		if (package_file && package_file.size > 0) {
			const fileName = `${Date.now()}-${package_file.name}`;
			const filePath = path.join(uploadDir, fileName);

			const arrayBuffer = await package_file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			fs.writeFileSync(filePath, buffer);
			package_image = `/uploads/${fileName}`;
			console.log('File uploaded:', package_image);
		}

		const [result] = await db.execute<ResultSetHeader>(
			'INSERT INTO wedding_packages (package_name, package_description, package_price, package_image) VALUES (?, ?, ?, ?)',
			[package_name, package_description, package_price, package_image]
		);

		console.log('Data inserted with ID:', result.insertId);

		return NextResponse.json(
			{
				message: 'Wedding package created successfully',
				id: result.insertId
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating wedding package:', error);
		return NextResponse.json({ message: 'Failed to create wedding package' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		console.log('Updating wedding package...');

		const formData = await request.formData();

		const id = formData.get('id') as string;
		const package_name = formData.get('package_name') as string;
		const package_description = formData.get('package_description') as string;
		const package_price = parseFloat(formData.get('package_price') as string);
		const package_file = formData.get('package_image') as File | null;

		console.log('Updating ID:', id, 'with data:', { package_name, package_description, package_price });

		const [existingRows] = await db.execute<WeddingPackage[]>(
			'SELECT package_image FROM wedding_packages WHERE id = ?',
			[id]
		);
		let package_image = existingRows[0]?.package_image;

		if (package_file && package_file.size > 0) {
			const fileName = `${Date.now()}-${package_file.name}`;
			const filePath = path.join(uploadDir, fileName);

			const arrayBuffer = await package_file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			fs.writeFileSync(filePath, buffer);

			if (package_image) {
				const oldImagePath = path.join(process.cwd(), 'public', package_image);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			package_image = `/uploads/${fileName}`;
			console.log('New file uploaded:', package_image);
		}

		await db.execute<ResultSetHeader>(
			'UPDATE wedding_packages SET package_name = ?, package_description = ?, package_price = ?, package_image = ? WHERE id = ?',
			[package_name, package_description, package_price, package_image, id]
		);

		console.log('Data updated successfully');

		return NextResponse.json({ message: 'Wedding package updated successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error updating wedding package:', error);
		return NextResponse.json({ message: 'Failed to update wedding package' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ message: 'ID is required' }, { status: 400 });
		}

		console.log('Deleting wedding package with ID:', id);

		const [existingRows] = await db.execute<WeddingPackage[]>(
			'SELECT package_image FROM wedding_packages WHERE id = ?',
			[id]
		);
		const package_image = existingRows[0]?.package_image;

		await db.execute<ResultSetHeader>('DELETE FROM wedding_packages WHERE id = ?', [id]);

		if (package_image) {
			const imagePath = path.join(process.cwd(), 'public', package_image);
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
				console.log('Image file deleted:', imagePath);
			}
		}

		console.log('Data deleted successfully');

		return NextResponse.json({ message: 'Wedding package deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error deleting wedding package:', error);
		return NextResponse.json({ message: 'Failed to delete wedding package' }, { status: 500 });
	}
}
