'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
	const navItems = [
		{ title: 'Home', href: '/' },
		{ title: 'Catalog', href: '/katalog-paket-wedding' },
		{ title: 'Contact Us', href: '/kontak-kami' }
	];

	const services = [
		{ title: 'Full Service Wedding Planning', href: '/services/full-service' },
		{ title: 'A La Carte Wedding Planning', href: '/services/a-la-carte' },
		{ title: 'Month-Of Wedding Management', href: '/services/month-of' }
	];

	return (
		<footer className="w-full mt-24">
			<div className="max-w-[1720px] mx-auto border-t-2 border-dashed py-12">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
					{/* Brand Section */}
					<div className="space-y-6">
						<div className="flex items-center space-x-2">
							<h2 className="font-black text-4xl">W.</h2>
						</div>
						<p className="text-lg text-gray-600 leading-relaxed">
							Where your dream day becomes our passion. From intimate gatherings to grand celebrations, we
							create unforgettable moments with meticulous attention to detail.
						</p>
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								size="icon"
								className="rounded-full border-gray-300 hover:bg-[#F6F4F0] cursor-pointer hover:border-gray-400"
							>
								<Instagram className="h-5 w-5" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="rounded-full border-gray-300 hover:bg-[#F6F4F0] cursor-pointer hover:border-gray-400"
							>
								<Facebook className="h-5 w-5" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="rounded-full border-gray-300 hover:bg-[#F6F4F0] cursor-pointer hover:border-gray-400"
							>
								<Mail className="h-5 w-5" />
							</Button>
						</div>
					</div>

					{/* Navigation & Services */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Quick Links */}
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">Quick Links</h3>
							<ul className="space-y-3">
								{navItems.map((item) => (
									<li key={item.title}>
										<Link
											href={item.href}
											className="text-gray-600 hover:text-black transition-colors text-base"
										>
											{item.title}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Services */}
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">Our Services</h3>
							<ul className="space-y-3">
								{services.map((service) => (
									<li key={service.title}>
										<Link
											href={service.href}
											className="text-gray-600 hover:text-black transition-colors text-base"
										>
											{service.title}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Contact Info */}
					<div className="space-y-6">
						<h3 className="text-xl font-semibold">Get In Touch</h3>
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<MapPin className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
								<p className="text-gray-600 text-base">
									Jl. Sudirman No. 123
									<br />
									Jakarta Pusat 10220
									<br />
									Indonesia
								</p>
							</div>
							<div className="flex items-center gap-3">
								<Phone className="h-5 w-5 text-gray-600 flex-shrink-0" />
								<p className="text-gray-600 text-base">+62 21 1234 5678</p>
							</div>
							<div className="flex items-center gap-3">
								<Mail className="h-5 w-5 text-gray-600 flex-shrink-0" />
								<p className="text-gray-600 text-base">w@weddingplanner.com</p>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-gray-500 text-sm">© 2025 W. Wedding Planner. All rights reserved.</p>
					<div className="flex items-center gap-6">
						<Link
							href="/privacy"
							className="text-gray-500 hover:text-black transition-colors text-sm"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="text-gray-500 hover:text-black transition-colors text-sm"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
