'use client';

import { House, NotepadText, ArrowLeftRight, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navItems = [
	{ title: 'Profil Website', href: '/admin/profil-website', icon: House },
	{ title: 'Katalog Paket', href: '/admin/katalog-paket', icon: NotepadText },
	{ title: 'Pesanan', href: '/admin/pesanan', icon: ArrowLeftRight },
	{ title: 'Pengaturan', href: '/admin/pengaturan', icon: Settings }
];

export function SideNavbar() {
	const pathname = usePathname();

	const handleLogout = async () => {
		await signOut({
			callbackUrl: '/'
		});
	};

	return (
		<div className="w-72 h-screen bg-[#F4EDE9] text-black flex flex-col justify-between p-6">
			<div className="flex flex-col gap-8">
				<Link
					href="/"
					className="flex items-center space-x-2 font-black text-4xl"
				>
					W.
				</Link>
				<nav className="flex flex-col gap-1">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;

						return (
							<Link
								key={item.title}
								href={item.href}
								className={`px-4 py-3 rounded-md flex items-center gap-4 transition-colors ${
									isActive ? 'bg-[#DFCFC6]' : 'bg-[#F4EDE9] hover:bg-[#DFCFC6]'
								}`}
							>
								<Icon size={20} />
								{item.title}
							</Link>
						);
					})}
				</nav>
			</div>

			<div>
				<a
					onClick={handleLogout}
					className="px-4 py-3 rounded-md flex items-center gap-4 hover:bg-[#DFCFC6] transition-colors cursor-pointer"
				>
					<LogOut size={20} />
					Logout
				</a>
			</div>
		</div>
	);
}
