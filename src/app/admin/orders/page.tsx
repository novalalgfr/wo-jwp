'use client';

import React, { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, CheckCircle, Download } from 'lucide-react';
import { createSortableHeader, DataTable } from '@/components/custom/DataTable';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface Order {
	id: number;
	package_id: number;
	customer_name: string;
	phone_number: string;
	email: string;
	status: 'request' | 'approved' | 'rejected';
	package_name?: string;
	created_at?: string;
}

interface StatusUpdateDialog {
	open: boolean;
	orderId: number | null;
	currentStatus: string;
	newStatus: 'approved' | 'rejected';
}

interface SuccessDialog {
	open: boolean;
	title: string;
	message: string;
	actionType: 'approved' | 'rejected';
}

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [statusDialog, setStatusDialog] = useState<StatusUpdateDialog>({
		open: false,
		orderId: null,
		currentStatus: '',
		newStatus: 'approved'
	});
	const [successDialog, setSuccessDialog] = useState<SuccessDialog>({
		open: false,
		title: '',
		message: '',
		actionType: 'approved'
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'request':
				return (
					<Badge
						variant="secondary"
						className="bg-yellow-100 text-yellow-800 border-yellow-200"
					>
						<Clock className="w-3 h-3 mr-1" />
						Request
					</Badge>
				);
			case 'approved':
				return (
					<Badge
						variant="secondary"
						className="bg-green-100 text-green-800 border-green-200"
					>
						<Check className="w-3 h-3 mr-1" />
						Approved
					</Badge>
				);
			case 'rejected':
				return (
					<Badge
						variant="secondary"
						className="bg-red-100 text-red-800 border-red-200"
					>
						<X className="w-3 h-3 mr-1" />
						Rejected
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const handleStatusUpdate = (orderId: number, currentStatus: string, newStatus: 'approved' | 'rejected') => {
		setStatusDialog({
			open: true,
			orderId,
			currentStatus,
			newStatus
		});
	};

	const confirmStatusUpdate = async () => {
		if (!statusDialog.orderId) return;

		try {
			const formData = new FormData();
			formData.append('id', statusDialog.orderId.toString());
			formData.append('status', statusDialog.newStatus);

			const response = await fetch('/api/orders', {
				method: 'PUT',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				await fetchOrders();
				setStatusDialog({ open: false, orderId: null, currentStatus: '', newStatus: 'approved' });

				setSuccessDialog({
					open: true,
					title: statusDialog.newStatus === 'approved' ? 'Order Approved!' : 'Order Rejected!',
					message:
						statusDialog.newStatus === 'approved'
							? 'The order has been successfully approved. The customer will be contacted for the next steps.'
							: 'The order has been rejected. The customer will be informed about this decision.',
					actionType: statusDialog.newStatus
				});
			} else {
				alert(result.message || 'An error occurred');
			}
		} catch (error) {
			console.error('Error updating status:', error);
			alert('An error occurred');
		}
	};

	const downloadOrdersCSV = () => {
		if (orders.length === 0) {
			alert('No orders data to download');
			return;
		}

		// Create CSV headers
		const headers = ['No', 'Customer Name', 'Wedding Package', 'Phone Number', 'Email', 'Order Date', 'Status'];

		// Convert orders data to CSV format
		const csvData = orders.map((order, index) => {
			const date = new Date(order.created_at || '');
			const formattedDate = order.created_at
				? date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID')
				: '-';
			const packageName = order.package_name
				? order.package_name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
				: '-';

			return [
				index + 1,
				order.customer_name,
				packageName,
				order.phone_number,
				order.email,
				formattedDate,
				order.status.charAt(0).toUpperCase() + order.status.slice(1)
			];
		});

		// Combine headers and data
		const allData = [headers, ...csvData];

		// Convert to CSV string
		const csvContent = allData
			.map((row) =>
				row.map((field) => (typeof field === 'string' && field.includes(',') ? `"${field}"` : field)).join(',')
			)
			.join('\n');

		// Create and download file
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);

		link.setAttribute('href', url);
		link.setAttribute('download', `orders-list-${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const columns: ColumnDef<Order>[] = [
		{
			id: 'no',
			header: 'No',
			cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>
		},
		{
			accessorKey: 'customer_name',
			header: createSortableHeader<Order>('Customer Name'),
			cell: ({ row }) => <div className="font-medium">{row.getValue('customer_name')}</div>
		},
		{
			accessorKey: 'package_name',
			header: 'Wedding Package',
			cell: ({ row }) => {
				const value = row.getValue<string>('package_name');
				return (
					<div className="font-medium">
						{value ? value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) : '-'}
					</div>
				);
			}
		},
		{
			accessorKey: 'phone_number',
			header: 'Phone Number',
			cell: ({ row }) => <div>{row.getValue('phone_number')}</div>
		},
		{
			accessorKey: 'email',
			header: 'Email',
			cell: ({ row }) => (
				<div
					className="max-w-xs truncate"
					title={row.getValue('email') as string}
				>
					{row.getValue('email')}
				</div>
			)
		},
		{
			accessorKey: 'created_at',
			header: 'Order Date',
			cell: ({ row }) => {
				const date = new Date(row.getValue('created_at') as string);
				return (
					<div className="text-sm">
						<div>{date.toLocaleDateString('id-ID')}</div>
						<div className="text-gray-500">{date.toLocaleTimeString('id-ID')}</div>
					</div>
				);
			}
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => getStatusBadge(row.getValue('status') as string)
		},
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => {
				const status = row.getValue('status') as string;
				const orderId = row.original.id;

				if (status === 'request') {
					return (
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="default"
								className="bg-green-600 hover:bg-green-700 cursor-pointer"
								onClick={() => handleStatusUpdate(orderId, status, 'approved')}
							>
								<Check className="w-4 h-4 mr-1" />
								Approve
							</Button>
							{/* Uncomment if you want reject button */}
							{/* <Button
								size="sm"
								variant="destructive"
								className="cursor-pointer"
								onClick={() => handleStatusUpdate(orderId, status, 'rejected')}
							>
								<X className="w-4 h-4 mr-1" />
								Reject
							</Button> */}
						</div>
					);
				} else {
					return (
						<div className="text-sm text-gray-500">
							{status === 'approved' ? 'Already approved' : 'Already rejected'}
						</div>
					);
				}
			}
		}
	];

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async (): Promise<void> => {
		try {
			const response = await fetch('/api/orders');
			const result = await response.json();
			setOrders(result.data || []);
		} catch (error) {
			console.error('Error fetching orders:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div>
				<div className="flex justify-between items-center mb-6">
					<div className="h-9 w-48 bg-gray-200 rounded animate-pulse"></div>
					<div className="h-9 w-32 bg-gray-200 rounded animate-pulse"></div>
				</div>
				<div className="">
					<div className="h-96 bg-gray-200 rounded animate-pulse"></div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Orders</h1>
				<Button
					onClick={downloadOrdersCSV}
					className="cursor-pointer"
					disabled={orders.length === 0}
				>
					<Download className="w-4 h-4 mr-2" />
					Download Report
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={orders}
				showColumnToggle={false}
				searchKey="customer_name"
				searchPlaceholder="Search by customer name..."
				emptyMessage="No orders found."
			/>

			<AlertDialog
				open={statusDialog.open}
				onOpenChange={(open) => setStatusDialog((prev) => ({ ...prev, open }))}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to {statusDialog.newStatus === 'approved' ? 'approve' : 'reject'} this
							order?
							<br />
							<span className="font-medium mt-2 block">
								The status will change from &quot;{statusDialog.currentStatus}&quot; to &quot;
								{statusDialog.newStatus}&quot;.
							</span>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmStatusUpdate}
							className={`cursor-pointer ${
								statusDialog.newStatus === 'approved'
									? 'bg-green-600 hover:bg-green-700'
									: 'bg-red-600 hover:bg-red-700'
							}`}
						>
							{statusDialog.newStatus === 'approved' ? 'Approve' : 'Reject'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				open={successDialog.open}
				onOpenChange={(open) => setSuccessDialog((prev) => ({ ...prev, open }))}
			>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-center">{successDialog.title}</AlertDialogTitle>
					</AlertDialogHeader>

					<div className="text-center space-y-4 py-4">
						<div
							className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
								successDialog.actionType === 'approved' ? 'bg-green-100' : 'bg-red-100'
							}`}
						>
							{successDialog.actionType === 'approved' ? (
								<CheckCircle className="h-8 w-8 text-green-600" />
							) : (
								<X className="h-8 w-8 text-red-600" />
							)}
						</div>

						<div>
							<p className="text-gray-600 text-sm leading-relaxed">{successDialog.message}</p>
						</div>

						<div
							className={`p-4 rounded-lg ${
								successDialog.actionType === 'approved' ? 'bg-green-50' : 'bg-red-50'
							}`}
						>
							<p
								className={`text-sm font-medium ${
									successDialog.actionType === 'approved' ? 'text-green-800' : 'text-red-800'
								}`}
							>
								{successDialog.actionType === 'approved'
									? '✅ Status successfully changed to "Approved"'
									: '❌ Status successfully changed to "Rejected"'}
							</p>
						</div>

						<Button
							onClick={() => setSuccessDialog((prev) => ({ ...prev, open: false }))}
							className={`w-full cursor-pointer ${
								successDialog.actionType === 'approved'
									? 'bg-green-600 hover:bg-green-700'
									: 'bg-red-600 hover:bg-red-700'
							}`}
						>
							Close
						</Button>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
