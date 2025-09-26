import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const uploadDir = path.join(process.cwd(), 'public/uploads');

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

interface WebsiteProfile extends RowDataPacket {
	id: number;
	// Hero Section
	hero_badge_text: string;
	hero_title: string;
	hero_subtitle: string;
	hero_description: string;
	hero_image_1: string;
	hero_image_2: string;
	hero_cta_text: string;

	// Testimonial Section
	testimonial_text: string;
	testimonial_author: string;

	// About Section
	about_description: string;

	// Stats
	satisfied_couples_count: number;
	portfolio_projects_count: number;

	// Services
	service_1_title: string;
	service_2_title: string;
	service_3_title: string;

	// Process Steps
	process_step_1: string;
	process_step_2: string;
	process_step_3: string;
	process_step_4: string;
	process_step_5: string;
	process_description: string;

	// Gallery Images
	gallery_image_1: string;
	gallery_image_2: string;
	gallery_image_3: string;
	gallery_image_4: string;
	gallery_image_5: string;
	gallery_image_6: string;
	gallery_image_7: string;
	gallery_image_8: string;

	// Additional Content
	aesthetic_text: string;
	gallery_cta_text: string;

	// Bottom Section
	bottom_title: string;
	bottom_description: string;

	created_at: Date;
	updated_at: Date;
}

// Helper function to add full URL to image paths
function addImageUrls(data: WebsiteProfile, baseUrl: string) {
	const imageFields = [
		'hero_image_1',
		'hero_image_2',
		'gallery_image_1',
		'gallery_image_2',
		'gallery_image_3',
		'gallery_image_4',
		'gallery_image_5',
		'gallery_image_6',
		'gallery_image_7',
		'gallery_image_8'
	];

	const result = { ...data };

	imageFields.forEach((field) => {
		const imagePath = data[field];
		// Add URL version of the image path
		result[`${field}_url`] = imagePath && imagePath !== '' ? `${baseUrl}${imagePath}` : null;
	});

	return result;
}

// GET - Fetch website profile
export async function GET(request: NextRequest) {
	try {
		console.log('Fetching website profile data...');

		const [rows] = await db.execute<WebsiteProfile[]>(`
			SELECT * FROM website_profile WHERE id = 1
		`);

		console.log('Profile data fetched successfully');

		// If no profile exists, return default structure
		if (rows.length === 0) {
			return NextResponse.json(
				{
					message: 'No profile found',
					data: null
				},
				{ status: 404 }
			);
		}

		// Add full URLs for images
		const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
		const dataWithUrls = addImageUrls(rows[0], baseUrl);

		console.log('Data with URLs:', dataWithUrls);

		return NextResponse.json({ data: dataWithUrls }, { status: 200 });
	} catch (error) {
		console.error('Error fetching website profile:', error);
		return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
	}
}

