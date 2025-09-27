'use client';

import { Button } from '@/components/ui/button';
import { MoveUpRight } from 'lucide-react';
import { WebsiteProfileData } from './admin/website-profile/page';
import { useEffect, useState } from 'react';

export default function Home() {
	const [profileData, setProfileData] = useState<WebsiteProfileData | null>(null);
	const [loading, setLoading] = useState(true);

	const data = profileData;

	useEffect(() => {
		loadProfileData();
	}, []);

	const loadProfileData = async () => {
		try {
			const response = await fetch('/api/website-profile');
			if (response.ok) {
				const result = await response.json();
				if (result.data) {
					setProfileData(result.data);
				}
			}
		} catch (error) {
			console.error('Error loading profile data:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-8 md:space-y-12">
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
					<div className="h-[400px] md:h-[500px] xl:h-[700px] bg-gray-200 rounded-lg md:rounded-2xl xl:rounded-4xl animate-pulse"></div>
					<div className="h-[400px] md:h-[500px] xl:h-[700px] bg-gray-200 rounded-lg md:rounded-2xl xl:rounded-4xl animate-pulse"></div>
					<div className="h-[400px] md:h-[500px] xl:h-[700px] bg-gray-200 rounded-lg md:rounded-2xl xl:rounded-4xl animate-pulse md:col-span-2 xl:col-span-1"></div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
					<div className="h-[120px] md:h-[200px] bg-gray-200 rounded-lg md:rounded-2xl animate-pulse"></div>
					<div className="h-[120px] md:h-[200px] bg-gray-200 rounded-lg md:rounded-2xl animate-pulse"></div>
				</div>
			</div>
		);
	}

	return (
		<section className="space-y-8 md:space-y-12">
			{/* Hero Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
				<div
					className="h-[400px] md:h-[500px] xl:h-[700px] rounded-lg md:rounded-2xl xl:rounded-4xl flex flex-col justify-between p-4 md:p-6 bg-cover bg-bottom order-1 md:order-1"
					style={{ backgroundImage: `url('${data?.hero_image_1}')` }}
				>
					<p className="ml-auto text-sm md:text-base text-white border border-white rounded-full px-4 md:px-6 py-1 md:py-2 text-center">
						{data?.hero_badge_text}
					</p>
					<p className="text-base md:text-lg text-white">{data?.hero_description}</p>
				</div>

				<div className="shadow-sm rounded-lg md:rounded-2xl xl:rounded-4xl p-6 md:p-12 xl:p-16 text-center flex flex-col gap-4 md:gap-6 justify-center items-center order-3 md:order-2">
					<h1 className="text-2xl md:text-3xl xl:text-5xl w-full md:w-[80%] xl:w-[60%] leading-tight">
						{data?.hero_title}
					</h1>
					<p className="text-sm md:text-base">{data?.hero_subtitle}</p>
					<div className="flex items-center shadow-sm rounded-full">
						<Button className="bg-[#F6F4F0] text-sm md:text-base hover:bg-[#F6F4F0] text-black rounded-full p-4 md:p-6 pr-8 md:pr-12 cursor-pointer">
							{data?.hero_cta_text}
						</Button>
						<Button
							size="icon"
							className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full -ml-8 md:-ml-10 cursor-pointer"
						>
							<MoveUpRight
								className="size-4 md:size-5"
								strokeWidth={1.5}
							/>
						</Button>
					</div>
				</div>

				<div
					className="bg-gray-300 h-[400px] md:h-[500px] xl:h-[700px] rounded-lg md:rounded-2xl xl:rounded-4xl bg-cover bg-center order-2 md:order-3 md:col-span-2 xl:col-span-1"
					style={{ backgroundImage: `url('${data?.hero_image_2}')` }}
				></div>
			</div>

			{/* Testimonial & About Section */}
			<div className="grid grid-cols-1 lg:grid-cols-[60%_auto] gap-6 items-start lg:items-center">
				<div className="bg-[#F6F4F0] shadow-sm rounded-full p-4 md:p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
					<h4 className="text-lg md:text-xl text-nowrap font-semibold">What Our Couples Say:</h4>
					<p className="text-sm md:text-base">
						<span className="italic">&apos;{data?.testimonial_text}&apos;</span>
						<span className="font-semibold"> - {data?.testimonial_author}</span>
					</p>
				</div>
				<div className="order-first lg:order-last">
					<h6 className="text-lg md:text-xl">{data?.about_description}</h6>
				</div>
			</div>

			{/* Gallery & Services Section */}
			<div className="grid grid-cols-1 lg:grid-cols-[60%_auto] gap-6 items-start">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
					<div
						className="bg-gray-300 w-full h-[200px] md:h-[276px] rounded-lg md:rounded-2xl xl:rounded-4xl bg-cover bg-center"
						style={{ backgroundImage: `url('${data?.gallery_image_1}')` }}
					></div>
					<div className="shadow-sm rounded-lg md:rounded-2xl xl:rounded-4xl p-6 md:p-8 text-center flex flex-col justify-between items-center h-[200px] md:h-[276px]">
						<div className="flex-1 flex items-center">
							<p className="text-base md:text-lg">{data?.aesthetic_text}</p>
						</div>
						<Button className="bg-white hover:bg-white text-black border border-1 rounded-full cursor-pointer text-sm md:text-base">
							{data?.gallery_cta_text} <MoveUpRight className="ml-1 size-4" />
						</Button>
					</div>
					<div className="bg-[#F6F4F0] shadow-sm rounded-lg md:rounded-2xl xl:rounded-4xl p-6 md:p-8 text-center flex flex-col justify-between items-center h-[200px] md:h-[276px]">
						<div className="flex-1 flex items-center">
							<h6 className="text-2xl md:text-4xl">{data?.satisfied_couples_count}+</h6>
						</div>
						<p className="text-base md:text-lg">Satisfied couples</p>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-4 md:gap-6 order-first lg:order-last">
					<div className="shadow-sm rounded-full p-4 md:p-6 text-base md:text-lg text-center md:text-left">
						{data?.service_1_title}
					</div>
					<div className="shadow-sm rounded-full p-4 md:p-6 text-base md:text-lg text-center md:text-left">
						{data?.service_2_title}
					</div>
					<div className="shadow-sm rounded-full p-4 md:p-6 text-base md:text-lg text-center md:text-left">
						{data?.service_3_title}
					</div>
				</div>
			</div>

			{/* Process & Portfolio Section */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
				<div
					className="bg-gray-900 rounded-lg md:rounded-2xl xl:rounded-4xl grid grid-cols-1 gap-4 md:gap-6 p-6 md:p-10 bg-cover bg-center min-h-[600px] md:min-h-[748px]"
					style={{ backgroundImage: `url('${data?.gallery_image_2}')` }}
				>
					<div className="bg-white/50 text-white rounded-full p-4 md:p-6 text-base md:text-lg">
						{data?.process_step_1}
					</div>
					<div className="bg-white/50 text-white rounded-full p-4 md:p-6 text-base md:text-lg">
						{data?.process_step_2}
					</div>
					<div className="bg-white/50 text-white rounded-full p-4 md:p-6 text-base md:text-lg">
						{data?.process_step_3}
					</div>
					<div className="bg-white/50 text-white rounded-full p-4 md:p-6 text-base md:text-lg">
						{data?.process_step_4}
					</div>
					<div className="bg-white/50 text-white rounded-full p-4 md:p-6 text-base md:text-lg">
						{data?.process_step_5}
					</div>
					<div className="text-sm md:text-base text-white mt-8 md:mt-24">{data?.process_description}</div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:gap-6">
					<div
						className="bg-gray-300 h-[250px] md:h-[350px] rounded-lg md:rounded-2xl xl:rounded-4xl bg-cover bg-center"
						style={{ backgroundImage: `url('${data?.gallery_image_3}')` }}
					></div>
					<div className="w-full h-[250px] md:h-[300px] bg-transparent rounded-lg md:rounded-2xl xl:rounded-4xl flex items-center justify-center">
						<div className="flex flex-col md:flex-row md:-space-x-42 space-y-4 md:space-y-0">
							{/* <div className="w-[250px] h-[250px] md:w-[350px] md:h-[350px] shadow-sm rounded-full flex items-center justify-center bg-white mx-auto">
								<Button
									size="icon"
									className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] rounded-full md:mr-32 cursor-pointer"
								>
									<MoveUpRight
										className="size-5 md:size-7"
										strokeWidth={1.5}
									/>
								</Button>
							</div> */}
							<div className="bg-[#F6F4F0] w-[250px] h-[250px] md:w-[350px] md:h-[350px] shadow-sm rounded-full flex flex-col items-center justify-center mx-auto">
								<h6 className="text-4xl md:text-6xl mb-1">{data?.portfolio_projects_count}+</h6>
								<p className="text-base md:text-lg text-center">projects in portfolio</p>
							</div>
						</div>
					</div>
				</div>

				<div
					className="bg-gray-300 h-[400px] md:h-[748px] rounded-lg md:rounded-2xl xl:rounded-4xl bg-cover bg-center lg:col-span-1 md:col-span-2 lg:col-start-3"
					style={{ backgroundImage: `url('${data?.gallery_image_4}')` }}
				></div>
			</div>

			{/* Bottom Section */}
			<div className="grid grid-cols-1 lg:grid-cols-3 items-start lg:items-center gap-6">
				<div className="text-2xl md:text-3xl xl:text-5xl w-full lg:w-[75%] order-2 lg:order-1">
					{data?.bottom_title}
				</div>
				<div className="lg:col-span-2 shadow-sm rounded-lg md:rounded-2xl xl:rounded-4xl p-4 md:p-6 text-base md:text-lg order-1 lg:order-2">
					{data?.bottom_description}
				</div>
			</div>

			{/* Final Gallery Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
				<div
					className="md:row-span-2 bg-gray-300 h-[300px] md:h-full min-h-[600px] rounded-lg md:rounded-2xl xl:rounded-4xl bg-cover bg-center"
					style={{ backgroundImage: `url('${data?.gallery_image_5}')` }}
				></div>
				<div
					className="bg-gray-300 h-[250px] md:h-[300px] rounded-lg md:rounded-2xl xl:rounded-4xl bg-cover bg-center"
					style={{ backgroundImage: `url('${data?.gallery_image_6}')` }}
				></div>
				<div
					className="md:row-span-2 bg-gray-300 h-[300px] md:h-full min-h-[600px] rounded-lg md:rounded-2xl xl:rounded-4xl bg-cover bg-center"
					style={{ backgroundImage: `url('${data?.gallery_image_7}')` }}
				></div>
				<div
					className="bg-gray-300 h-[250px] md:h-[300px] rounded-lg md:rounded-2xl xl:rounded-4xl bg-cover bg-center md:col-start-2"
					style={{ backgroundImage: `url('${data?.gallery_image_8}')` }}
				></div>
			</div>
		</section>
	);
}
