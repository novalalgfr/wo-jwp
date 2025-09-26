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
			<main className="max-w-[1720px] mx-auto my-6">{children}</main>
			<footer>
				<div className="max-w-[1720px] mx-auto px-4 py-12 border-t-2 border-dashed flex justify-between items-center">
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
