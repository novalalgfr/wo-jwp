'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { SideNavbar } from '@/components/layout/sideNavbar';
import Link from 'next/link';
import { Footer } from './footer';

const footerItems = [
	{ title: 'Instagram', href: '/' },
	{ title: 'Tiktok', href: '/' },
	{ title: 'LinkedIn', href: '/' }
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession();
	const pathname = usePathname();

	if (pathname === '/login') {
		return <>{children}</>;
	}

	const isAdmin = !!session;
	const isAdminRoute = pathname.startsWith('/admin');

	if (isAdminRoute && isAdmin) {
		return (
			<div className="flex min-h-screen">
				<SideNavbar />
				<main className="flex-1 p-6 bg-gray-50">{children}</main>
			</div>
		);
	}

	return (
		<>
			<Navbar />
			<main className="max-w-[1720px] mx-auto px-4 md:px-6 lg:px-8 my-6">{children}</main>
			<Footer />
		</>
	);
}
