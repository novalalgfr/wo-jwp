'use client';

import React, { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, CheckCircle } from 'lucide-react';
import { createSortableHeader, DataTable } from '@/components/custom/DataTable';
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

interface Pesanan {
	id: number;
	paket_id: number;
	nama_pemesan: string;
	no_telp: string;
	email: string;
	status: 'request' | 'approved' | 'rejected';
	nama_paket?: string; // Dari join dengan paket_wedding
	created_at?: string;
}

interface StatusUpdateDialog {
	open: boolean;
	pesananId: number | null;
	currentStatus: string;
	newStatus: 'approved' | 'rejected';
}

interface SuccessDialog {
	open: boolean;
	title: string;
	message: string;
	actionType: 'approved' | 'rejected';
}

export default function DataPesananPage() {
	const [pesanan, setPesanan] = useState<Pesanan[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [statusDialog, setStatusDialog] = useState<StatusUpdateDialog>({
		open: false,
		pesananId: null,
		currentStatus: '',
		newStatus: 'approved'
	});
	const [successDialog, setSuccessDialog] = useState<SuccessDialog>({
		open: false,
		title: '',
		message: '',
		actionType: 'approved'
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'request':
				return (
					<Badge
						variant="secondary"
						className="bg-yellow-100 text-yellow-800 border-yellow-200"
					>
						<Clock className="w-3 h-3 mr-1" />
						Menunggu
					</Badge>
				);
			case 'approved':
				return (
					<Badge
						variant="secondary"
						className="bg-green-100 text-green-800 border-green-200"
					>
						<Check className="w-3 h-3 mr-1" />
						Disetujui
					</Badge>
				);
			case 'rejected':
				return (
					<Badge
						variant="secondary"
						className="bg-red-100 text-red-800 border-red-200"
					>
						<X className="w-3 h-3 mr-1" />
						Ditolak
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const handleStatusUpdate = (pesananId: number, currentStatus: string, newStatus: 'approved' | 'rejected') => {
		setStatusDialog({
			open: true,
			pesananId,
			currentStatus,
			newStatus
		});
	};

	const confirmStatusUpdate = async () => {
		if (!statusDialog.pesananId) return;

		try {
			const formData = new FormData();
			formData.append('id', statusDialog.pesananId.toString());
			formData.append('status', statusDialog.newStatus);

			const response = await fetch('/api/pesanan', {
				method: 'PUT',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				await fetchPesanan();
				setStatusDialog({ open: false, pesananId: null, currentStatus: '', newStatus: 'approved' });

				// Show success dialog instead of alert
				setSuccessDialog({
					open: true,
					title: statusDialog.newStatus === 'approved' ? 'Pesanan Disetujui!' : 'Pesanan Ditolak!',
					message:
						statusDialog.newStatus === 'approved'
							? 'Pesanan berhasil disetujui. Customer akan dihubungi untuk proses selanjutnya.'
							: 'Pesanan telah ditolak. Customer akan diinformasikan mengenai penolakan ini.',
					actionType: statusDialog.newStatus
				});
			} else {
				alert(result.message || 'Terjadi kesalahan');
			}
		} catch (error) {
			console.error('Error updating status:', error);
			alert('Terjadi kesalahan');
		}
	};

	const columns: ColumnDef<Pesanan>[] = [
		{
			id: 'no',
			header: 'No',
			cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>
		},
		{
			accessorKey: 'nama_pemesan',
			header: createSortableHeader<Pesanan>('Nama Pemesan'),
			cell: ({ row }) => <div className="font-medium">{row.getValue('nama_pemesan')}</div>
		},
		{
			accessorKey: 'nama_paket',
			header: 'Paket Wedding',
			cell: ({ row }) => {
				const value = row.getValue<string>('nama_paket');
				return (
					<div className="font-medium">
						{value ? value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) : '-'}
					</div>
				);
			}
		},
		{
			accessorKey: 'no_telp',
			header: 'No. Telepon',
			cell: ({ row }) => <div>{row.getValue('no_telp')}</div>
		},
		{
			accessorKey: 'email',
			header: 'Email',
			cell: ({ row }) => (
				<div
					className="max-w-xs truncate"
					title={row.getValue('email') as string}
				>
					{row.getValue('email')}
				</div>
			)
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => getStatusBadge(row.getValue('status') as string)
		},
		{
			id: 'actions',
			header: 'Aksi',
			cell: ({ row }) => {
				const status = row.getValue('status') as string;
				const pesananId = row.original.id;

				if (status === 'request') {
					return (
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="default"
								className="bg-green-600 hover:bg-green-700 cursor-pointer"
								onClick={() => handleStatusUpdate(pesananId, status, 'approved')}
							>
								<Check className="w-4 h-4 mr-1" />
								Setujui
							</Button>
							{/* <Button
								size="sm"
								variant="destructive"
								className="cursor-pointer"
								onClick={() => handleStatusUpdate(pesananId, status, 'rejected')}
							>
								<X className="w-4 h-4 mr-1" />
								Tolak
							</Button> */}
						</div>
					);
				} else {
					return (
						<div className="text-sm text-gray-500">
							{status === 'approved' ? 'Telah disetujui' : 'Telah ditolak'}
						</div>
					);
				}
			}
		}
	];

	useEffect(() => {
		fetchPesanan();
	}, []);

	const fetchPesanan = async (): Promise<void> => {
		try {
			const response = await fetch('/api/pesanan');
			const result = await response.json();
			setPesanan(result.data || []);
		} catch (error) {
			console.error('Error fetching pesanan:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="">
				<div className="flex justify-between items-center mb-6">
					<div className="h-9 w-48 bg-gray-200 rounded animate-pulse"></div>
				</div>
				<div className="space-y-4">
					<div className="h-96 bg-gray-200 rounded animate-pulse"></div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Data Pesanan</h1>
			</div>

			<DataTable
				columns={columns}
				data={pesanan}
				searchKey="nama_pemesan"
				searchPlaceholder="Cari nama pemesan..."
				emptyMessage="Belum ada pesanan."
			/>

			<AlertDialog
				open={statusDialog.open}
				onOpenChange={(open) => setStatusDialog((prev) => ({ ...prev, open }))}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Konfirmasi Perubahan Status</AlertDialogTitle>
						<AlertDialogDescription>
							Apakah Anda yakin ingin {statusDialog.newStatus === 'approved' ? 'menyetujui' : 'menolak'}{' '}
							pesanan ini?
							<br />
							<span className="font-medium mt-2 block">
								Status akan berubah dari &quot;{statusDialog.currentStatus}&quot; menjadi &quot;
								{statusDialog.newStatus}&quot;.
							</span>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmStatusUpdate}
							className={
								statusDialog.newStatus === 'approved'
									? 'bg-green-600 hover:bg-green-700'
									: 'bg-red-600 hover:bg-red-700'
							}
						>
							{statusDialog.newStatus === 'approved' ? 'Setujui' : 'Tolak'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{/* Success Dialog */}
			<AlertDialog
				open={successDialog.open}
				onOpenChange={(open) => setSuccessDialog((prev) => ({ ...prev, open }))}
			>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-center">{successDialog.title}</AlertDialogTitle>
					</AlertDialogHeader>

					<div className="text-center space-y-4 py-4">
						<div
							className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
								successDialog.actionType === 'approved' ? 'bg-green-100' : 'bg-red-100'
							}`}
						>
							{successDialog.actionType === 'approved' ? (
								<CheckCircle className="h-8 w-8 text-green-600" />
							) : (
								<X className="h-8 w-8 text-red-600" />
							)}
						</div>

						<div>
							<p className="text-gray-600 text-sm leading-relaxed">{successDialog.message}</p>
						</div>

						<div
							className={`p-4 rounded-lg ${
								successDialog.actionType === 'approved' ? 'bg-green-50' : 'bg-red-50'
							}`}
						>
							<p
								className={`text-sm font-medium ${
									successDialog.actionType === 'approved' ? 'text-green-800' : 'text-red-800'
								}`}
							>
								{successDialog.actionType === 'approved'
									? '✅ Status berhasil diubah ke "Disetujui"'
									: '❌ Status berhasil diubah ke "Ditolak"'}
							</p>
						</div>

						<Button
							onClick={() => setSuccessDialog((prev) => ({ ...prev, open: false }))}
							className={`w-full cursor-pointer ${
								successDialog.actionType === 'approved'
									? 'bg-green-600 hover:bg-green-700'
									: 'bg-red-600 hover:bg-red-700'
							}`}
						>
							Tutup
						</Button>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
