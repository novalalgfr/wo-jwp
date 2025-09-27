'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone, Instagram, Facebook, MoveUpRight } from 'lucide-react';

export default function ContactUsPage() {
	const socialLinks = {
		instagram: 'https://instagram.com/',
		facebook: 'https://facebook.com/'
	};

	const contactInfo = {
		address: 'Jl. Sudirman No. 123, Jakarta Pusat 10220, Indonesia',
		phone: '+622112345678',
		phoneDisplay: '+62 21 1234 5678',
		email: 'w@weddingplanner.com'
	};

	return (
		<section className="space-y-12">
			<div className="shadow-sm rounded-4xl p-16 text-center flex flex-col items-center gap-6">
				<h1 className="text-5xl">Let&apos;s Connect</h1>
				<p className="text-lg max-w-2xl">
					We&apos;re here to help you every step of the way. Reach out through your favorite channel below to
					start the conversation.
				</p>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
				<div
					className="h-[400px] lg:h-full min-h-[500px] w-full rounded-4xl bg-cover bg-center"
					style={{ backgroundImage: "url('/images/beranda-7.jpg')" }}
				></div>
				<div className="space-y-6">
					<div className="bg-[#F6F4F0] rounded-4xl p-8 space-y-5">
						<h3 className="text-2xl font-semibold">Direct Contact</h3>
						<a
							href={`mailto:${contactInfo.email}`}
							className="flex items-center gap-4 group"
						>
							<Mail className="size-6 text-gray-700 flex-shrink-0" />
							<div>
								<h4 className="font-semibold text-lg">Email Us</h4>
								<p className="text-gray-600 group-hover:text-black transition-colors">
									{contactInfo.email}
								</p>
							</div>
						</a>
						<a
							href={`tel:${contactInfo.phone}`}
							className="flex items-center gap-4 group"
						>
							<Phone className="size-6 text-gray-700 flex-shrink-0" />
							<div>
								<h4 className="font-semibold text-lg">Call Us</h4>
								<p className="text-gray-600 group-hover:text-black transition-colors">
									{contactInfo.phoneDisplay}
								</p>
							</div>
						</a>
					</div>
					<div className="shadow-sm rounded-4xl p-8">
						<h3 className="text-2xl font-semibold mb-5">Follow Our Journey</h3>
						<div className="space-y-4">
							<Link
								href={socialLinks.instagram}
								target="_blank"
								className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-full"
							>
								<div className="flex items-center gap-3">
									<Instagram className="size-6" />
									<span className="text-lg font-medium">Instagram</span>
								</div>
								<MoveUpRight className="size-5 text-gray-500" />
							</Link>
							<Link
								href={socialLinks.facebook}
								target="_blank"
								className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-full"
							>
								<div className="flex items-center gap-3">
									<Facebook className="size-6" />
									<span className="text-lg font-medium">Facebook</span>
								</div>
								<MoveUpRight className="size-5 text-gray-500" />
							</Link>
						</div>
					</div>
					<div className="shadow-sm rounded-4xl p-8 flex items-start gap-4">
						<MapPin className="size-8 text-gray-700 mt-1 flex-shrink-0" />
						<div>
							<h4 className="font-semibold text-lg mb-1">Visit Our Office</h4>
							<p className="text-gray-600 leading-relaxed">{contactInfo.address}</p>
						</div>
					</div>
				</div>
			</div>
			<div className="h-[500px] rounded-4xl overflow-hidden shadow-sm">
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.642533039234!2d106.69083037580644!3d-6.310663261775836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69e530f242599f%3A0x8563745284752674!2sAEON%20MALL%20BSD%20CITY!5e0!3m2!1sen!2sid!4v1727360856948!5m2!1sen!2sid"
					width="100%"
					height="100%"
					style={{ border: 0 }}
					allowFullScreen={false}
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</section>
	);
}
