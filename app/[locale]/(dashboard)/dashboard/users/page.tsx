"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Icons } from "@/components/icons/registry";
import { Can } from "@/components/rbac/can";
import {
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableViewOptions,
  useDataTable,
} from "@/components/shared/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stack } from "@/components/ui/stack";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { cn } from "@/lib/utils";

// Mock user data type
type UserRole = "owner" | "admin" | "manager" | "editor" | "viewer";

interface MockUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  last_seen: string;
  status: "active" | "inactive";
}

// Generate mock users with distinctive, realistic data
const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    full_name: "Elena Rodriguez",
    email: "elena.rodriguez@company.com",
    role: "owner",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    created_at: "2024-01-15T10:00:00Z",
    last_seen: "2024-11-20T09:30:00Z",
    status: "active",
  },
  {
    id: "2",
    full_name: "Marcus Chen",
    email: "marcus.chen@company.com",
    role: "admin",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    created_at: "2024-02-01T14:20:00Z",
    last_seen: "2024-11-19T16:45:00Z",
    status: "active",
  },
  {
    id: "3",
    full_name: "Aisha Patel",
    email: "aisha.patel@company.com",
    role: "manager",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
    created_at: "2024-03-10T08:15:00Z",
    last_seen: "2024-11-20T08:00:00Z",
    status: "active",
  },
  {
    id: "4",
    full_name: "James Morrison",
    email: "james.morrison@company.com",
    role: "editor",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    created_at: "2024-04-22T11:30:00Z",
    last_seen: "2024-11-18T14:20:00Z",
    status: "active",
  },
  {
    id: "5",
    full_name: "Sofia Andersson",
    email: "sofia.andersson@company.com",
    role: "editor",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    created_at: "2024-05-08T09:00:00Z",
    last_seen: "2024-11-20T10:15:00Z",
    status: "active",
  },
  {
    id: "6",
    full_name: "Liam O'Connor",
    email: "liam.oconnor@company.com",
    role: "viewer",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    created_at: "2024-06-14T13:45:00Z",
    last_seen: "2024-11-15T11:30:00Z",
    status: "inactive",
  },
  {
    id: "7",
    full_name: "Yuki Tanaka",
    email: "yuki.tanaka@company.com",
    role: "manager",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
    created_at: "2024-07-03T15:20:00Z",
    last_seen: "2024-11-19T17:50:00Z",
    status: "active",
  },
  {
    id: "8",
    full_name: "Isabella Santos",
    email: "isabella.santos@company.com",
    role: "editor",
    avatar_url: null,
    created_at: "2024-08-11T10:10:00Z",
    last_seen: "2024-11-20T07:45:00Z",
    status: "active",
  },
  {
    id: "9",
    full_name: "Alexander Novak",
    email: "alexander.novak@company.com",
    role: "viewer",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander",
    created_at: "2024-09-05T12:00:00Z",
    last_seen: "2024-11-17T15:20:00Z",
    status: "active",
  },
  {
    id: "10",
    full_name: "Priya Sharma",
    email: "priya.sharma@company.com",
    role: "admin",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    created_at: "2024-10-12T08:30:00Z",
    last_seen: "2024-11-19T18:00:00Z",
    status: "active",
  },
];

// Role badge configuration with refined colors
const ROLE_CONFIG: Record<
  UserRole,
  {
    variant: "default" | "soft" | "soft-success" | "soft-warning" | "soft-info";
    label: string;
  }
> = {
  owner: { variant: "default", label: "Owner" },
  admin: { variant: "soft-info", label: "Admin" },
  manager: { variant: "soft-success", label: "Manager" },
  editor: { variant: "soft-warning", label: "Editor" },
  viewer: { variant: "soft", label: "Viewer" },
};

// Get user initials for avatar fallback
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Format relative time
function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

