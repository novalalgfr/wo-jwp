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
			<div className="space-y-12">
				<div className="grid grid-cols-3 gap-6">
					<div className="h-[700px] bg-gray-200 rounded animate-pulse"></div>
					<div className="h-[700px] bg-gray-200 rounded animate-pulse"></div>
					<div className="h-[700px] bg-gray-200 rounded animate-pulse"></div>
				</div>
				<div className="grid grid-cols-2 gap-6">
					<div className="h-[200px] bg-gray-200 rounded animate-pulse"></div>
					<div className="h-[200px] bg-gray-200 rounded animate-pulse"></div>
				</div>
			</div>
		);
	}

	return (
		<section className="space-y-12">
			<div className="grid grid-cols-3 gap-6">
				<div
					className="h-[700px] rounded-4xl flex flex-col justify-between p-6 bg-cover bg-bottom"
					style={{ backgroundImage: `url('${data?.hero_image_1}')` }}
				>
					<p className="ml-auto text-base text-white border border-white rounded-full px-6 py-2">
						{data?.hero_badge_text}
					</p>
					<p className="text-lg text-white">{data?.hero_description}</p>
				</div>
				<div className="shadow-sm rounded-4xl p-16 text-center flex flex-col gap-6 justify-center items-center">
					<h1 className="text-5xl w-[60%]">{data?.hero_title}</h1>
					<p>{data?.hero_subtitle}</p>
					<div className="flex items-center shadow-sm rounded-full">
						<Button className="bg-[#F6F4F0] text-base hover:bg-[#F6F4F0] text-black rounded-full p-6 pr-12 cursor-pointer">
							{data?.hero_cta_text}
						</Button>
						<Button
							size="icon"
							className="w-[48px] h-[48px] rounded-full -ml-10 cursor-pointer"
						>
							<MoveUpRight
								className="size-5"
								strokeWidth={1.5}
							/>
						</Button>
					</div>
				</div>
				<div
					className="bg-gray-300 h-[700px] rounded-4xl bg-cover bg-center"
					style={{ backgroundImage: `url('${data?.hero_image_2}')` }}
				></div>
			</div>
			<div className="grid grid-cols-[60%_auto] gap-6 items-center">
				<div className="bg-[#F6F4F0] shadow-sm rounded-full p-8 flex items-center gap-6">
					<h4 className="text-xl text-nowrap font-semibold">What Our Couples Say:</h4>
					<p className="text-base">
						<span className="italic">&apos;{data?.testimonial_text}&apos;</span>
						<span className="font-semibold"> - {data?.testimonial_author}</span>
					</p>
				</div>
				<div>
					<h6 className="text-xl">{data?.about_description}</h6>
				</div>
			</div>
			<div className="grid grid-cols-[60%_auto] gap-6 items-center">
				<div className="grid grid-cols-3 gap-6">
					<div
						className="bg-gray-300 w-full h-[276px] rounded-4xl bg-cover bg-center"
						style={{ backgroundImage: `url('${data?.gallery_image_1}')` }}
					></div>
					<div className="shadow-sm rounded-4xl p-8 text-center flex flex-col justify-between items-center h-[276px]">
						<div className="flex-1 flex items-center">
							<p className="text-lg">{data?.aesthetic_text}</p>
						</div>
						<Button className="bg-white hover:bg-white text-black border border-1 rounded-full cursor-pointer">
							{data?.gallery_cta_text} <MoveUpRight />
						</Button>
					</div>
					<div className="bg-[#F6F4F0] shadow-sm rounded-4xl p-8 text-center flex flex-col justify-between items-center h-[276px]">
						<div className="flex-1 flex items-center">
							<h6 className="text-4xl">{data?.satisfied_couples_count}+</h6>
						</div>
						<p className="text-lg">Satisfied couples</p>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-6">
					<div className="shadow-sm rounded-full p-6 text-lg">{data?.service_1_title}</div>
					<div className="shadow-sm rounded-full p-6 text-lg">{data?.service_2_title}</div>
					<div className="shadow-sm rounded-full p-6 text-lg">{data?.service_3_title}</div>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-6">
				<div
					className="bg-gray-900 rounded-4xl grid grid-cols-1 gap-6 p-10 bg-cover bg-center"
					style={{ backgroundImage: `url('${data?.gallery_image_2}')` }}
				>
					<div className="bg-white/50 text-white rounded-full p-6 text-lg">{data?.process_step_1}</div>
					<div className="bg-white/50 text-white rounded-full p-6 text-lg">{data?.process_step_2}</div>
					<div className="bg-white/50 text-white rounded-full p-6 text-lg">{data?.process_step_3}</div>
					<div className="bg-white/50 text-white rounded-full p-6 text-lg">{data?.process_step_4}</div>
					<div className="bg-white/50 text-white rounded-full p-6 text-lg">{data?.process_step_5}</div>
					<div className="text-base text-white mt-24">{data?.process_description}</div>
				</div>
				<div className="grid grid-cols-1 gap-6">
					<div
						className="bg-gray-300 h-[350px] rounded-4xl bg-cover bg-center"
						style={{ backgroundImage: `url('${data?.gallery_image_3}')` }}
					></div>
					<div className="w-full h-[300px] bg-transparent rounded-4xl flex items-center justify-center">
						<div className="flex -space-x-42">
							<div className="w-[350px] h-[350px] shadow-sm rounded-full flex items-center justify-center bg-white">
								<Button
									size="icon"
									className="w-[64px] h-[64px] rounded-full mr-32 cursor-pointer"
								>
									<MoveUpRight
										className="size-7"
										strokeWidth={1.5}
									/>
								</Button>
							</div>
							<div className="bg-[#F6F4F0] w-[350px] h-[350px] shadow-sm rounded-full flex flex-col items-center justify-center">
								<h6 className="text-6xl mb-1">{data?.portfolio_projects_count}+</h6>
								<p className="text-lg">projects in portfolio</p>
							</div>
						</div>
					</div>
				</div>
				<div
					className="bg-gray-300 h-[748px] rounded-4xl bg-cover bg-center"
					style={{ backgroundImage: `url('${data?.gallery_image_4}')` }}
				></div>
			</div>
			<div className="grid grid-cols-3 items-center">
				<div className="text-5xl w-[70%]">{data?.bottom_title}</div>
				<div className="col-span-2 shadow-sm rounded-4xl p-6 text-lg">{data?.bottom_description}</div>
			</div>
			<div className="grid grid-cols-3 gap-6">
				<div
					className="row-span-2 bg-gray-300 h-full rounded-4xl bg-cover bg-center"
					style={{ backgroundImage: `url('${data?.gallery_image_5}')` }}
				></div>
				<div
					className="bg-gray-300 h-[300px] rounded-4xl bg-cover bg-center"
					style={{ backgroundImage: `url('${data?.gallery_image_6}')` }}
				></div>
				<div
					className="row-span-2 bg-gray-300 h-full rounded-4xl bg-cover bg-center"
					style={{ backgroundImage: `url('${data?.gallery_image_7}')` }}
				></div>
				<div
					className="bg-gray-300 h-[300px] rounded-4xl bg-cover bg-center"
					style={{ backgroundImage: `url('${data?.gallery_image_8}')` }}
				></div>
			</div>
		</section>
	);
}
