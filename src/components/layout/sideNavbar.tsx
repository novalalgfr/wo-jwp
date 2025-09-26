'use client';

import { House, NotepadText, ArrowLeftRight, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navItems = [
	{ title: 'Website Profile', href: '/admin/profil-website', icon: House },
	{ title: 'Package Catalog', href: '/admin/package-catalog', icon: NotepadText },
	{ title: 'Orders', href: '/admin/orders', icon: ArrowLeftRight },
	{ title: 'Settings', href: '/admin/pengaturan', icon: Settings }
];

export function SideNavbar() {
	const pathname = usePathname();

	const handleLogout = async () => {
		await signOut({
			callbackUrl: '/'
		});
	};

	return (
		<aside className="w-72 h-screen bg-white text-black flex flex-col justify-between p-6 border-r border-gray-200">
			<div className="flex flex-col gap-10">
				{/* Logo */}
				<Link
					href="/"
					className="flex items-center space-x-2 font-black text-4xl"
				>
					W.
				</Link>

				{/* Navigation */}
				<nav className="flex flex-col gap-2">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;

						return (
							<Link
								key={item.title}
								href={item.href}
								className={`
                                    px-5 py-3 rounded-full flex items-center gap-4 transition-colors text-base font-medium
                                    ${isActive ? 'bg-black text-white' : 'hover:bg-[#F6F4F0] text-gray-700'}
                                `}
							>
								<Icon size={20} />
								{item.title}
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Logout Button */}
			<div>
				<button
					onClick={handleLogout}
					className="w-full px-5 py-3 rounded-full flex items-center gap-4 text-gray-700 hover:bg-[#F6F4F0] transition-colors cursor-pointer text-base font-medium"
				>
					<LogOut size={20} />
					Logout
				</button>
			</div>
		</aside>
	);
}
