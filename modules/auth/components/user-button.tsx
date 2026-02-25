"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogOut, Mail, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "../hooks/use-current-user";

const UserButton = () => {
  const user = useCurrentUser();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/sign-in" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn("relative rounded-full outline-none cursor-pointer")}
        >
          <Avatar>
            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
            <AvatarFallback className="bg-red-500">
              <User className="text-white w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-4 w-56" align="end">
        {/* User info */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            {user?.name && (
              <p className="text-sm font-semibold text-white truncate">
                {user.name}
              </p>
            )}
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-zinc-500 shrink-0" />
              <p className="text-xs text-zinc-400 truncate">
                {user?.email ?? "Not logged in"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-blue-400 hover:text-indigo-300 focus:text-blue-300 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