export default function UsersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  // Define columns with refined styling
  const columns = useMemo<ColumnDef<MockUser>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      {
        accessorKey: "full_name",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-border/50">
                <AvatarImage
                  src={user.avatar_url || undefined}
                  alt={user.full_name}
                />
                <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-xs font-medium text-primary">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-foreground leading-tight">
                  {user.full_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          );
        },
        enableSorting: true,
        size: 280,
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.original.role;
          const config = ROLE_CONFIG[role];
          return (
            <Badge variant={config.variant} className="font-medium">
              {config.label}
            </Badge>
          );
        },
        enableSorting: true,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        size: 120,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  status === "active" ? "bg-green-500" : "bg-gray-400"
                )}
              />
              <span className="text-sm capitalize text-muted-foreground">
                {status}
              </span>
            </div>
          );
        },
        enableSorting: true,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        size: 110,
      },
      {
        accessorKey: "last_seen",
        header: "Last Seen",
        cell: ({ row }) => {
          return (
            <span className="text-sm text-muted-foreground">
              {formatRelativeTime(row.original.last_seen)}
            </span>
          );
        },
        enableSorting: true,
        size: 130,
      },
      {
        accessorKey: "created_at",
        header: "Joined",
        cell: ({ row }) => {
          return (
            <span className="text-sm text-muted-foreground">
              {new Date(row.original.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          );
        },
        enableSorting: true,
        size: 120,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <Can permission={PERMISSIONS.USERS_UPDATE}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Icons.moreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Icons.edit className="mr-2 h-4 w-4" />
                    Edit User
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      toast.info("This is a UI example", {
                        description:
                          "User details view is not yet implemented.",
                      });
                    }}
                  >
                    <Icons.eye className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <Can permission={PERMISSIONS.USERS_MANAGE_ROLES}>
                    <DropdownMenuItem
                      onClick={() => {
                        toast.info("This is a UI example", {
                          description:
                            "Role management is not yet implemented.",
                        });
                      }}
                    >
                      <Icons.shield className="mr-2 h-4 w-4" />
                      Manage Roles
                    </DropdownMenuItem>
                  </Can>
                  <Can permission={PERMISSIONS.USERS_DELETE}>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Icons.trash className="mr-2 h-4 w-4" />
                      Delete User
                    </DropdownMenuItem>
                  </Can>
                </DropdownMenuContent>
              </DropdownMenu>
            </Can>
          );
        },
        enableSorting: false,
        size: 80,
      },
    ],
    []
  );

  // Use the data table hook
  const { table } = useDataTable({
    data: MOCK_USERS,
    columns,
    pageCount: 1,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      sorting: [
        {
          id: "created_at",
          desc: true,
        },
      ],
    },
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
  });

  // Handle UI-only actions
  const handleCreateUser = () => {
    setIsCreateDialogOpen(false);
    toast.success("This is a UI example", {
      description:
        "User creation is not yet implemented. This is a visual demonstration.",
    });
  };

  const handleEditUser = () => {
    setIsEditDialogOpen(false);
    toast.success("This is a UI example", {
      description:
        "User editing is not yet implemented. This is a visual demonstration.",
    });
  };

  const handleDeleteUser = () => {
    setIsDeleteDialogOpen(false);
    toast.success("This is a UI example", {
      description:
        "User deletion is not yet implemented. This is a visual demonstration.",
    });
  };

  return (
    <Container size="full">
      <Stack direction="vertical" gap="lg">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="start">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Team Members
            </h1>
            <p className="text-base text-muted-foreground">
              Manage your team members and their roles across the organization
            </p>
          </div>
          <Can permission={PERMISSIONS.USERS_CREATE}>
            <Button
              size="lg"
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2 shadow-sm"
            >
              <Icons.userPlus className="h-4 w-4" />
              Invite User
            </Button>
          </Can>
        </Stack>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-3xl font-bold tracking-tight">
                  {MOCK_USERS.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active
                </p>
                <p className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-500">
                  {MOCK_USERS.filter((u) => u.status === "active").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Admins
                </p>
                <p className="text-3xl font-bold tracking-tight">
                  {
                    MOCK_USERS.filter(
                      (u) => u.role === "admin" || u.role === "owner"
                    ).length
                  }
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  This Month
                </p>
                <p className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
                  {
                    MOCK_USERS.filter((u) => {
                      const createdDate = new Date(u.created_at);
                      const now = new Date();
                      return (
                        createdDate.getMonth() === now.getMonth() &&
                        createdDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            <Stack direction="vertical" gap="md" className="p-6">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-1 items-center gap-2">
                  {/* Search filter */}
                  <div className="relative flex-1 max-w-sm">
                    <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={
                        (table
                          .getColumn("full_name")
                          ?.getFilterValue() as string) ?? ""
                      }
                      onChange={(event) =>
                        table
                          .getColumn("full_name")
                          ?.setFilterValue(event.target.value)
                      }
                      className="pl-9"
                    />
                  </div>

                  {/* Faceted filters */}
                  {table.getColumn("role") && (
                    <DataTableFacetedFilter
                      column={table.getColumn("role")}
                      title="Role"
                      options={[
                        { label: "Owner", value: "owner" },
                        { label: "Admin", value: "admin" },
                        { label: "Manager", value: "manager" },
                        { label: "Editor", value: "editor" },
                        { label: "Viewer", value: "viewer" },
                      ]}
                    />
                  )}

                  {table.getColumn("status") && (
                    <DataTableFacetedFilter
                      column={table.getColumn("status")}
                      title="Status"
                      options={[
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                      ]}
                    />
                  )}

                  {/* Reset filters */}
                  {table.getState().columnFilters.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={() => table.resetColumnFilters()}
                      className="h-9 px-3"
                    >
                      <Icons.close className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  )}
                </div>

                {/* View options */}
                <DataTableViewOptions table={table} />
              </div>

              {/* Table */}
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className="hover:bg-transparent"
                      >
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className={cn(
                              "font-semibold",
                              header.column.getCanSort() &&
                                "cursor-pointer select-none"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {header.isPlaceholder ? null : (
                              <div className="flex items-center gap-2">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {header.column.getCanSort() && (
                                  <div className="flex flex-col text-muted-foreground">
                                    {header.column.getIsSorted() === "asc"
                                      ? "↑"
                                      : header.column.getIsSorted() === "desc"
                                        ? "↓"
                                        : "↕"}
                                  </div>
                                )}
                              </div>
                            )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-32 text-center"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Icons.users className="h-8 w-8 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">
                              No users found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="group"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <DataTablePagination table={table} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation to add a new team member to your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-email">Email Address</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="colleague@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-name">Full Name</Label>
              <Input id="new-name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role">Role</Label>
              <Select defaultValue="viewer">
                <SelectTrigger id="new-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <Can permission={PERMISSIONS.USERS_MANAGE_ROLES}>
                    <SelectItem value="admin">Admin</SelectItem>
                  </Can>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions for{" "}
              {selectedUser?.full_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                defaultValue={selectedUser?.full_name}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                defaultValue={selectedUser?.email}
                placeholder="colleague@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select defaultValue={selectedUser?.role}>
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <Can permission={PERMISSIONS.USERS_MANAGE_ROLES}>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </Can>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedUser?.full_name}</strong>? This action cannot be
              undone and will revoke all their access to the organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
}
