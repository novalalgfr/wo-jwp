'use client';

import Card from '@/components/custom/Card';
import ImageUpload from '@/components/custom/ImageUpload';
import { useState } from 'react';

export default function Home() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	return (
		<section>
			<div className="bg-gray-300 w-full h-[500px] rounded-lg mb-16"></div>
			<div>
				<h1 className="text-5xl font-bold text-center mb-8">Lorem Ipsum Dolor Sit Amet</h1>
				<h1 className="text-base/8 text-center w-[80%] mx-auto">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
					et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
					cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
					culpa qui officia deserunt mollit anim id est laborum.
				</h1>
			</div>
			<div className="my-96 h-full">
				<ImageUpload
					label="Upload Foto Profil"
					id="profile-photo"
					value={selectedFile}
					onChange={setSelectedFile}
					maxSize={2}
					previewHeight="h-96"
					required
				/>
			</div>
		</section>
	);
}
