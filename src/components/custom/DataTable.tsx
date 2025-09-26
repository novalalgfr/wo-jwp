import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	Column,
	Row
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchPlaceholder?: string;
	searchKey?: keyof TData;
	showSearch?: boolean;
	showColumnToggle?: boolean;
	showPagination?: boolean;
	pageSize?: number;
	className?: string;
	emptyMessage?: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchPlaceholder = 'Search...',
	searchKey,
	showSearch = true,
	showColumnToggle = true,
	showPagination = true,
	pageSize = 10,
	className = '',
	emptyMessage = 'No data found.'
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		initialState: {
			pagination: {
				pageSize: pageSize
			}
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility
		}
	});

	return (
		<div className={`w-full ${className}`}>
			{/* Toolbar */}
			{(showSearch || showColumnToggle) && (
				<div className="flex items-center justify-between py-4">
					<div className="flex items-center space-x-2">
						{/* Search Input */}
						{showSearch && searchKey && (
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder={searchPlaceholder}
									value={(table.getColumn(searchKey as string)?.getFilterValue() as string) ?? ''}
									onChange={(event) =>
										table.getColumn(searchKey as string)?.setFilterValue(event.target.value)
									}
									className="pl-8 max-w-sm"
								/>
							</div>
						)}
					</div>

					{/* Column Toggle */}
					{showColumnToggle && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="ml-auto"
								>
									Columns <ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) => column.toggleVisibility(!!value)}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			)}

			{/* Table */}
			<div className="rounded-md border overflow-hidden">
				<Table>
					<TableHeader className="bg-black">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-gray-700 hover:bg-black"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="font-medium text-white border-gray-700"
										>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{showPagination && (
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredRowModel().rows.length > 0 ? (
							<>
								Showing{' '}
								{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
								{Math.min(
									(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
									table.getFilteredRowModel().rows.length
								)}{' '}
								of {table.getFilteredRowModel().rows.length} results
							</>
						) : (
							'No data'
						)}
					</div>
					<div className="space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							className="cursor-pointer"
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							className="cursor-pointer"
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

// Helper function to create a sortable column header
export function createSortableHeader<TData>(title: string) {
	const SortableHeader = ({ column }: { column: Column<TData, unknown> }) => {
		return (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				className="h-auto p-0 -ml-3 font-medium hover:text-white hover:bg-transparent cursor-pointer"
			>
				{title}
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		);
	};

	SortableHeader.displayName = `SortableHeader_${title}`;
	return SortableHeader;
}

// Helper function to create an action column
export function createActionColumn<TData>(actions: (row: TData) => React.ReactNode) {
	return {
		id: 'actions',
		enableHiding: false,
		cell: ({ row }: { row: Row<TData> }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0"
						>
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">{actions(row.original)}</DropdownMenuContent>
				</DropdownMenu>
			);
		}
	};
}
