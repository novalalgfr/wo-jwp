'use client';

import { Button } from '@/components/ui/button';
import { MoveUpRight } from 'lucide-react';

export default function Home() {
	return (
		<section className="space-y-6">
			<div className="grid grid-cols-3 gap-6">
				<div className="bg-gray-300 h-[550px] rounded-4xl"></div>
				<div className="shadow-sm rounded-4xl p-16 text-center flex flex-col gap-6 justify-center items-center">
					<h1 className="text-5xl">
						Made with <br /> lots of love
					</h1>
					<p>
						From finding your perfect wedding venue, to budgeting and concept creation, to being your
						wedding day manager on your big day, we will take care of exactly whay you want us to do, so you
						can relax and enjoy your wedding
					</p>
					<div className="flex items-center">
						<Button className="bg-[#F6F4F0] text-base hover:bg-[#F6F4F0] text-black rounded-full p-6 pr-12 cursor-pointer">
							Get in touch
						</Button>
						<Button
							size="icon"
							className="w-[48px] h-[48px] rounded-full -ml-10"
						>
							<MoveUpRight
								className="size-5"
								strokeWidth={1.5}
							/>
						</Button>
					</div>
				</div>
				<div className="bg-gray-300 h-[550px] rounded-4xl"></div>
			</div>
			<div className="grid grid-cols-[60%_auto] gap-6 items-center">
				<div className="bg-[#F6F4F0] rounded-full p-8 flex items-center gap-6">
					<h4 className="text-xl text-nowrap font-semibold">What Our Couples Say:</h4>
					<p className="text-base">
						<span className="italic">
							&apos;From the beautiful decor to the seamless coordination, Bliss & Bless exceeded our
							expectations in every way. They made our dream wedding a reality.&apos;
						</span>
						<span className="font-semibold">- Raya & Juna</span>
					</p>
				</div>
				<div>
					<h6 className="text-xl">
						Planning a celebration should be a joyous journey, not a stressful one. Let us take the reins,
						so you can savor every moment leading up to your special day
					</h6>
				</div>
				<div className="grid grid-cols-3 gap-6">
					<div className="bg-gray-300 w-full h-[276px] rounded-4xl"></div>
					<div className="shadow-sm rounded-4xl p-8 text-center flex flex-col justify-between items-center h-[276px]">
						<div className="flex-1 flex items-center">
							<p className="text-lg">
								With a keen eye for aesthetics, we turn your ideas into stunning realities
							</p>
						</div>
						<Button className="bg-white hover:bg-white text-black border border-1 rounded-full cursor-pointer">
							View our gallery <MoveUpRight />
						</Button>
					</div>
					<div className="bg-[#F6F4F0] rounded-4xl p-8 text-center flex flex-col justify-between items-center h-[276px]">
						<div className="flex-1 flex items-center">
							<h6 className="text-4xl">120+</h6>
						</div>
						<p className="text-lg">Satisfied couples</p>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-6">
					<div className="shadow-sm rounded-full p-6 text-lg">01. Full Service Wedding Planning</div>
					<div className="shadow-sm rounded-full p-6 text-lg">02. A La Carte Wedding Planning</div>
					<div className="shadow-sm rounded-full p-6 text-lg">03. Month-Of Wedding Management</div>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-6">
				<div className="bg-gray-900 rounded-4xl grid grid-cols-1 gap-6 p-10">
					<div className="bg-white/70 text-white rounded-full p-6 text-lg">01. Initial Consultation</div>
					<div className="bg-white/70 text-white rounded-full p-6 text-lg">02. Planning and Design</div>
					<div className="bg-white/70 text-white rounded-full p-6 text-lg">03. Vendor Coordination</div>
					<div className="bg-white/70 text-white rounded-full p-6 text-lg">04. Final Preparations</div>
					<div className="bg-white/70 text-white rounded-full p-6 text-lg">05. The Big Day</div>
					<div className="text-base text-white mt-24">
						From the grandest elements to the tiniest touches, we pride ourselves on our meticulous
						attention to detail. Our goal is to create a seamless and memorable experience, leaving no stone
						unturned.
					</div>
				</div>
				<div className="grid grid-cols-1 gap-6">
					<div className="bg-gray-300 h-[350px] rounded-4xl"></div>
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
								<h6 className="text-6xl mb-1">180+</h6>
								<p className="text-lg">projects in portfolio</p>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-gray-300 h-[748px] rounded-4xl"></div>
			</div>
		</section>
	);
}
