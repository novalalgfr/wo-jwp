'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TextBox from '@/components/custom/TextBox';
import ImageUpload from '@/components/custom/ImageUpload';

export interface WebsiteProfileData {
	hero_badge_text: string;
	hero_title: string;
	hero_subtitle: string;
	hero_description: string;
	hero_image_1: File | null;
	hero_image_2: File | null;
	hero_cta_text: string;
	testimonial_text: string;
	testimonial_author: string;
	about_description: string;
	satisfied_couples_count: number;
	portfolio_projects_count: number;
	service_1_title: string;
	service_2_title: string;
	service_3_title: string;
	process_step_1: string;
	process_step_2: string;
	process_step_3: string;
	process_step_4: string;
	process_step_5: string;
	process_description: string;
	gallery_image_1: File | null;
	gallery_image_2: File | null;
	gallery_image_3: File | null;
	gallery_image_4: File | null;
	gallery_image_5: File | null;
	gallery_image_6: File | null;
	gallery_image_7: File | null;
	gallery_image_8: File | null;
	aesthetic_text: string;
	gallery_cta_text: string;
	bottom_title: string;
	bottom_description: string;
}

// Interface untuk menyimpan URL gambar existing
interface ExistingImages {
	hero_image_1?: string;
	hero_image_2?: string;
	gallery_image_1?: string;
	gallery_image_2?: string;
	gallery_image_3?: string;
	gallery_image_4?: string;
	gallery_image_5?: string;
	gallery_image_6?: string;
	gallery_image_7?: string;
	gallery_image_8?: string;
}

