"use client";

import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons/registry";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user.store";

export function UserMenu() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useUserStore((s) => s.user);
  const clearUser = useUserStore((s) => s.clearUser);
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
      return;
    }

    clearUser();
    router.push("/sign-in");
    router.refresh();
  };

  if (!user) {
    return null;
  }

  // Get initials from full name or email
  const getInitials = () => {
    if (user.full_name) {
      return user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2"
          aria-label="User menu"
        >
          {/* Avatar */}
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name || user.email}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {getInitials()}
            </div>
          )}

          {/* User info */}
          <div className="hidden flex-col items-start text-left md:flex">
            <span className="text-sm font-medium">
              {user.full_name || "User"}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {user.role}
            </span>
          </div>

          <Icons.chevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.full_name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/dashboard/profile" className="cursor-pointer">
            <Icons.user className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/dashboard/settings" className="cursor-pointer">
            <Icons.settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <Icons.logout className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
