import { Label } from '@/components/ui/label';
import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

interface ImageUploadProps {
	label: string;
	id: string;
	value?: File | null;
	existingImageUrl?: string | null; // Tambahkan prop untuk URL gambar existing
	onChange?: (file: File | null) => void;
	className?: string;
	disabled?: boolean;
	required?: boolean;
	accept?: string;
	maxSize?: number;
	previewWidth?: string;
	previewHeight?: string;
	name?: string;
}

const ImageUpload = ({
	label,
	id,
	value,
	existingImageUrl,
	onChange,
	className = '',
	disabled = false,
	required = false,
	accept = 'image/*',
	maxSize = 5,
	previewWidth = 'w-full',
	previewHeight = 'h-48',
	...props
}: ImageUploadProps) => {
	const [preview, setPreview] = useState<string | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasNewFile, setHasNewFile] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Set preview dari existing image URL saat component mount
	useEffect(() => {
		if (existingImageUrl && !hasNewFile) {
			setPreview(existingImageUrl);
		}
	}, [existingImageUrl, hasNewFile]);

	const validateFile = (file: File): string | null => {
		if (maxSize && file.size > maxSize * 1024 * 1024) {
			return `File terlalu besar. Maksimal ${maxSize}MB`;
		}
		if (!file.type.startsWith('image/')) {
			return 'File harus berupa gambar';
		}
		return null;
	};

	const handleFileSelect = (file: File) => {
		const validationError = validateFile(file);
		if (validationError) {
			setError(validationError);
			return;
		}

		setError(null);
		setHasNewFile(true);

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			setPreview(e.target?.result as string);
		};
		reader.readAsDataURL(file);

		// Call onChange
		onChange?.(file);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true);
		} else if (e.type === 'dragleave') {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (disabled) return;

		const file = e.dataTransfer.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleRemove = () => {
		setPreview(null);
		setError(null);
		setHasNewFile(false);
		onChange?.(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleClick = () => {
		if (!disabled) {
			fileInputRef.current?.click();
		}
	};

	// Determine if we should show preview
	const shouldShowPreview = preview && (hasNewFile || existingImageUrl);

	return (
		<div className={`grid w-full gap-3 ${className}`}>
			<Label htmlFor={id}>
				{label} {required && <span className="text-red-500">*</span>}
			</Label>

			{/* Hidden Input File */}
			<input
				ref={fileInputRef}
				type="file"
				id={id}
				accept={accept}
				onChange={handleInputChange}
				className="hidden"
				disabled={disabled}
				required={required}
				{...props}
			/>

			{/* Upload Area */}
			{!shouldShowPreview ? (
				<div
					className={`
						border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
						${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
						${disabled ? 'opacity-50 cursor-not-allowed' : ''}
					`}
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}
					onClick={handleClick}
				>
					<Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
					<p className="text-sm text-gray-600 mb-2">
						<span className="font-medium">Klik untuk upload</span> atau drag & drop
					</p>
					<p className="text-xs text-gray-500">PNG, JPG, GIF hingga {maxSize}MB</p>
				</div>
			) : (
				/* Preview Area */
				<div className="relative">
					<div
						className={`relative ${previewWidth} ${previewHeight} rounded-lg overflow-hidden border border-gray-300`}
					>
						<Image
							src={preview}
							alt="Preview"
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>

						{/* Remove Button */}
						{!disabled && (
							<Button
								type="button"
								onClick={handleRemove}
								className="absolute p-1 top-2 right-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
							>
								<X
									className="h-4 w-4"
									strokeWidth={4}
								/>
							</Button>
						)}
					</div>

					{/* Status indicator */}
					{existingImageUrl && !hasNewFile && <p className="text-xs text-gray-500 mt-1">Current image</p>}
					{hasNewFile && <p className="text-xs text-green-600 mt-1">New image selected</p>}

					{/* Change Image Button */}
					{!disabled && (
						<Button
							type="button"
							onClick={handleClick}
							variant="outline"
							size="sm"
							className="mt-2 text-sm transition-colors flex items-center gap-2 cursor-pointer"
						>
							<ImageIcon className="h-4 w-4" />
							Ganti Gambar
						</Button>
					)}
				</div>
			)}

			{/* Error Message */}
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};

export default ImageUpload;
