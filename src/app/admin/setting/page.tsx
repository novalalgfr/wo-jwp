'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TextBox from '@/components/custom/TextBox';

interface ChangePasswordFormData {
	email: string;
	current_password: string;
	new_password: string;
	confirm_password: string;
}

interface ValidationState {
	email: boolean;
	current_password: boolean;
	new_password: boolean;
	confirm_password: boolean;
}

export default function SettingPage() {
	const [formData, setFormData] = useState<ChangePasswordFormData>({
		email: '',
		current_password: '',
		new_password: '',
		confirm_password: ''
	});

	const [validation, setValidation] = useState<ValidationState>({
		email: true,
		current_password: true,
		new_password: true,
		confirm_password: true
	});

	const [passwordMatchError, setPasswordMatchError] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const handleTextChange = (field: keyof ChangePasswordFormData) => {
		return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const value = e.target.value;
			setFormData((prev) => ({
				...prev,
				[field]: value
			}));

			if (field === 'new_password' || field === 'confirm_password') {
				setPasswordMatchError('');
			}

			setMessage(null);
		};
	};

	const handleValidationChange = (field: keyof ValidationState) => {
		return (isValid: boolean, errorMessage?: string) => {
			setValidation((prev) => ({
				...prev,
				[field]: isValid
			}));
		};
	};

	const validateEmail = (email: string): { isValid: boolean; errorMessage?: string } => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email) {
			return { isValid: false, errorMessage: 'Email is required' };
		}
		if (!emailRegex.test(email)) {
			return { isValid: false, errorMessage: 'Invalid email format' };
		}
		return { isValid: true };
	};

	const validatePassword = (password: string): { isValid: boolean; errorMessage?: string } => {
		if (!password) {
			return { isValid: false, errorMessage: 'Password is required' };
		}
		if (password.length < 6) {
			return { isValid: false, errorMessage: 'Password must be at least 6 characters' };
		}
		return { isValid: true };
	};

	const checkPasswordsMatch = (): boolean => {
		if (formData.new_password && formData.confirm_password) {
			if (formData.new_password !== formData.confirm_password) {
				setPasswordMatchError('New password and confirmation password do not match');
				return false;
			}
		}
		setPasswordMatchError('');
		return true;
	};

	const validateForm = (): boolean => {
		let isFormValid = true;

		const emailValidation = validateEmail(formData.email);
		if (!emailValidation.isValid) {
			setValidation((prev) => ({ ...prev, email: false }));
			isFormValid = false;
		}

		if (!formData.current_password) {
			setValidation((prev) => ({ ...prev, current_password: false }));
			isFormValid = false;
		}

		const passwordValidation = validatePassword(formData.new_password);
		if (!passwordValidation.isValid) {
			setValidation((prev) => ({ ...prev, new_password: false }));
			isFormValid = false;
		}

		if (!formData.confirm_password) {
			setValidation((prev) => ({ ...prev, confirm_password: false }));
			isFormValid = false;
		}

		if (!checkPasswordsMatch()) {
			isFormValid = false;
		}

		return isFormValid;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			setMessage({
				type: 'error',
				text: 'Please review your input'
			});
			return;
		}

		setIsLoading(true);
		setMessage(null);

		try {
			const response = await fetch('/api/change-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: formData.email,
					current_password: formData.current_password,
					new_password: formData.new_password
				})
			});

			const result = await response.json();

			if (response.ok) {
				setMessage({
					type: 'success',
					text: 'Password changed successfully!'
				});
				setFormData({
					email: '',
					current_password: '',
					new_password: '',
					confirm_password: ''
				});
			} else {
				setMessage({
					type: 'error',
					text: result.message || 'Failed to change password'
				});
			}
		} catch (error) {
			setMessage({
				type: 'error',
				text: 'An error occurred. Please try again.'
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
			</div>
			<form
				onSubmit={handleSubmit}
				className="space-y-8"
			>
				<Card>
					<CardHeader>
						<CardTitle>Change Password</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{message && (
							<div
								className={`p-4 rounded-md ${
									message.type === 'success'
										? 'bg-green-50 text-green-800 border border-green-200'
										: 'bg-red-50 text-red-800 border border-red-200'
								}`}
							>
								{message.text}
							</div>
						)}
						<TextBox
							label="Email"
							placeholder="Enter your email"
							id="email"
							inputType="text"
							value={formData.email}
							onChange={handleTextChange('email')}
							onValidationChange={handleValidationChange('email')}
							required
						/>
						<TextBox
							label="Current Password"
							placeholder="Enter your current password"
							id="current_password"
							inputType="password"
							value={formData.current_password}
							onChange={handleTextChange('current_password')}
							onValidationChange={handleValidationChange('current_password')}
							required
						/>
						<TextBox
							label="New Password"
							placeholder="Enter new password (minimum 6 characters)"
							id="new_password"
							inputType="password"
							value={formData.new_password}
							onChange={handleTextChange('new_password')}
							onValidationChange={handleValidationChange('new_password')}
							required
						/>
						<TextBox
							label="Confirm New Password"
							placeholder="Re-enter your new password"
							id="confirm_password"
							inputType="password"
							value={formData.confirm_password}
							onChange={handleTextChange('confirm_password')}
							onValidationChange={handleValidationChange('confirm_password')}
							required
						/>
						{passwordMatchError && <span className="text-sm text-red-600">{passwordMatchError}</span>}
						<div className="pt-4">
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full md:w-auto cursor-pointer"
							>
								{isLoading ? 'Changing Password...' : 'Change Password'}
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}