// POST - Create new website profile (only if doesn't exist)
export async function POST(request: NextRequest) {
	try {
		console.log('Creating website profile...');

		// Check if profile already exists
		const [existing] = await db.execute<WebsiteProfile[]>('SELECT id FROM website_profile WHERE id = 1');

		if (existing.length > 0) {
			return NextResponse.json(
				{ message: 'Website profile already exists. Use PUT to update.' },
				{ status: 409 }
			);
		}

		const formData = await request.formData();

		// Handle file uploads
		const imageFields = [
			'hero_image_1',
			'hero_image_2',
			'gallery_image_1',
			'gallery_image_2',
			'gallery_image_3',
			'gallery_image_4',
			'gallery_image_5',
			'gallery_image_6',
			'gallery_image_7',
			'gallery_image_8'
		];

		const uploadResults: { [key: string]: string | null } = {};

		for (const field of imageFields) {
			const file = formData.get(field) as File | null;
			if (file && file.size > 0) {
				const fileName = `${field}-${Date.now()}-${file.name}`;
				const filePath = path.join(uploadDir, fileName);

				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);

				fs.writeFileSync(filePath, buffer);
				uploadResults[field] = `/uploads/${fileName}`;
				console.log(`File uploaded for ${field}:`, uploadResults[field]);
			} else {
				uploadResults[field] = null;
			}
		}

		// Extract all form data
		const profileData = {
			// Hero Section
			hero_badge_text: (formData.get('hero_badge_text') as string) || '',
			hero_title: (formData.get('hero_title') as string) || '',
			hero_subtitle: (formData.get('hero_subtitle') as string) || '',
			hero_description: (formData.get('hero_description') as string) || '',
			hero_image_1: uploadResults.hero_image_1 || '',
			hero_image_2: uploadResults.hero_image_2 || '',
			hero_cta_text: (formData.get('hero_cta_text') as string) || '',

			// Testimonial Section
			testimonial_text: (formData.get('testimonial_text') as string) || '',
			testimonial_author: (formData.get('testimonial_author') as string) || '',

			// About Section
			about_description: (formData.get('about_description') as string) || '',

			// Stats
			satisfied_couples_count: parseInt(formData.get('satisfied_couples_count') as string) || 0,
			portfolio_projects_count: parseInt(formData.get('portfolio_projects_count') as string) || 0,

			// Services
			service_1_title: (formData.get('service_1_title') as string) || '',
			service_2_title: (formData.get('service_2_title') as string) || '',
			service_3_title: (formData.get('service_3_title') as string) || '',

			// Process Steps
			process_step_1: (formData.get('process_step_1') as string) || '',
			process_step_2: (formData.get('process_step_2') as string) || '',
			process_step_3: (formData.get('process_step_3') as string) || '',
			process_step_4: (formData.get('process_step_4') as string) || '',
			process_step_5: (formData.get('process_step_5') as string) || '',
			process_description: (formData.get('process_description') as string) || '',

			// Gallery Images
			gallery_image_1: uploadResults.gallery_image_1 || '',
			gallery_image_2: uploadResults.gallery_image_2 || '',
			gallery_image_3: uploadResults.gallery_image_3 || '',
			gallery_image_4: uploadResults.gallery_image_4 || '',
			gallery_image_5: uploadResults.gallery_image_5 || '',
			gallery_image_6: uploadResults.gallery_image_6 || '',
			gallery_image_7: uploadResults.gallery_image_7 || '',
			gallery_image_8: uploadResults.gallery_image_8 || '',

			// Additional Content
			aesthetic_text: (formData.get('aesthetic_text') as string) || '',
			gallery_cta_text: (formData.get('gallery_cta_text') as string) || '',

			// Bottom Section
			bottom_title: (formData.get('bottom_title') as string) || '',
			bottom_description: (formData.get('bottom_description') as string) || ''
		};

		console.log('Creating profile with data:', profileData);

		const [result] = await db.execute<ResultSetHeader>(
			`INSERT INTO website_profile (
				hero_badge_text, hero_title, hero_subtitle, hero_description, hero_image_1, hero_image_2, hero_cta_text,
				testimonial_text, testimonial_author, about_description,
				satisfied_couples_count, portfolio_projects_count,
				service_1_title, service_2_title, service_3_title,
				process_step_1, process_step_2, process_step_3, process_step_4, process_step_5, process_description,
				gallery_image_1, gallery_image_2, gallery_image_3, gallery_image_4, gallery_image_5, gallery_image_6, gallery_image_7, gallery_image_8,
				aesthetic_text, gallery_cta_text, bottom_title, bottom_description
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				profileData.hero_badge_text,
				profileData.hero_title,
				profileData.hero_subtitle,
				profileData.hero_description,
				profileData.hero_image_1,
				profileData.hero_image_2,
				profileData.hero_cta_text,
				profileData.testimonial_text,
				profileData.testimonial_author,
				profileData.about_description,
				profileData.satisfied_couples_count,
				profileData.portfolio_projects_count,
				profileData.service_1_title,
				profileData.service_2_title,
				profileData.service_3_title,
				profileData.process_step_1,
				profileData.process_step_2,
				profileData.process_step_3,
				profileData.process_step_4,
				profileData.process_step_5,
				profileData.process_description,
				profileData.gallery_image_1,
				profileData.gallery_image_2,
				profileData.gallery_image_3,
				profileData.gallery_image_4,
				profileData.gallery_image_5,
				profileData.gallery_image_6,
				profileData.gallery_image_7,
				profileData.gallery_image_8,
				profileData.aesthetic_text,
				profileData.gallery_cta_text,
				profileData.bottom_title,
				profileData.bottom_description
			]
		);

		console.log('Website profile created with ID:', result.insertId);

		return NextResponse.json(
			{
				message: 'Website profile created successfully',
				id: result.insertId
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating website profile:', error);
		return NextResponse.json({ message: 'Failed to create website profile' }, { status: 500 });
	}
}

// PUT - Update website profile
export async function PUT(request: NextRequest) {
	try {
		console.log('Updating website profile...');

		const formData = await request.formData();

		// Get existing data first to preserve unchanged images
		const [existing] = await db.execute<WebsiteProfile[]>('SELECT * FROM website_profile WHERE id = 1');
		const existingData = existing[0] || {};

		// Handle file uploads
		const imageFields = [
			'hero_image_1',
			'hero_image_2',
			'gallery_image_1',
			'gallery_image_2',
			'gallery_image_3',
			'gallery_image_4',
			'gallery_image_5',
			'gallery_image_6',
			'gallery_image_7',
			'gallery_image_8'
		];

		const uploadResults: { [key: string]: string } = {};

		for (const field of imageFields) {
			const file = formData.get(field) as File | null;
			if (file && file.size > 0) {
				// Delete old image if exists
				if (existingData[field]) {
					const oldImagePath = path.join(process.cwd(), 'public', existingData[field]);
					if (fs.existsSync(oldImagePath)) {
						fs.unlinkSync(oldImagePath);
						console.log(`Old image deleted: ${existingData[field]}`);
					}
				}

				// Upload new image
				const fileName = `${field}-${Date.now()}-${file.name}`;
				const filePath = path.join(uploadDir, fileName);

				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);

				fs.writeFileSync(filePath, buffer);
				uploadResults[field] = `/uploads/${fileName}`;
				console.log(`New file uploaded for ${field}:`, uploadResults[field]);
			} else {
				// Keep existing image if no new file uploaded
				uploadResults[field] = existingData[field] || '';
			}
		}

		// Extract all form data
		const profileData = {
			// Hero Section
			hero_badge_text: (formData.get('hero_badge_text') as string) || '',
			hero_title: (formData.get('hero_title') as string) || '',
			hero_subtitle: (formData.get('hero_subtitle') as string) || '',
			hero_description: (formData.get('hero_description') as string) || '',
			hero_image_1: uploadResults.hero_image_1,
			hero_image_2: uploadResults.hero_image_2,
			hero_cta_text: (formData.get('hero_cta_text') as string) || '',

			// Testimonial Section
			testimonial_text: (formData.get('testimonial_text') as string) || '',
			testimonial_author: (formData.get('testimonial_author') as string) || '',

			// About Section
			about_description: (formData.get('about_description') as string) || '',

			// Stats
			satisfied_couples_count: parseInt(formData.get('satisfied_couples_count') as string) || 0,
			portfolio_projects_count: parseInt(formData.get('portfolio_projects_count') as string) || 0,

			// Services
			service_1_title: (formData.get('service_1_title') as string) || '',
			service_2_title: (formData.get('service_2_title') as string) || '',
			service_3_title: (formData.get('service_3_title') as string) || '',

			// Process Steps
			process_step_1: (formData.get('process_step_1') as string) || '',
			process_step_2: (formData.get('process_step_2') as string) || '',
			process_step_3: (formData.get('process_step_3') as string) || '',
			process_step_4: (formData.get('process_step_4') as string) || '',
			process_step_5: (formData.get('process_step_5') as string) || '',
			process_description: (formData.get('process_description') as string) || '',

			// Gallery Images
			gallery_image_1: uploadResults.gallery_image_1,
			gallery_image_2: uploadResults.gallery_image_2,
			gallery_image_3: uploadResults.gallery_image_3,
			gallery_image_4: uploadResults.gallery_image_4,
			gallery_image_5: uploadResults.gallery_image_5,
			gallery_image_6: uploadResults.gallery_image_6,
			gallery_image_7: uploadResults.gallery_image_7,
			gallery_image_8: uploadResults.gallery_image_8,

			// Additional Content
			aesthetic_text: (formData.get('aesthetic_text') as string) || '',
			gallery_cta_text: (formData.get('gallery_cta_text') as string) || '',

			// Bottom Section
			bottom_title: (formData.get('bottom_title') as string) || '',
			bottom_description: (formData.get('bottom_description') as string) || ''
		};

		console.log('Updating profile with data:', profileData);

		// Check if profile exists, if not create it
		if (existing.length === 0) {
			// Create new profile if doesn't exist
			await db.execute<ResultSetHeader>(
				`INSERT INTO website_profile (
					id, hero_badge_text, hero_title, hero_subtitle, hero_description, hero_image_1, hero_image_2, hero_cta_text,
					testimonial_text, testimonial_author, about_description,
					satisfied_couples_count, portfolio_projects_count,
					service_1_title, service_2_title, service_3_title,
					process_step_1, process_step_2, process_step_3, process_step_4, process_step_5, process_description,
					gallery_image_1, gallery_image_2, gallery_image_3, gallery_image_4, gallery_image_5, gallery_image_6, gallery_image_7, gallery_image_8,
					aesthetic_text, gallery_cta_text, bottom_title, bottom_description
				) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					profileData.hero_badge_text,
					profileData.hero_title,
					profileData.hero_subtitle,
					profileData.hero_description,
					profileData.hero_image_1,
					profileData.hero_image_2,
					profileData.hero_cta_text,
					profileData.testimonial_text,
					profileData.testimonial_author,
					profileData.about_description,
					profileData.satisfied_couples_count,
					profileData.portfolio_projects_count,
					profileData.service_1_title,
					profileData.service_2_title,
					profileData.service_3_title,
					profileData.process_step_1,
					profileData.process_step_2,
					profileData.process_step_3,
					profileData.process_step_4,
					profileData.process_step_5,
					profileData.process_description,
					profileData.gallery_image_1,
					profileData.gallery_image_2,
					profileData.gallery_image_3,
					profileData.gallery_image_4,
					profileData.gallery_image_5,
					profileData.gallery_image_6,
					profileData.gallery_image_7,
					profileData.gallery_image_8,
					profileData.aesthetic_text,
					profileData.gallery_cta_text,
					profileData.bottom_title,
					profileData.bottom_description
				]
			);
		} else {
			// Update existing profile
			await db.execute<ResultSetHeader>(
				`UPDATE website_profile SET 
					hero_badge_text = ?, hero_title = ?, hero_subtitle = ?, hero_description = ?, hero_image_1 = ?, hero_image_2 = ?, hero_cta_text = ?,
					testimonial_text = ?, testimonial_author = ?, about_description = ?,
					satisfied_couples_count = ?, portfolio_projects_count = ?,
					service_1_title = ?, service_2_title = ?, service_3_title = ?,
					process_step_1 = ?, process_step_2 = ?, process_step_3 = ?, process_step_4 = ?, process_step_5 = ?, process_description = ?,
					gallery_image_1 = ?, gallery_image_2 = ?, gallery_image_3 = ?, gallery_image_4 = ?, gallery_image_5 = ?, gallery_image_6 = ?, gallery_image_7 = ?, gallery_image_8 = ?,
					aesthetic_text = ?, gallery_cta_text = ?, bottom_title = ?, bottom_description = ?
				WHERE id = 1`,
				[
					profileData.hero_badge_text,
					profileData.hero_title,
					profileData.hero_subtitle,
					profileData.hero_description,
					profileData.hero_image_1,
					profileData.hero_image_2,
					profileData.hero_cta_text,
					profileData.testimonial_text,
					profileData.testimonial_author,
					profileData.about_description,
					profileData.satisfied_couples_count,
					profileData.portfolio_projects_count,
					profileData.service_1_title,
					profileData.service_2_title,
					profileData.service_3_title,
					profileData.process_step_1,
					profileData.process_step_2,
					profileData.process_step_3,
					profileData.process_step_4,
					profileData.process_step_5,
					profileData.process_description,
					profileData.gallery_image_1,
					profileData.gallery_image_2,
					profileData.gallery_image_3,
					profileData.gallery_image_4,
					profileData.gallery_image_5,
					profileData.gallery_image_6,
					profileData.gallery_image_7,
					profileData.gallery_image_8,
					profileData.aesthetic_text,
					profileData.gallery_cta_text,
					profileData.bottom_title,
					profileData.bottom_description
				]
			);
		}

		console.log('Website profile updated successfully');
		return NextResponse.json({ message: 'Website profile updated successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error updating website profile:', error);
		return NextResponse.json({ message: 'Failed to update website profile' }, { status: 500 });
	}
}

