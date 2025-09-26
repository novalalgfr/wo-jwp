'use client';

import React, { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Edit, Trash2, CheckCircle, X } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TextBox from '@/components/custom/TextBox';
import ImageUpload from '@/components/custom/ImageUpload';
import { createActionColumn, createSortableHeader, DataTable } from '@/components/custom/DataTable';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface WeddingPackage {
	id: number;
	package_name: string;
	package_description: string;
	package_price: number;
	package_image: string | null;
}

interface FormData {
	package_name: string;
	package_description: string;
	package_price: string;
	package_image: File | null;
}

interface DeleteDialogState {
	open: boolean;
	id: number | null;
}

interface SuccessDialogState {
	open: boolean;
	type: 'create' | 'edit' | 'delete' | null;
	message: string;
}

export default function PackageCatalogPage() {
	const [weddingPackages, setWeddingPackages] = useState<WeddingPackage[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ open: false, id: null });
	const [successDialog, setSuccessDialog] = useState<SuccessDialogState>({
		open: false,
		type: null,
		message: ''
	});
	const [editMode, setEditMode] = useState<boolean>(false);
	const [currentId, setCurrentId] = useState<number | null>(null);

	const [formData, setFormData] = useState<FormData>({
		package_name: '',
		package_description: '',
		package_price: '',
		package_image: null
	});

	const columns: ColumnDef<WeddingPackage>[] = [
		{
			id: 'no',
			header: 'No',
			cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>
		},
		{
			accessorKey: 'package_name',
			header: createSortableHeader<WeddingPackage>('Package Name'),
			cell: ({ row }) => <div className="font-medium">{row.getValue('package_name')}</div>
		},
		{
			accessorKey: 'package_description',
			header: 'Description',
			cell: ({ row }) => {
				const desc = row.getValue('package_description') as string;
				return (
					<div className="max-w-xs">
						<p
							className="truncate"
							title={desc}
						>
							{desc}
						</p>
					</div>
				);
			}
		},
		{
			accessorKey: 'package_price',
			header: createSortableHeader<WeddingPackage>('Price'),
			cell: ({ row }) => {
				const price = parseFloat(row.getValue('package_price') as string);
				return (
					<div className="font-medium">
						{new Intl.NumberFormat('id-ID', {
							style: 'currency',
							currency: 'IDR'
						}).format(price)}
					</div>
				);
			}
		},
		{
			accessorKey: 'package_image',
			header: 'Image',
			cell: ({ row }) => {
				const image = row.getValue('package_image') as string | null;
				return image ? (
					<div className="relative w-16 h-16">
						<Image
							src={image}
							alt={row.getValue('package_name') as string}
							fill
							className="object-cover rounded"
							sizes="64px"
						/>
					</div>
				) : (
					<div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
						No Image
					</div>
				);
			}
		},
		createActionColumn<WeddingPackage>((row: WeddingPackage) => (
			<>
				<DropdownMenuItem
					onClick={() => handleEdit(row)}
					className="cursor-pointer"
				>
					<Edit className="mr-2 h-4 w-4" />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setDeleteDialog({ open: true, id: row.id })}
					className="text-red-600 hover:!text-red-600 cursor-pointer"
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Delete
				</DropdownMenuItem>
			</>
		))
	];

	useEffect(() => {
		fetchWeddingPackages();
	}, []);

	const fetchWeddingPackages = async (): Promise<void> => {
		try {
			const response = await fetch('/api/wedding-packages');
			const result = await response.json();
			setWeddingPackages(result.data || []);
		} catch (error) {
			console.error('Error fetching wedding packages:', error);
		} finally {
			setLoading(false);
		}
	};

	const resetForm = (): void => {
		setFormData({
			package_name: '',
			package_description: '',
			package_price: '',
			package_image: null
		});
		setEditMode(false);
		setCurrentId(null);
	};

	const showSuccessDialog = (type: 'create' | 'edit' | 'delete', message: string): void => {
		setSuccessDialog({ open: true, type, message });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		const submitFormData = new FormData();
		submitFormData.append('package_name', formData.package_name);
		submitFormData.append('package_description', formData.package_description);
		submitFormData.append('package_price', formData.package_price);

		if (formData.package_image) {
			submitFormData.append('package_image', formData.package_image);
		}

		if (editMode && currentId) {
			submitFormData.append('id', currentId.toString());
		}

		try {
			const method = editMode ? 'PUT' : 'POST';
			const response = await fetch('/api/wedding-packages', {
				method,
				body: submitFormData
			});

			const result = await response.json();

			if (response.ok) {
				await fetchWeddingPackages();
				setDialogOpen(false);
				resetForm();
				showSuccessDialog(editMode ? 'edit' : 'create', result.message);
			} else {
				alert(result.message || 'An error occurred');
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('An error occurred');
		}
	};

	const handleEdit = (row: WeddingPackage): void => {
		setFormData({
			package_name: row.package_name,
			package_description: row.package_description,
			package_price: row.package_price.toString(),
			package_image: null
		});
		setCurrentId(row.id);
		setEditMode(true);
		setDialogOpen(true);
	};

	const handleDelete = async (): Promise<void> => {
		try {
			const response = await fetch(`/api/wedding-packages?id=${deleteDialog.id}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			if (response.ok) {
				await fetchWeddingPackages();
				setDeleteDialog({ open: false, id: null });
				showSuccessDialog('delete', result.message);
			} else {
				alert(result.message || 'An error occurred');
			}
		} catch (error) {
			console.error('Error deleting wedding package:', error);
			alert('An error occurred');
		}
	};

	const handleDialogOpenChange = (open: boolean): void => {
		setDialogOpen(open);
		if (!open) {
			resetForm();
		}
	};

	const getSuccessDialogContent = () => {
		switch (successDialog.type) {
			case 'create':
				return {
					title: 'Package Created Successfully!',
					subtitle: 'Success!',
					description: 'The new wedding package has been successfully added to the catalog.',
					bgColor: 'bg-green-100',
					iconColor: 'text-green-600'
				};
			case 'edit':
				return {
					title: 'Package Updated Successfully!',
					subtitle: 'Success!',
					description: 'The wedding package changes have been successfully saved.',
					bgColor: 'bg-blue-100',
					iconColor: 'text-blue-600'
				};
			case 'delete':
				return {
					title: 'Package Deleted Successfully!',
					subtitle: 'Success!',
					description: 'The wedding package has been successfully removed from the catalog.',
					bgColor: 'bg-red-100',
					iconColor: 'text-red-600'
				};
			default:
				return {
					title: 'Operation Successful!',
					subtitle: 'Success!',
					description: 'The operation was completed successfully.',
					bgColor: 'bg-green-100',
					iconColor: 'text-green-600'
				};
		}
	};

	if (loading) {
		return (
			<div className="">
				<div className="flex justify-between items-center mb-6">
					<div className="h-9 w-48 bg-gray-200 rounded animate-pulse"></div>
					<div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
				</div>
				<div className="space-y-4">
					<div className="h-96 bg-gray-200 rounded animate-pulse"></div>
				</div>
			</div>
		);
	}

	const successContent = getSuccessDialogContent();

	return (
		<div>
			<div className="flex justify-between items-center mb-2">
				<h1 className="text-3xl font-bold">Wedding Packages</h1>
				<Dialog
					open={dialogOpen}
					onOpenChange={handleDialogOpenChange}
				>
					<DialogTrigger asChild>
						<Button className="flex items-center gap-2 cursor-pointer">
							<Plus className="h-4 w-4" />
							Add Package
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl !rounded-4xl">
						<DialogHeader className="mb-6">
							<DialogTitle>{editMode ? 'Edit Wedding Package' : 'Add Wedding Package'}</DialogTitle>
						</DialogHeader>

						<form
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							<TextBox
								id="nama_paket"
								label="Package Name"
								placeholder="Enter package name"
								validation="text"
								value={formData.package_name}
								onChange={(e) => setFormData((prev) => ({ ...prev, package_name: e.target.value }))}
								required
							/>

							<TextBox
								id="deskripsi_paket"
								label="Package Description"
								placeholder="Enter package description"
								validation="text"
								type="textarea"
								value={formData.package_description}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, package_description: e.target.value }))
								}
								required
							/>

							<TextBox
								id="harga_paket"
								label="Package Price"
								placeholder="Enter package price"
								validation="number"
								value={formData.package_price}
								onChange={(e) => setFormData((prev) => ({ ...prev, package_price: e.target.value }))}
								required
							/>

							<ImageUpload
								id="gambar_paket"
								label="Package Image"
								value={formData.package_image}
								onChange={(file) => setFormData((prev) => ({ ...prev, package_image: file }))}
								maxSize={5}
							/>

							<div className="flex justify-end gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setDialogOpen(false)}
									className="cursor-pointer rounded-full"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									className="cursor-pointer rounded-full"
								>
									{editMode ? 'Update' : 'Save'}
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<DataTable
				columns={columns}
				data={weddingPackages}
				showColumnToggle={false}
				searchKey="package_name"
				searchPlaceholder="Search for a package..."
				emptyMessage="No wedding packages found."
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={deleteDialog.open}
				onOpenChange={(open) => setDeleteDialog({ open, id: null })}
			>
				<AlertDialogContent className="!rounded-4xl">
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this wedding package? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700 rounded-full"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Success Dialog */}
			<Dialog
				open={successDialog.open}
				onOpenChange={(open) => setSuccessDialog({ open, type: null, message: '' })}
			>
				<DialogContent className="max-w-md !rounded-4xl">
					<DialogHeader>
						<DialogTitle className="text-center text-2xl pt-4">{successContent.title}</DialogTitle>
					</DialogHeader>
					<div className="text-center space-y-4">
						<div
							className={`mx-auto w-20 h-20 ${successContent.bgColor} rounded-full flex items-center justify-center`}
						>
							{successDialog.type === 'delete' ? (
								<X className={`h-10 w-10 ${successContent.iconColor}`} />
							) : (
								<CheckCircle className={`h-10 w-10 ${successContent.iconColor}`} />
							)}
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2">{successContent.subtitle}</h3>
							<p className="text-gray-600 leading-relaxed mb-2">{successContent.description}</p>
						</div>
						<Button
							onClick={() => setSuccessDialog({ open: false, type: null, message: '' })}
							className="w-full rounded-full py-6 text-base cursor-pointer"
						>
							Close
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
