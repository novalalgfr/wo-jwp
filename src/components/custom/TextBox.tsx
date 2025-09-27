import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

interface TextBoxProps {
	label: string;
	placeholder: string;
	id: string;
	type?: 'textfield' | 'textarea' | 'number';
	inputType?: 'text' | 'number' | 'password';
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
	className?: string;
	disabled?: boolean;
	required?: boolean;
	maxLength?: number;
	rows?: number;
	name?: string;
	// Validation props
	validation?: 'text' | 'number';
	min?: number;
	max?: number;
	allowDecimals?: boolean;
	onValidationChange?: (isValid: boolean, errorMessage?: string) => void;
}

const TextBox = ({
	label,
	placeholder,
	id,
	type = 'textfield',
	inputType = 'text',
	value,
	onChange,
	className = '',
	validation = 'text',
	min,
	max,
	allowDecimals = true,
	onValidationChange,
	...props
}: TextBoxProps) => {
	const [error, setError] = useState<string>('');
	const [isValid, setIsValid] = useState<boolean>(true);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const validateInput = (inputValue: string): { isValid: boolean; errorMessage?: string } => {
		if (!inputValue) {
			return { isValid: true };
		}

		switch (validation) {
			case 'text':
				// Text bisa menerima semua karakter (tidak ada pembatasan)
				return { isValid: true };

			case 'number':
				// Validasi angka
				const numberRegex = allowDecimals ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
				if (!numberRegex.test(inputValue)) {
					return {
						isValid: false,
						errorMessage: allowDecimals
							? 'Hanya angka dan desimal yang diperbolehkan'
							: 'Hanya angka yang diperbolehkan'
					};
				}

				// Validasi range jika ada
				const numValue = parseFloat(inputValue);
				if (!isNaN(numValue)) {
					if (min !== undefined && numValue < min) {
						return {
							isValid: false,
							errorMessage: `Nilai minimum adalah ${min}`
						};
					}
					if (max !== undefined && numValue > max) {
						return {
							isValid: false,
							errorMessage: `Nilai maksimum adalah ${max}`
						};
					}
				}
				break;

			default:
				return { isValid: true };
		}

		return { isValid: true };
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		const inputValue = e.target.value;

		// Validasi input
		const validationResult = validateInput(inputValue);
		setIsValid(validationResult.isValid);
		setError(validationResult.errorMessage || '');

		// Callback untuk parent component
		if (onValidationChange) {
			onValidationChange(validationResult.isValid, validationResult.errorMessage);
		}

		// Panggil onChange prop jika ada
		if (onChange) {
			onChange(e);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const baseClasses = `border-black focus-visible:ring-0 focus-visible:border-black py-2 ${
		!isValid ? 'border-red-500 focus-visible:border-red-500' : ''
	}`;

	const textFieldClasses = `${baseClasses} min-h-0`;
	const textareaClasses = `${baseClasses} min-h-32`;

	// Special classes for password field with icon
	const passwordClasses = `${textFieldClasses} ${inputType === 'password' ? 'pr-12' : ''}`;

	const getFinalClasses = () => {
		if (type === 'textarea') {
			return `${textareaClasses} ${className}`;
		} else if (inputType === 'password') {
			return `${passwordClasses} ${className}`;
		} else {
			return `${textFieldClasses} ${className}`;
		}
	};

	const getInputType = () => {
		if (inputType === 'password') {
			return showPassword ? 'text' : 'password';
		}
		return inputType;
	};

	return (
		<div className="grid w-full gap-3">
			<Label
				htmlFor={id}
				className={!isValid ? 'text-red-600' : ''}
			>
				{label}
			</Label>

			{type === 'textarea' ? (
				<Textarea
					placeholder={placeholder}
					id={id}
					value={value}
					onChange={handleChange}
					className={getFinalClasses()}
					{...props}
				/>
			) : (
				<div className="relative">
					<Input
						type={getInputType()}
						placeholder={placeholder}
						id={id}
						value={value}
						onChange={handleChange}
						className={getFinalClasses()}
						{...props}
					/>
					{inputType === 'password' && (
						<button
							type="button"
							onClick={togglePasswordVisibility}
							className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none z-20 bg-transparent"
							tabIndex={-1}
						>
							{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
					)}
				</div>
			)}

			{error && <span className="text-sm text-red-600 mt-1">{error}</span>}
		</div>
	);
};

export default TextBox;
