'use client';

// Ganti import Card dengan PaketCard yang baru
import PaketCard from '@/components/custom/PaketCard';
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

// Skeleton Loader Component
const PaketCardSkeleton = () => <div className="h-[550px] rounded-4xl bg-gray-200 animate-pulse"></div>;

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
			setError(null); // Reset error state
			const response = await fetch('/api/paket-wedding');

			if (!response.ok) {
				throw new Error('Gagal memuat data paket. Silakan coba lagi.');
			}

			const result = await response.json();
			setPaketList(result.data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga');
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
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(amount);
	};

	const formatTitle = (title: string) => {
		return title.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
	};

	if (loading) {
		return (
			<section className="space-y-12">
				<div className="shadow-sm rounded-4xl p-16 text-center">
					<h1 className="text-5xl mb-4">Pilih Paket Impian Anda</h1>
					<p className="text-lg max-w-2xl mx-auto">
						Kami telah menyiapkan berbagai pilihan paket yang dirancang dengan cermat untuk mewujudkan hari
						spesial Anda.
					</p>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{[...Array(4)].map((_, i) => (
						<PaketCardSkeleton key={i} />
					))}
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="min-h-[70vh] flex items-center justify-center">
				<div className="shadow-sm rounded-4xl p-16 text-center flex flex-col gap-6 justify-center items-center">
					<h2 className="text-3xl font-semibold">Oops! Terjadi Kesalahan</h2>
					<p className="text-lg text-gray-600">{error}</p>
					<Button
						onClick={fetchPaketWedding}
						className="bg-[#F6F4F0] text-base hover:bg-gray-200 text-black rounded-full p-6"
					>
						Coba Lagi
					</Button>
				</div>
			</section>
		);
	}

	return (
		<>
			<section className="space-y-12">
				<div className="shadow-sm rounded-4xl p-16 text-center">
					<h1 className="text-5xl mb-4">Choose Your Dream Package</h1>
					<p className="text-lg max-w-2xl mx-auto">
						We have carefully prepared a variety of packages designed to make your special day
						unforgettable.
					</p>
				</div>

				{paketList.length === 0 ? (
					<div className="text-center py-20">
						<p className="text-gray-500 text-xl">Belum ada paket wedding yang tersedia saat ini.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{paketList.map((paket) => (
							<PaketCard
								key={paket.id}
								price={formatCurrency(paket.harga_paket)}
								title={formatTitle(paket.nama_paket)}
								imageUrl={paket.gambar_paket || undefined}
								onButtonClick={() => handleViewDetail(paket)}
							/>
						))}
					</div>
				)}
				<div className="grid grid-cols-3 items-center">
					<div className="text-5xl">
						Ready to start <br /> planning?
					</div>
					<div className="col-span-2 shadow-sm rounded-4xl p-6 text-lg">
						Browse through our wedding packages and find the perfect fit for your special day. Each package
						can be customized to match your vision and budget. Click on any package to see full details and
						start your booking.
					</div>
				</div>
			</section>

			<Dialog
				open={dialogOpen}
				onOpenChange={handleDialogOpenChange}
			>
				<DialogContent className="!max-w-5xl !w-full max-h-[90vh] overflow-y-auto !rounded-4xl p-2">
					{selectedPackage && (
						<>
							{showOrderForm ? (
								<div className="p-8">
									<DialogHeader className="mb-4">
										<DialogTitle className="text-2xl">Order Form</DialogTitle>
									</DialogHeader>
									<FormPesanan
										selectedPackage={selectedPackage}
										onSuccess={handleOrderSuccess}
										onBack={() => setShowOrderForm(false)}
										formatCurrency={formatCurrency}
									/>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-4">
									<div className="relative w-full aspect-square md:aspect-[3/4] rounded-3xl overflow-hidden">
										<Image
											src={selectedPackage.gambar_paket || '/images/placeholder.jpg'}
											alt={selectedPackage.nama_paket}
											fill
											className="object-cover"
											sizes="(max-width: 768px) 100vw, 50vw"
										/>
									</div>
									<div className="py-4 pr-4 flex flex-col h-full">
										<DialogHeader>
											<DialogTitle className="text-4xl leading-tight mb-2">
												{formatTitle(selectedPackage.nama_paket)}
											</DialogTitle>
										</DialogHeader>
										<p className="text-2xl font-semibold text-gray-800 mb-6">
											{formatCurrency(selectedPackage.harga_paket)}
										</p>
										<div className="mb-8">
											<h4 className="font-semibold mb-2 text-lg">Package Description:</h4>
											<div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
												{selectedPackage.deskripsi_paket}
											</div>
										</div>

										{/* Tombol didorong ke bawah */}
										<div className="mt-auto">
											<Button
												onClick={handleOrderPackage}
												size="lg"
												className="w-full rounded-full text-base py-6 cursor-pointer"
											>
												Order This Package
											</Button>
										</div>
									</div>
								</div>
							)}
						</>
					)}
				</DialogContent>
			</Dialog>

			<Dialog
				open={showSuccessDialog}
				onOpenChange={setShowSuccessDialog}
			>
				<DialogContent className="max-w-md !rounded-4xl">
					<DialogHeader>
						<DialogTitle className="text-center text-3xl pt-4">Order Successful!</DialogTitle>
					</DialogHeader>
					<div className="text-center space-y-4 p-6">
						<div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
							<CheckCircle className="h-10 w-10 text-green-600" />
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2">Thank You!</h3>
							<p className="text-gray-600 leading-relaxed">
								Your order has been received. Our team will contact you within 1x24 hours for further
								confirmation.
							</p>
						</div>
						<div className="bg-[#F6F4F0] p-4 rounded-2xl">
							<p className="text-sm font-medium">Make sure your phone number and email are active.</p>
						</div>
						<Button
							onClick={() => setShowSuccessDialog(false)}
							className="w-full rounded-full py-6 text-base cursor-pointer"
						>
							Close
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
