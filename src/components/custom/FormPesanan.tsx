'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import TextBox from './TextBox';

interface PaketWedding {
	id: number;
	nama_paket: string;
	deskripsi_paket: string;
	harga_paket: number;
	gambar_paket: string | null;
}

interface PesananFormData {
	nama_pemesan: string;
	no_telp: string;
	email: string;
}

interface FormPesananProps {
	selectedPackage: PaketWedding;
	onSuccess: () => void;
	onBack: () => void;
	formatCurrency: (amount: number) => string;
}

const FormPesanan = ({ selectedPackage, onSuccess, onBack, formatCurrency }: FormPesananProps) => {
	const [formData, setFormData] = useState<PesananFormData>({
		nama_pemesan: '',
		no_telp: '',
		email: ''
	});
	const [submitting, setSubmitting] = useState(false);

	const resetForm = () => {
		setFormData({
			nama_pemesan: '',
			no_telp: '',
			email: ''
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		if (!selectedPackage) return;

		setSubmitting(true);

		const submitFormData = new FormData();
		submitFormData.append('paket_id', selectedPackage.id.toString());
		submitFormData.append('nama_pemesan', formData.nama_pemesan);
		submitFormData.append('no_telp', formData.no_telp);
		submitFormData.append('email', formData.email);

		try {
			const response = await fetch('/api/pesanan', {
				method: 'POST',
				body: submitFormData
			});

			const result = await response.json();

			if (response.ok) {
				resetForm();
				onSuccess();
			} else {
				alert(result.message || 'Terjadi kesalahan');
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('Terjadi kesalahan');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<div className="mb-4">
				<h4>
					Paket yang dipilih:{' '}
					<span className="font-semibold">
						{selectedPackage.nama_paket.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
					</span>
				</h4>
				<p className="text-green-600 font-medium">{formatCurrency(selectedPackage.harga_paket)}</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-6"
			>
				<TextBox
					id="nama_pemesan"
					label="Nama Pemesan"
					placeholder="Masukkan nama lengkap"
					validation="text"
					value={formData.nama_pemesan}
					onChange={(e) => setFormData((prev) => ({ ...prev, nama_pemesan: e.target.value }))}
					required
				/>

				<TextBox
					id="no_telp"
					label="Nomor Telepon"
					placeholder="Masukkan nomor telepon"
					validation="number"
					value={formData.no_telp}
					onChange={(e) => setFormData((prev) => ({ ...prev, no_telp: e.target.value }))}
					required
				/>

				<TextBox
					id="email"
					label="Email"
					placeholder="Masukkan email"
					validation="text"
					value={formData.email}
					onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
					required
				/>

				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						className="cursor-pointer"
						disabled={submitting}
					>
						Kembali
					</Button>
					<Button
						type="submit"
						className="cursor-pointer"
						disabled={submitting}
					>
						{submitting ? 'Memproses...' : 'Kirim Pesanan'}
					</Button>
				</div>
			</form>
		</>
	);
};

export default FormPesanan;
