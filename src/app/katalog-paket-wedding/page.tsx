'use client';

import Card from '@/components/custom/Card';
import FormPesanan from '@/components/custom/FormPesanan';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PaketWedding {
	id: number;
	nama_paket: string;
	deskripsi_paket: string;
	harga_paket: number;
	gambar_paket: string | null;
}

export default function KatalogPaketWeddingPage() {
	const [paketList, setPaketList] = useState<PaketWedding[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedPackage, setSelectedPackage] = useState<PaketWedding | null>(null);
	const [showOrderForm, setShowOrderForm] = useState(false);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);

	useEffect(() => {
		fetchPaketWedding();
	}, []);

	const fetchPaketWedding = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/paket-wedding');

			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}

			const result = await response.json();
			setPaketList(result.data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	const handleDialogOpenChange = (open: boolean) => {
		setDialogOpen(open);
		if (!open) {
			setSelectedPackage(null);
			setShowOrderForm(false);
		}
	};

	const handleViewDetail = (packageData: PaketWedding) => {
		setSelectedPackage(packageData);
		setShowOrderForm(false);
		setDialogOpen(true);
	};

	const handleOrderPackage = () => {
		setShowOrderForm(true);
	};

	const handleOrderSuccess = () => {
		setDialogOpen(false);
		setShowOrderForm(false);
		setShowSuccessDialog(true);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	};

	if (loading) {
		return (
			<div className="min-h-screen">
				<h1 className="text-3xl font-bold mb-6">Katalog Paket Wedding</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="h-96 rounded-lg bg-gray-200 animate-pulse"
						/>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						Error: {error}
					</div>
					<button
						onClick={fetchPaketWedding}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Coba Lagi
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<h1 className="text-3xl font-bold mb-6">Katalog Paket Wedding</h1>
			{paketList.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">Belum ada paket wedding tersedia</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{paketList.map((paket) => (
						<Card
							key={paket.id}
							price={formatCurrency(paket.harga_paket)}
							title={paket.nama_paket.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
							buttonText="Lihat Detail"
							imageUrl={paket.gambar_paket || undefined}
							imageAlt={paket.nama_paket}
							onButtonClick={() => handleViewDetail(paket)}
						/>
					))}
				</div>
			)}

			<Dialog
				open={dialogOpen}
				onOpenChange={handleDialogOpenChange}
			>
				<DialogContent className="!max-w-5xl !w-full max-h-[80vh] overflow-y-auto">
					<DialogHeader className="mb-1">
						<DialogTitle className="text-xl">
							{showOrderForm ? 'Form Pemesanan' : 'Detail Paket Wedding'}
						</DialogTitle>
					</DialogHeader>

					{selectedPackage && (
						<div className="space-y-6">
							{!showOrderForm ? (
								<>
									{selectedPackage.gambar_paket && (
										<div>
											<div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
												<Image
													src={selectedPackage.gambar_paket}
													alt={selectedPackage.nama_paket}
													fill
													className="object-cover"
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												/>
											</div>
										</div>
									)}
									<div>
										<h3 className="text-2xl font-semibold mb-1">
											{selectedPackage.nama_paket
												.toLowerCase()
												.replace(/\b\w/g, (char) => char.toUpperCase())}
										</h3>
										<p className="text-base font-medium">
											{formatCurrency(selectedPackage.harga_paket)}
										</p>
									</div>
									<div>
										<h4 className="font-medium mb-2">Deskripsi:</h4>
										<div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
											{selectedPackage.deskripsi_paket}
										</div>
									</div>
									<Button
										className="cursor-pointer"
										onClick={handleOrderPackage}
									>
										Pesan Paket
									</Button>
								</>
							) : (
								<FormPesanan
									selectedPackage={selectedPackage}
									onSuccess={handleOrderSuccess}
									onBack={() => setShowOrderForm(false)}
									formatCurrency={formatCurrency}
								/>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
			<Dialog
				open={showSuccessDialog}
				onOpenChange={setShowSuccessDialog}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="text-center">Pesanan Berhasil!</DialogTitle>
					</DialogHeader>

					<div className="text-center space-y-4 py-4">
						<div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
							<CheckCircle className="h-8 w-8 text-green-600" />
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-2">Terima kasih!</h3>
							<p className="text-gray-600 text-sm leading-relaxed">
								Pesanan Anda telah berhasil dikirim. Tim kami akan menghubungi Anda dalam waktu 1x24 jam
								untuk konfirmasi lebih lanjut.
							</p>
						</div>

						<div className="bg-blue-50 p-4 rounded-lg">
							<p className="text-blue-800 text-sm font-medium">
								Pastikan nomor telepon dan email Anda aktif
							</p>
						</div>

						<Button
							onClick={() => setShowSuccessDialog(false)}
							className="w-full cursor-pointer"
						>
							Tutup
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
