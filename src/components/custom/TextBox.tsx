import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

interface TextBoxProps {
	label: string;
	placeholder: string;
	id: string;
	type?: 'textfield' | 'textarea';
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	className?: string;
	disabled?: boolean;
	required?: boolean;
	maxLength?: number;
	rows?: number;
	name?: string;
}

const TextBox = ({
	label,
	placeholder,
	id,
	type = 'textfield',
	value,
	onChange,
	className = '',
	...props
}: TextBoxProps) => {
	const baseClasses = 'border-black focus-visible:ring-0 focus-visible:border-black py-2';
	const textFieldClasses = `${baseClasses} min-h-0 resize-none`;
	const textareaClasses = `${baseClasses} min-h-32`;
	const finalClasses = type === 'textarea' ? `${textareaClasses} ${className}` : `${textFieldClasses} ${className}`;

	return (
		<div className="grid w-full gap-3">
			<Label htmlFor={id}>{label}</Label>
			<Textarea
				placeholder={placeholder}
				id={id}
				value={value}
				onChange={onChange}
				className={finalClasses}
				{...props}
			/>
		</div>
	);
};

export default TextBox;
