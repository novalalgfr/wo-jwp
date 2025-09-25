'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Handbag, Menu } from 'lucide-react';

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const navItems = [
		{ title: 'Beranda', href: '/' },
		{ title: 'Katalog Paket Wedding', href: '/' },
		{ title: 'Kontak Kami', href: '/' }
	];

	return (
		<nav className="w-full">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<div className="flex items-center space-x-4">
						<Link
							href="/"
							className="flex items-center space-x-2 font-black text-2xl"
						>
							W.
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						<NavigationMenu>
							<NavigationMenuList>
								{/* Regular Nav Items */}
								{navItems.map((item) => (
									<NavigationMenuItem key={item.title}>
										<NavigationMenuLink asChild>
											<Link
												href={item.href}
												className="inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-all hover:opacity-70 focus:opacity-70 focus:outline-none !bg-transparent"
											>
												{item.title}
											</Link>
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					<div>
						<Handbag className="h-5 w-5" />
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
									<SheetTitle>Menu</SheetTitle>
									<SheetDescription>Navigate through our website</SheetDescription>
								</SheetHeader>
								<div className="flex flex-col space-y-4 mt-4">
									{/* Mobile Nav Items */}
									{navItems.map((item) => (
										<Link
											key={item.title}
											href={item.href}
											onClick={() => setIsOpen(false)}
											className="text-sm font-medium transition-colors hover:text-primary"
										>
											{item.title}
										</Link>
									))}

									<Separator />

									<Separator />

									{/* Mobile CTA Buttons */}
									{/* <div className="flex flex-col space-y-2">
										<Button
											variant="ghost"
											onClick={() => setIsOpen(false)}
										>
											Sign In
										</Button>
										<Button onClick={() => setIsOpen(false)}>Get Started</Button>
									</div> */}
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</nav>
	);
}
