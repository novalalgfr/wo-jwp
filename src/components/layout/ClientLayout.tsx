'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { SideNavbar } from '@/components/layout/sideNavbar';
import { Footer } from './footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession();
	const pathname = usePathname();

	const [isSidebarOpen, setSidebarOpen] = useState(false);

	if (pathname === '/login') {
		return <>{children}</>;
	}

	const isAdmin = !!session;
	const isAdminRoute = pathname.startsWith('/admin');

	if (isAdminRoute && isAdmin) {
		return (
			<div className="flex min-h-screen bg-gray-50">
				<SideNavbar
					isOpen={isSidebarOpen}
					setIsOpen={setSidebarOpen}
				/>
				<main className="flex-1 lg:ml-72">
					<div className="p-4 border-b border-gray-200 lg:hidden">
						<button
							onClick={() => setSidebarOpen(true)}
							className="p-2 rounded-md text-gray-700 hover:bg-gray-200"
							aria-label="Open sidebar"
						>
							<Menu size={24} />
						</button>
					</div>
					<div className="p-6">{children}</div>
				</main>
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
