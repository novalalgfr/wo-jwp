'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const navItems = [
		{ title: 'Home', href: '/' },
		{ title: 'Catalog', href: '/catalog' },
		{ title: 'Contact Us', href: '/contact-us' }
	];

	return (
		<nav className="w-full">
			<div className="max-w-[1720px] mx-auto px-4 md:px-6 lg:px-8 my-6">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<div className="flex items-center space-x-4">
						<Link
							href="/"
							className="font-black text-2xl"
						>
							W.
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						<NavigationMenu>
							<NavigationMenuList>
								{/* Regular Nav Items */}
								{navItems.map((item) => {
									const isActive = pathname === item.href;

									return (
										<NavigationMenuItem key={item.title}>
											<NavigationMenuLink asChild>
												<Link
													href={item.href}
													className={cn(
														'inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm text-black transition-all !bg-transparent',
														isActive
															? 'font-bold text-primary'
															: 'text-gray-600 hover:text-black transition-colors'
													)}
												>
													{item.title}
												</Link>
											</NavigationMenuLink>
										</NavigationMenuItem>
									);
								})}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<Sheet
							open={isOpen}
							onOpenChange={setIsOpen}
						>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
								>
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent
								side="right"
								className="w-80"
							>
								<SheetHeader>
									<SheetTitle className="font-black text-2xl">W.</SheetTitle>
								</SheetHeader>
								<div className="flex flex-col p-6">
									<div className="space-y-2">
										{navItems.map((item) => {
											const isActive = pathname === item.href;

											return (
												<Link
													key={item.title}
													href={item.href}
													onClick={() => setIsOpen(false)}
													className={cn(
														'flex items-center rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 hover:bg-white/60 hover:backdrop-blur-sm border border-transparent hover:border-white/20 hover:shadow-sm',
														isActive
															? 'text-primary bg-black text-white font-semibold ring-1 ring-white/20'
															: 'text-gray-700 hover:text-black'
													)}
												>
													{item.title}
												</Link>
											);
										})}
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</nav>
	);
}
