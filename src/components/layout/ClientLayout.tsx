'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { SideNavbar } from '@/components/layout/sideNavbar';
import Link from 'next/link';

const footerItems = [
	{ title: 'Instagram', href: '/' },
	{ title: 'Tiktok', href: '/' },
	{ title: 'LinkedIn', href: '/' }
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession();
	const pathname = usePathname();

	// Jangan render layout untuk halaman login
	if (pathname === '/login') {
		return <>{children}</>;
	}

	const isAdmin = !!session;
	const isAdminRoute = pathname.startsWith('/admin');

	// Jika mengakses route admin tapi tidak login, middleware akan redirect ke login
	// Jadi di sini kita hanya perlu render layout sesuai kondisi

	if (isAdminRoute && isAdmin) {
		// Admin layout untuk route /admin/*
		return (
			<div className="flex min-h-screen">
				<SideNavbar />
				<main className="flex-1 p-6 bg-gray-50">{children}</main>
			</div>
		);
	}

	// User layout untuk route publik
	return (
		<>
			<Navbar />
			<main className="max-w-7xl mx-auto my-6">{children}</main>
			<footer>
				<div className="max-w-[112rem] mx-auto px-4 py-12 border-t-2 border-dashed flex justify-between items-center">
					<Link
						href="/"
						className="flex items-center space-x-2 font-black text-2xl"
					>
						W.
					</Link>
					<div className="flex gap-4">
						<p className="text-sm text-gray-900 font-semibold">Connect :</p>
						{footerItems.map((item) => (
							<Link
								key={item.title}
								href={item.href}
								className="text-sm font-medium transition-all hover:opacity-70 focus:opacity-70 focus:outline-none"
							>
								{item.title}
							</Link>
						))}
					</div>
				</div>
			</footer>
		</>
	);
}
