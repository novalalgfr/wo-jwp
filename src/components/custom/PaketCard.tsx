// components/custom/PaketCard.tsx
'use client';

import { Button } from '@/components/ui/button';
import { MoveUpRight } from 'lucide-react';

interface PaketCardProps {
	title: string;
	price: string;
	imageUrl?: string;
	onButtonClick: () => void;
}

export default function PaketCard({ title, price, imageUrl, onButtonClick }: PaketCardProps) {
	return (
		<div
			className="h-[550px] rounded-4xl flex flex-col justify-between p-6 bg-cover bg-center text-white relative group overflow-hidden cursor-pointer"
			style={{ backgroundImage: `url(${imageUrl || '/images/placeholder.jpg'})` }}
			onClick={onButtonClick}
		>
			<div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 z-0"></div>

			<div className="relative z-10 w-full flex justify-end">
				<p className="text-base bg-white/20 backdrop-blur-sm border border-white/50 rounded-full px-6 py-2">
					{price}
				</p>
			</div>
			<div className="relative z-10">
				<h3 className="text-3xl font-medium mb-4">{title}</h3>
				<Button
					onClick={onButtonClick}
					className="bg-white hover:bg-gray-200 text-black rounded-full text-base !px-8 py-5 flex items-center gap-2 cursor-pointer"
				>
					View Detail
					<MoveUpRight
						className="size-5"
						strokeWidth={1.5}
					/>
				</Button>
			</div>
		</div>
	);
}