// DELETE - Delete website profile (optional, might not be needed for this use case)
export async function DELETE() {
	try {
		console.log('Deleting website profile...');

		// Get existing data to delete images
		const [existing] = await db.execute<WebsiteProfile[]>('SELECT * FROM website_profile WHERE id = 1');

		if (existing.length > 0) {
			const existingData = existing[0];
			const imageFields = [
				'hero_image_1',
				'hero_image_2',
				'gallery_image_1',
				'gallery_image_2',
				'gallery_image_3',
				'gallery_image_4',
				'gallery_image_5',
				'gallery_image_6',
				'gallery_image_7',
				'gallery_image_8'
			];

			// Delete all images
			for (const field of imageFields) {
				if (existingData[field]) {
					const imagePath = path.join(process.cwd(), 'public', existingData[field]);
					if (fs.existsSync(imagePath)) {
						fs.unlinkSync(imagePath);
						console.log(`Image deleted: ${existingData[field]}`);
					}
				}
			}
		}

		await db.execute<ResultSetHeader>('DELETE FROM website_profile WHERE id = 1');

		console.log('Website profile deleted successfully');
		return NextResponse.json({ message: 'Website profile deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error deleting website profile:', error);
		return NextResponse.json({ message: 'Failed to delete website profile' }, { status: 500 });
	}
}
