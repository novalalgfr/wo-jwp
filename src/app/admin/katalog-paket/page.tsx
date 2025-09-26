'use client';

import React, { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { Plus, Edit, Trash2 } from 'lucide-react';
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

interface PaketWedding {
	id: number;
	nama_paket: string;
	deskripsi_paket: string;
	harga_paket: number;
	gambar_paket: string | null;
}

interface FormData {
	nama_paket: string;
	deskripsi_paket: string;
	harga_paket: string;
	gambar_paket: File | null;
}

interface DeleteDialogState {
	open: boolean;
	id: number | null;
}

export default function KatalogPaketWeddingPage() {
	const [paketWedding, setPaketWedding] = useState<PaketWedding[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ open: false, id: null });
	const [editMode, setEditMode] = useState<boolean>(false);
	const [currentId, setCurrentId] = useState<number | null>(null);

	const [formData, setFormData] = useState<FormData>({
		nama_paket: '',
		deskripsi_paket: '',
		harga_paket: '',
		gambar_paket: null
	});

	const columns: ColumnDef<PaketWedding>[] = [
		{
			accessorKey: 'id',
			header: createSortableHeader<PaketWedding>('ID'),
			cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>
		},
		{
			accessorKey: 'gambar_paket',
			header: 'Gambar',
			cell: ({ row }) => {
				const gambar = row.getValue('gambar_paket') as string | null;
				return gambar ? (
					<div className="relative w-16 h-16">
						<Image
							src={gambar}
							alt={row.getValue('nama_paket') as string}
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
		{
			accessorKey: 'nama_paket',
			header: createSortableHeader<PaketWedding>('Nama Paket'),
			cell: ({ row }) => <div className="font-medium">{row.getValue('nama_paket')}</div>
		},
		{
			accessorKey: 'deskripsi_paket',
			header: 'Deskripsi',
			cell: ({ row }) => {
				const desc = row.getValue('deskripsi_paket') as string;
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
			accessorKey: 'harga_paket',
			header: createSortableHeader<PaketWedding>('Harga'),
			cell: ({ row }) => {
				const harga = parseFloat(row.getValue('harga_paket') as string);
				return (
					<div className="font-medium">
						{new Intl.NumberFormat('id-ID', {
							style: 'currency',
							currency: 'IDR'
						}).format(harga)}
					</div>
				);
			}
		},
		createActionColumn<PaketWedding>((row: PaketWedding) => (
			<>
				<DropdownMenuItem onClick={() => handleEdit(row)}>
					<Edit className="mr-2 h-4 w-4" />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setDeleteDialog({ open: true, id: row.id })}
					className="text-red-600"
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Hapus
				</DropdownMenuItem>
			</>
		))
	];

	useEffect(() => {
		fetchPaketWedding();
	}, []);

	const fetchPaketWedding = async (): Promise<void> => {
		try {
			const response = await fetch('/api/paket-wedding');
			const result = await response.json();
			setPaketWedding(result.data || []);
		} catch (error) {
			console.error('Error fetching paket wedding:', error);
		} finally {
			setLoading(false);
		}
	};

	const resetForm = (): void => {
		setFormData({
			nama_paket: '',
			deskripsi_paket: '',
			harga_paket: '',
			gambar_paket: null
		});
		setEditMode(false);
		setCurrentId(null);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		const submitFormData = new FormData();
		submitFormData.append('nama_paket', formData.nama_paket);
		submitFormData.append('deskripsi_paket', formData.deskripsi_paket);
		submitFormData.append('harga_paket', formData.harga_paket);

		if (formData.gambar_paket) {
			submitFormData.append('gambar_paket', formData.gambar_paket);
		}

		if (editMode && currentId) {
			submitFormData.append('id', currentId.toString());
		}

		try {
			const method = editMode ? 'PUT' : 'POST';
			const response = await fetch('/api/paket-wedding', {
				method,
				body: submitFormData
			});

			const result = await response.json();

			if (response.ok) {
				await fetchPaketWedding();
				setDialogOpen(false);
				resetForm();
				alert(result.message);
			} else {
				alert(result.message || 'Terjadi kesalahan');
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('Terjadi kesalahan');
		}
	};

	const handleEdit = (row: PaketWedding): void => {
		setFormData({
			nama_paket: row.nama_paket,
			deskripsi_paket: row.deskripsi_paket,
			harga_paket: row.harga_paket.toString(),
			gambar_paket: null
		});
		setCurrentId(row.id);
		setEditMode(true);
		setDialogOpen(true);
	};

	const handleDelete = async (): Promise<void> => {
		try {
			const response = await fetch(`/api/paket-wedding?id=${deleteDialog.id}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			if (response.ok) {
				await fetchPaketWedding();
				setDeleteDialog({ open: false, id: null });
				alert(result.message);
			} else {
				alert(result.message || 'Terjadi kesalahan');
			}
		} catch (error) {
			console.error('Error deleting paket wedding:', error);
			alert('Terjadi kesalahan');
		}
	};

	const handleDialogOpenChange = (open: boolean): void => {
		setDialogOpen(open);
		if (!open) {
			resetForm();
		}
	};

	if (loading) {
		return <div className="p-6">Loading...</div>;
	}

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Paket Wedding</h1>
				<Dialog
					open={dialogOpen}
					onOpenChange={handleDialogOpenChange}
				>
					<DialogTrigger asChild>
						<Button className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							Tambah Paket
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>{editMode ? 'Edit Paket Wedding' : 'Tambah Paket Wedding'}</DialogTitle>
						</DialogHeader>

						<form
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							<TextBox
								id="nama_paket"
								label="Nama Paket"
								placeholder="Masukkan nama paket"
								validation="text"
								value={formData.nama_paket}
								onChange={(e) => setFormData((prev) => ({ ...prev, nama_paket: e.target.value }))}
								required
							/>

							<TextBox
								id="deskripsi_paket"
								label="Deskripsi Paket"
								placeholder="Masukkan deskripsi paket"
								validation="text"
								type="textarea"
								value={formData.deskripsi_paket}
								onChange={(e) => setFormData((prev) => ({ ...prev, deskripsi_paket: e.target.value }))}
								required
							/>

							<TextBox
								id="harga_paket"
								label="Harga Paket"
								placeholder="Masukkan harga paket"
								validation="number"
								value={formData.harga_paket}
								onChange={(e) => setFormData((prev) => ({ ...prev, harga_paket: e.target.value }))}
								required
							/>

							<ImageUpload
								id="gambar_paket"
								label="Gambar Paket"
								value={formData.gambar_paket}
								onChange={(file) => setFormData((prev) => ({ ...prev, gambar_paket: file }))}
								maxSize={5}
							/>

							<div className="flex justify-end gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setDialogOpen(false)}
								>
									Batal
								</Button>
								<Button type="submit">{editMode ? 'Update' : 'Simpan'}</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<DataTable
				columns={columns}
				data={paketWedding}
				searchKey="nama_paket"
				searchPlaceholder="Cari paket wedding..."
				emptyMessage="Belum ada paket wedding."
			/>

			<AlertDialog
				open={deleteDialog.open}
				onOpenChange={(open) => setDeleteDialog({ open, id: null })}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
						<AlertDialogDescription>
							Apakah Anda yakin ingin menghapus paket wedding ini? Aksi ini tidak dapat dibatalkan.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Hapus
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
