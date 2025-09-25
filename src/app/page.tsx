'use client';

import { createActionColumn, createSortableHeader, DataTable } from '@/components/custom/DataTable';
import ImageUpload from '@/components/custom/ImageUpload';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type User = {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'user';
	status: 'active' | 'inactive';
};

export default function Home() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const users: User[] = [
		{ id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
		{ id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
		{ id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive' },
		{ id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'admin', status: 'active' },
		{ id: '5', name: 'Charlie Davis', email: 'charlie@example.com', role: 'user', status: 'active' },
		{ id: '6', name: 'Diana Wilson', email: 'diana@example.com', role: 'user', status: 'inactive' },
		{ id: '7', name: 'Eva Miller', email: 'eva@example.com', role: 'admin', status: 'active' },
		{ id: '8', name: 'Frank Moore', email: 'frank@example.com', role: 'user', status: 'active' },
		{ id: '9', name: 'Grace Taylor', email: 'grace@example.com', role: 'user', status: 'inactive' },
		{ id: '10', name: 'Henry Anderson', email: 'henry@example.com', role: 'admin', status: 'active' },
		{ id: '11', name: 'Ivy Thomas', email: 'ivy@example.com', role: 'user', status: 'active' },
		{ id: '12', name: 'Jack Jackson', email: 'jack@example.com', role: 'user', status: 'active' },
		{ id: '13', name: 'Kate White', email: 'kate@example.com', role: 'admin', status: 'inactive' },
		{ id: '14', name: 'Leo Harris', email: 'leo@example.com', role: 'user', status: 'active' },
		{ id: '15', name: 'Mia Martin', email: 'mia@example.com', role: 'user', status: 'active' },
		{ id: '16', name: 'Noah Thompson', email: 'noah@example.com', role: 'admin', status: 'active' },
		{ id: '17', name: 'Olivia Garcia', email: 'olivia@example.com', role: 'user', status: 'inactive' },
		{ id: '18', name: 'Paul Martinez', email: 'paul@example.com', role: 'user', status: 'active' },
		{ id: '19', name: 'Quinn Robinson', email: 'quinn@example.com', role: 'admin', status: 'active' },
		{ id: '20', name: 'Ruby Clark', email: 'ruby@example.com', role: 'user', status: 'active' }
	];

	const handleEdit = (id: string, name: string) => {
		console.log('Edit user:', { id, name });
	};

	const handleDelete = (id: string, name: string) => {
		console.log('Delete user:', { id, name });
	};

	const columns: ColumnDef<User>[] = [
		{
			accessorKey: 'name',
			header: createSortableHeader<User>('Name')
		},
		{
			accessorKey: 'email',
			header: createSortableHeader<User>('Email')
		},
		{
			accessorKey: 'role',
			header: 'Role',
			cell: ({ row }) => (
				<Badge variant={row.getValue('role') === 'admin' ? 'destructive' : 'secondary'}>
					{row.getValue('role')}
				</Badge>
			)
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => (
				<Badge variant={row.getValue('status') === 'active' ? 'default' : 'outline'}>
					{row.getValue('status')}
				</Badge>
			)
		},
		createActionColumn<User>((user) => (
			<>
				<DropdownMenuItem onClick={() => handleEdit(user.id, user.name)}>
					<Edit className="mr-2 h-4 w-4" />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleDelete(user.id, user.name)}>
					<Trash2 className="mr-2 h-4 w-4" />
					Delete
				</DropdownMenuItem>
			</>
		))
	];

	return (
		<section>
			<div className="bg-gray-300 w-full h-[500px] rounded-lg mb-16"></div>
			<div>
				<h1 className="text-5xl font-bold text-center mb-8">Lorem Ipsum Dolor Sit Amet</h1>
				<h1 className="text-base/8 text-center w-[80%] mx-auto">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
					et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
					cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
					culpa qui officia deserunt mollit anim id est laborum.
				</h1>
			</div>
			<div className="my-96 h-full">
				<ImageUpload
					label="Upload Foto Profil"
					id="profile-photo"
					value={selectedFile}
					onChange={setSelectedFile}
					maxSize={2}
					previewHeight="h-92"
					required
				/>
			</div>
			<DataTable
				columns={columns}
				data={users}
				searchKey="name"
				searchPlaceholder="Search users..."
				pageSize={8}
			/>
		</section>
	);
}