export default function WebsiteProfilePage() {
	const [formData, setFormData] = useState<WebsiteProfileData>({
		hero_badge_text: '',
		hero_title: '',
		hero_subtitle: '',
		hero_description: '',
		hero_image_1: null,
		hero_image_2: null,
		hero_cta_text: '',
		testimonial_text: '',
		testimonial_author: '',
		about_description: '',
		satisfied_couples_count: 0,
		portfolio_projects_count: 0,
		service_1_title: '',
		service_2_title: '',
		service_3_title: '',
		process_step_1: '',
		process_step_2: '',
		process_step_3: '',
		process_step_4: '',
		process_step_5: '',
		process_description: '',
		gallery_image_1: null,
		gallery_image_2: null,
		gallery_image_3: null,
		gallery_image_4: null,
		gallery_image_5: null,
		gallery_image_6: null,
		gallery_image_7: null,
		gallery_image_8: null,
		aesthetic_text: '',
		gallery_cta_text: '',
		bottom_title: '',
		bottom_description: ''
	});

	const [existingImages, setExistingImages] = useState<ExistingImages>({});
	console.log('🚀 ~ WebsiteProfilePage ~ existingImages:', existingImages);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
	const [isEdit, setIsEdit] = useState(false);

	// Load existing data on component mount
	useEffect(() => {
		loadExistingData();
	}, []);

	const loadExistingData = async () => {
		try {
			const response = await fetch('/api/website-profile');
			if (response.ok) {
				const result = await response.json();
				if (result.data) {
					setIsEdit(true);

					// Set form data (tanpa file fields)
					const {
						hero_image_1_url,
						hero_image_2_url,
						gallery_image_1_url,
						gallery_image_2_url,
						gallery_image_3_url,
						gallery_image_4_url,
						gallery_image_5_url,
						gallery_image_6_url,
						gallery_image_7_url,
						gallery_image_8_url,
						...textData
					} = result.data;

					setFormData((prev) => ({
						...prev,
						...textData,
						// Reset file fields karena tidak bisa load dari API
						hero_image_1: null,
						hero_image_2: null,
						gallery_image_1: null,
						gallery_image_2: null,
						gallery_image_3: null,
						gallery_image_4: null,
						gallery_image_5: null,
						gallery_image_6: null,
						gallery_image_7: null,
						gallery_image_8: null
					}));

					// Set existing images URLs
					setExistingImages({
						hero_image_1: hero_image_1_url,
						hero_image_2: hero_image_2_url,
						gallery_image_1: gallery_image_1_url,
						gallery_image_2: gallery_image_2_url,
						gallery_image_3: gallery_image_3_url,
						gallery_image_4: gallery_image_4_url,
						gallery_image_5: gallery_image_5_url,
						gallery_image_6: gallery_image_6_url,
						gallery_image_7: gallery_image_7_url,
						gallery_image_8: gallery_image_8_url
					});
				}
			}
		} catch (error) {
			console.error('Error loading existing data:', error);
		}
	};

	const handleTextChange =
		(field: keyof WebsiteProfileData) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
			const value = e.target.value;
			setFormData((prev) => ({
				...prev,
				[field]: field.includes('count') ? parseInt(value) || 0 : value
			}));
		};

	const handleImageChange = (field: keyof WebsiteProfileData) => (file: File | null) => {
		setFormData((prev) => ({
			...prev,
			[field]: file
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const formDataToSend = new FormData();

			// Add all text fields
			Object.entries(formData).forEach(([key, value]) => {
				if (value instanceof File) {
					if (value) {
						formDataToSend.append(key, value);
					}
				} else {
					formDataToSend.append(key, String(value));
				}
			});

			const response = await fetch('/api/website-profile', {
				method: isEdit ? 'PUT' : 'POST',
				body: formDataToSend
			});

			const result = await response.json();

			if (response.ok) {
				setMessage({
					type: 'success',
					text: isEdit ? 'Website profile berhasil diperbarui!' : 'Website profile berhasil dibuat!'
				});
				if (!isEdit) {
					setIsEdit(true);
				}
				// Reload data untuk update existing images URLs
				await loadExistingData();
			} else {
				setMessage({
					type: 'error',
					text: result.message || 'Terjadi kesalahan saat menyimpan data'
				});
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			setMessage({
				type: 'error',
				text: 'Terjadi kesalahan saat menghubungi server'
			});
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div>
				<div className="flex justify-between items-center mb-6">
					<div className="h-9 w-48 bg-gray-200 rounded animate-pulse"></div>
				</div>
				<div className="">
					<div className="h-96 bg-gray-200 rounded animate-pulse"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">
					{isEdit ? 'Edit Website Profile' : 'Add Website Profile'}
				</h1>
			</div>

			{message && (
				<div
					className={`p-4 rounded-md flex items-center gap-2 ${
						message.type === 'success'
							? 'bg-green-50 text-green-700 border border-green-200'
							: 'bg-red-50 text-red-700 border border-red-200'
					}`}
				>
					{message.type === 'success' ? (
						<CheckCircle2 className="h-5 w-5" />
					) : (
						<AlertCircle className="h-5 w-5" />
					)}
					{message.text}
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="space-y-8"
			>
				{/* Hero Section */}
				<Card>
					<CardHeader>
						<CardTitle>Hero Section</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<TextBox
								label="Hero Badge Text"
								placeholder="..."
								id="hero_badge_text"
								value={formData.hero_badge_text}
								onChange={handleTextChange('hero_badge_text')}
								maxLength={20}
							/>
							<TextBox
								label="Hero CTA Text"
								placeholder="..."
								id="hero_cta_text"
								value={formData.hero_cta_text}
								onChange={handleTextChange('hero_cta_text')}
								maxLength={20}
							/>
						</div>
						<TextBox
							label="Hero Title"
							placeholder="..."
							id="hero_title"
							value={formData.hero_title}
							onChange={handleTextChange('hero_title')}
							maxLength={30}
						/>
						<TextBox
							label="Hero Subtitle"
							placeholder="..."
							id="hero_subtitle"
							type="textarea"
							value={formData.hero_subtitle}
							onChange={handleTextChange('hero_subtitle')}
							rows={3}
						/>
						<TextBox
							label="Hero Description"
							placeholder="..."
							id="hero_description"
							type="textarea"
							value={formData.hero_description}
							onChange={handleTextChange('hero_description')}
							rows={3}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<ImageUpload
								label="Hero Image 1"
								id="hero_image_1"
								value={formData.hero_image_1}
								existingImageUrl={existingImages.hero_image_1}
								onChange={handleImageChange('hero_image_1')}
								previewHeight="h-52"
							/>
							<ImageUpload
								label="Hero Image 2"
								id="hero_image_2"
								value={formData.hero_image_2}
								existingImageUrl={existingImages.hero_image_2}
								onChange={handleImageChange('hero_image_2')}
								previewHeight="h-52"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Testimonial Section */}
				<Card>
					<CardHeader>
						<CardTitle>Testimonial Section</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<TextBox
							label="Testimonial Text"
							placeholder="..."
							id="testimonial_text"
							type="textarea"
							value={formData.testimonial_text}
							onChange={handleTextChange('testimonial_text')}
							rows={3}
						/>
						<TextBox
							label="Testimonial Author"
							placeholder="..."
							id="testimonial_author"
							value={formData.testimonial_author}
							onChange={handleTextChange('testimonial_author')}
							maxLength={20}
						/>
					</CardContent>
				</Card>

				{/* About Section */}
				<Card>
					<CardHeader>
						<CardTitle>About Section</CardTitle>
					</CardHeader>
					<CardContent>
						<TextBox
							label="About Description"
							placeholder="..."
							id="about_description"
							type="textarea"
							value={formData.about_description}
							onChange={handleTextChange('about_description')}
							rows={4}
						/>
					</CardContent>
				</Card>

				{/* Stats */}
				<Card>
					<CardHeader>
						<CardTitle>Statistics</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<TextBox
								label="Satisfied Couples Count"
								placeholder="100"
								id="satisfied_couples_count"
								inputType="number"
								validation="number"
								min={0}
								allowDecimals={false}
								value={formData.satisfied_couples_count.toString()}
								onChange={handleTextChange('satisfied_couples_count')}
							/>
							<TextBox
								label="Portfolio Projects Count"
								placeholder="50"
								id="portfolio_projects_count"
								inputType="number"
								validation="number"
								min={0}
								allowDecimals={false}
								value={formData.portfolio_projects_count.toString()}
								onChange={handleTextChange('portfolio_projects_count')}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Services */}
				<Card>
					<CardHeader>
						<CardTitle>Services</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<TextBox
								label="Service 1 Title"
								placeholder="..."
								id="service_1_title"
								value={formData.service_1_title}
								onChange={handleTextChange('service_1_title')}
								maxLength={30}
							/>
							<TextBox
								label="Service 2 Title"
								placeholder="..."
								id="service_2_title"
								value={formData.service_2_title}
								onChange={handleTextChange('service_2_title')}
								maxLength={30}
							/>
							<TextBox
								label="Service 3 Title"
								placeholder="..."
								id="service_3_title"
								value={formData.service_3_title}
								onChange={handleTextChange('service_3_title')}
								maxLength={30}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Process Steps */}
				<Card>
					<CardHeader>
						<CardTitle>Process Steps</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<TextBox
								label="Process Step 1"
								placeholder="..."
								id="process_step_1"
								value={formData.process_step_1}
								onChange={handleTextChange('process_step_1')}
								maxLength={30}
							/>
							<TextBox
								label="Process Step 2"
								placeholder="..."
								id="process_step_2"
								value={formData.process_step_2}
								onChange={handleTextChange('process_step_2')}
								maxLength={30}
							/>
							<TextBox
								label="Process Step 3"
								placeholder="..."
								id="process_step_3"
								value={formData.process_step_3}
								onChange={handleTextChange('process_step_3')}
								maxLength={30}
							/>
							<TextBox
								label="Process Step 4"
								placeholder="..."
								id="process_step_4"
								value={formData.process_step_4}
								onChange={handleTextChange('process_step_4')}
								maxLength={30}
							/>
							<TextBox
								label="Process Step 5"
								placeholder="..."
								id="process_step_5"
								value={formData.process_step_5}
								onChange={handleTextChange('process_step_5')}
								maxLength={30}
							/>
						</div>
						<TextBox
							label="Process Description"
							placeholder="..."
							id="process_description"
							type="textarea"
							value={formData.process_description}
							onChange={handleTextChange('process_description')}
							rows={3}
						/>
					</CardContent>
				</Card>

				{/* Gallery Images */}
				<Card>
					<CardHeader>
						<CardTitle>Gallery Images</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<ImageUpload
								label="Gallery Image 1"
								id="gallery_image_1"
								value={formData.gallery_image_1}
								existingImageUrl={existingImages.gallery_image_1}
								onChange={handleImageChange('gallery_image_1')}
								previewHeight="h-52"
							/>
							<ImageUpload
								label="Gallery Image 2"
								id="gallery_image_2"
								value={formData.gallery_image_2}
								existingImageUrl={existingImages.gallery_image_2}
								onChange={handleImageChange('gallery_image_2')}
								previewHeight="h-52"
							/>
							<ImageUpload
								label="Gallery Image 3"
								id="gallery_image_3"
								value={formData.gallery_image_3}
								existingImageUrl={existingImages.gallery_image_3}
								onChange={handleImageChange('gallery_image_3')}
								previewHeight="h-52"
							/>
							<ImageUpload
								label="Gallery Image 4"
								id="gallery_image_4"
								value={formData.gallery_image_4}
								existingImageUrl={existingImages.gallery_image_4}
								onChange={handleImageChange('gallery_image_4')}
								previewHeight="h-52"
							/>
							<ImageUpload
								label="Gallery Image 5"
								id="gallery_image_5"
								value={formData.gallery_image_5}
								existingImageUrl={existingImages.gallery_image_5}
								onChange={handleImageChange('gallery_image_5')}
								previewHeight="h-52"
							/>
							<ImageUpload
								label="Gallery Image 6"
								id="gallery_image_6"
								value={formData.gallery_image_6}
								existingImageUrl={existingImages.gallery_image_6}
								onChange={handleImageChange('gallery_image_6')}
								previewHeight="h-52"
							/>
							<ImageUpload
								label="Gallery Image 7"
								id="gallery_image_7"
								value={formData.gallery_image_7}
								existingImageUrl={existingImages.gallery_image_7}
								onChange={handleImageChange('gallery_image_7')}
								previewHeight="h-52"
							/>
							<ImageUpload
								label="Gallery Image 8"
								id="gallery_image_8"
								value={formData.gallery_image_8}
								existingImageUrl={existingImages.gallery_image_8}
								onChange={handleImageChange('gallery_image_8')}
								previewHeight="h-52"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Additional Content */}
				<Card>
					<CardHeader>
						<CardTitle>Additional Content</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<TextBox
							label="Aesthetic Text"
							placeholder="..."
							id="aesthetic_text"
							type="textarea"
							value={formData.aesthetic_text}
							onChange={handleTextChange('aesthetic_text')}
							rows={3}
						/>
						<TextBox
							label="Gallery CTA Text"
							placeholder="..."
							id="gallery_cta_text"
							type="textarea"
							value={formData.gallery_cta_text}
							onChange={handleTextChange('gallery_cta_text')}
							rows={2}
						/>
					</CardContent>
				</Card>

				{/* Bottom Section */}
				<Card>
					<CardHeader>
						<CardTitle>Bottom Section</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<TextBox
							label="Bottom Title"
							placeholder="..."
							id="bottom_title"
							value={formData.bottom_title}
							onChange={handleTextChange('bottom_title')}
							maxLength={50}
						/>
						<TextBox
							label="Bottom Description"
							placeholder="Deskripsi bagian bawah"
							id="bottom_description"
							type="textarea"
							value={formData.bottom_description}
							onChange={handleTextChange('bottom_description')}
							rows={3}
						/>
					</CardContent>
				</Card>

				{/* Submit Button */}
				<div className="flex justify-end">
					<Button
						type="submit"
						disabled={loading}
						className="cursor-pointer flex items-center"
					>
						{loading ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="w-4 h-4 mr-2" />
								{isEdit ? 'Update Profile' : 'Save Profile'}
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
