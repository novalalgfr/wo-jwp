import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

interface CardProps {
	price: string;
	title: string;
	buttonText: string;
	imageUrl?: string;
	imageAlt?: string;
	// onButtonClick?: () => void;
	className?: string;
}

const Card = ({
	price,
	title,
	buttonText,
	imageUrl,
	imageAlt = 'Card image',
	// onButtonClick,
	className = ''
}: CardProps) => {
	// const handleButtonClick = (e: React.MouseEvent) => {
	// 	e.stopPropagation();
	// 	onButtonClick?.();
	// };

	return (
		<div className={`cursor-pointer ${className}`}>
			<div className="h-72 rounded-md mb-3 overflow-hidden relative">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={imageAlt}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				) : (
					<div className="bg-gray-300 w-full h-full"></div>
				)}
			</div>
			<h6 className="text-base font-medium">{price}</h6>
			<h1 className="text-lg font-semibold mb-4">{title}</h1>
			<Button
				className="cursor-pointer rounded"
				// onClick={handleButtonClick}
			>
				{buttonText}
			</Button>
		</div>
	);
};

export default Card;
