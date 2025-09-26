'use client';

import { House, NotepadText, ArrowLeftRight, Settings, LogOut, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';

const navItems = [
	{ title: 'Website Profile', href: '/admin/website-profile', icon: House },
	{ title: 'Package Catalog', href: '/admin/package-catalog', icon: NotepadText },
	{ title: 'Orders', href: '/admin/orders', icon: ArrowLeftRight },
	{ title: 'Settings', href: '/admin/pengaturan', icon: Settings }
];

interface SideNavbarProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function SideNavbar({ isOpen, setIsOpen }: SideNavbarProps) {
	const pathname = usePathname();

	const handleLogout = async () => {
		await signOut({ callbackUrl: '/' });
	};

	return (
		<>
			{/* Overlay untuk mobile */}
			{isOpen && (
				<div
					onClick={() => setIsOpen(false)}
					className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
					aria-hidden="true"
				></div>
			)}

			<aside
				className={`
                    w-72 h-screen bg-white text-black flex flex-col p-6 border-r border-gray-200
                    fixed top-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
                    
                    /* ===== PERUBAHAN UTAMA DI SINI ===== */
                    lg:fixed lg:translate-x-0 
                    
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
			>
				{/* Area Atas yang Bisa Scroll */}
				<div className="flex-1 overflow-y-auto pb-4">
					<div className="flex justify-between items-center mb-10">
						<Link
							href="/"
							className="font-black text-4xl"
						>
							W.
						</Link>
						<button
							onClick={() => setIsOpen(false)}
							className="p-2 rounded-full hover:bg-gray-100 lg:hidden"
							aria-label="Close sidebar"
						>
							<X size={24} />
						</button>
					</div>

					<nav className="flex flex-col gap-2">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.title}
									href={item.href}
									onClick={() => setIsOpen(false)}
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

				{/* Area Bawah yang Ter-pin */}
				<div className="pt-4 border-t border-gray-200">
					<button
						onClick={handleLogout}
						className="w-full px-5 py-3 rounded-full flex items-center gap-4 text-gray-700 hover:bg-[#F6F4F0] transition-colors cursor-pointer text-base font-medium"
					>
						<LogOut size={20} />
						Logout
					</button>
				</div>
			</aside>
		</>
	);
}
