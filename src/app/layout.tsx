import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/providers/SessionProvider';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
	title: 'Portfolio',
	description: 'A personal portfolio website built with Next.js and Tailwind CSS.'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<Providers>
					<ClientLayout>{children}</ClientLayout>
				</Providers>
			</body>
		</html>
	);
}
