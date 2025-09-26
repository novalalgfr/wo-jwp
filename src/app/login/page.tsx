'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false
			});

			if (result?.error) {
				setError('Invalid email or password.');
			} else {
				await getSession();
				router.push('/admin/website-profile');
			}
		} catch (err) {
			setError('An error occurred during login.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="grid min-h-screen w-full lg:grid-cols-2">
			{/* Kolom Kiri: Gambar */}
			<div
				className="hidden bg-cover bg-center lg:block"
				// Ganti dengan path gambar yang Anda inginkan
				style={{ backgroundImage: "url('/images/beranda-1.jpg')" }}
			></div>

			{/* Kolom Kanan: Form Login */}
			<div className="flex items-center justify-center bg-white p-8">
				<div className="w-full max-w-sm space-y-8">
					<div className="text-center">
						<h1 className="font-black text-5xl mb-4">W.</h1>
						<h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
						<p className="mt-2 text-gray-600">Please enter your credentials to access the admin panel.</p>
					</div>

					<form
						className="space-y-6"
						onSubmit={handleSubmit}
					>
						{error && (
							<div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
								<AlertCircle className="h-4 w-4 flex-shrink-0" />
								<span>{error}</span>
							</div>
						)}
						<div className="space-y-2">
							<Label
								htmlFor="email"
								className="text-sm font-medium text-gray-700"
							>
								Email
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="h-12"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="password"
								className="text-sm font-medium text-gray-700"
							>
								Password
							</Label>
							<Input
								id="password"
								name="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="h-12"
							/>
						</div>
						<div>
							<Button
								type="submit"
								disabled={loading}
								className="w-full h-12 bg-black text-white hover:bg-gray-800 focus-visible:ring-black cursor-pointer"
							>
								{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Login'}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
