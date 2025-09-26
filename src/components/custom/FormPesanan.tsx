'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import TextBox from './TextBox';

interface WeddingPackage {
	id: number;
	package_name: string;
	package_description: string;
	package_price: number;
	package_image: string | null;
}

interface OrderFormData {
	customer_name: string;
	phone_number: string;
	email: string;
}

interface OrderFormProps {
	selectedPackage: WeddingPackage;
	onSuccess: () => void;
	onBack: () => void;
	formatCurrency: (amount: number) => string;
}

const OrderForm = ({ selectedPackage, onSuccess, onBack, formatCurrency }: OrderFormProps) => {
	const [formData, setFormData] = useState<OrderFormData>({
		customer_name: '',
		phone_number: '',
		email: ''
	});
	const [submitting, setSubmitting] = useState(false);

	const resetForm = () => {
		setFormData({
			customer_name: '',
			phone_number: '',
			email: ''
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		if (!selectedPackage) return;

		setSubmitting(true);

		const submitFormData = new FormData();
		submitFormData.append('package_id', selectedPackage.id.toString());
		submitFormData.append('customer_name', formData.customer_name);
		submitFormData.append('phone_number', formData.phone_number);
		submitFormData.append('email', formData.email);

		try {
			const response = await fetch('/api/orders', {
				method: 'POST',
				body: submitFormData
			});

			const result = await response.json();

			if (response.ok) {
				resetForm();
				onSuccess();
			} else {
				alert(result.message || 'An error occurred');
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('An error occurred');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<div className="mb-4">
				<h4>
					Selected Package:{' '}
					<span className="font-semibold">
						{selectedPackage.package_name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
					</span>
				</h4>
				<p className="text-green-600 font-medium">{formatCurrency(selectedPackage.package_price)}</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-6"
			>
				<TextBox
					id="customer_name"
					label="Full Name"
					placeholder="Enter your full name"
					validation="text"
					value={formData.customer_name}
					onChange={(e) => setFormData((prev) => ({ ...prev, customer_name: e.target.value }))}
					required
				/>

				<TextBox
					id="phone_number"
					label="Phone Number"
					placeholder="Enter your phone number"
					validation="number"
					value={formData.phone_number}
					onChange={(e) => setFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
					required
				/>

				<TextBox
					id="email"
					label="Email"
					placeholder="Enter your email"
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
						Back
					</Button>
					<Button
						type="submit"
						className="cursor-pointer"
						disabled={submitting}
					>
						{submitting ? 'Processing...' : 'Submit Order'}
					</Button>
				</div>
			</form>
		</>
	);
};

export default OrderForm;
