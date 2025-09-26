import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface Order extends RowDataPacket {
	id: number;
	package_id: number;
	customer_name: string;
	phone_number: string;
	email: string;
	status: string;
}

// GET - Fetch all orders
export async function GET() {
	try {
		console.log('Fetching orders data...');
		const [rows] = await db.execute<Order[]>(`
			SELECT o.*, pw.package_name 
			FROM orders o 
			LEFT JOIN wedding_packages pw ON o.package_id = pw.id 
			ORDER BY o.id DESC
		`);
		console.log('Data fetched successfully:', rows.length, 'rows');

		return NextResponse.json({ data: rows }, { status: 200 });
	} catch (error) {
		console.error('Error fetching orders:', error);
		return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
	}
}

// POST - Create new order
export async function POST(request: NextRequest) {
	try {
		console.log('Creating new order...');

		const formData = await request.formData();

		const package_id = parseInt(formData.get('package_id') as string);
		const customer_name = formData.get('customer_name') as string;
		const phone_number = formData.get('phone_number') as string;
		const email = formData.get('email') as string;
		const status = 'request'; // Default status

		console.log('Parsed data:', { package_id, customer_name, phone_number, email, status });

		// Validate required fields
		if (!package_id || !customer_name || !phone_number || !email) {
			return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
		}

		// Check if package_id exists
		const [packageExists] = await db.execute<RowDataPacket[]>('SELECT id FROM wedding_packages WHERE id = ?', [
			package_id
		]);

		if (packageExists.length === 0) {
			return NextResponse.json({ message: 'Wedding package not found' }, { status: 400 });
		}

		const [result] = await db.execute<ResultSetHeader>(
			'INSERT INTO orders (package_id, customer_name, phone_number, email, status) VALUES (?, ?, ?, ?, ?)',
			[package_id, customer_name, phone_number, email, status]
		);

		console.log('Data inserted with ID:', result.insertId);

		return NextResponse.json(
			{
				message: 'Order created successfully',
				id: result.insertId
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating order:', error);
		return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
	}
}

// PUT - Update order (status only for admin, or full update)
export async function PUT(request: NextRequest) {
	try {
		console.log('Updating order...');

		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);

		// Check if this is a status-only update
		const statusOnly = formData.get('status') && !formData.get('customer_name');

		if (statusOnly) {
			// Status update only (for admin)
			const status = formData.get('status') as string;

			console.log('Updating status for ID:', id, 'to status:', status);

			if (!id || !status) {
				return NextResponse.json({ message: 'ID and status are required' }, { status: 400 });
			}

			// Validate status values
			if (!['request', 'approved', 'rejected'].includes(status)) {
				return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
			}

			await db.execute<ResultSetHeader>('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

			console.log('Status updated successfully');
			return NextResponse.json({ message: 'Order status updated successfully' }, { status: 200 });
		} else {
			// Full update
			const package_id = parseInt(formData.get('package_id') as string);
			const customer_name = formData.get('customer_name') as string;
			const phone_number = formData.get('phone_number') as string;
			const email = formData.get('email') as string;
			const status = formData.get('status') as string;

			console.log('Full update for ID:', id, 'with data:', {
				package_id,
				customer_name,
				phone_number,
				email,
				status
			});

			// Validate required fields
			if (!id || !package_id || !customer_name || !phone_number || !email || !status) {
				return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
			}

			// Check if package_id exists
			const [packageExists] = await db.execute<RowDataPacket[]>('SELECT id FROM wedding_packages WHERE id = ?', [
				package_id
			]);

			if (packageExists.length === 0) {
				return NextResponse.json({ message: 'Wedding package not found' }, { status: 400 });
			}

			await db.execute<ResultSetHeader>(
				'UPDATE orders SET package_id = ?, customer_name = ?, phone_number = ?, email = ?, status = ? WHERE id = ?',
				[package_id, customer_name, phone_number, email, status, id]
			);

			console.log('Order updated successfully');
			return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });
		}
	} catch (error) {
		console.error('Error updating order:', error);
		return NextResponse.json({ message: 'Failed to update order' }, { status: 500 });
	}
}

// DELETE - Delete order
export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ message: 'ID is required' }, { status: 400 });
		}

		console.log('Deleting order with ID:', id);

		await db.execute<ResultSetHeader>('DELETE FROM orders WHERE id = ?', [id]);

		console.log('Order deleted successfully');

		return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error deleting order:', error);
		return NextResponse.json({ message: 'Failed to delete order' }, { status: 500 });
	}
}
