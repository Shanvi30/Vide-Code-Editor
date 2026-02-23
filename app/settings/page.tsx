import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Code2,
  LogOut,
} from "lucide-react";
import { currentUser } from "@/modules/auth/actions";
import Image from "next/image";
import LogoutButton from "@/modules/auth/components/logout-button";

const SettingsPage = async () => {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-[#07080f] px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-zinc-500">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="max-w-2xl flex flex-col gap-4">
        {/* ── Profile Card (shows logged in user) ── */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Profile</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={48}
                height={48}
                className="rounded-full border border-white/10"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <span className="text-indigo-400 font-bold text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            {/* Info */}
            <div>
              <p className="text-sm font-semibold text-white">
                {user?.name || "Unknown User"}
              </p>
              <p className="text-xs text-zinc-500">
                {user?.email || "No email"}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {user?.role || "USER"}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Notifications</h2>
          </div>
          <p className="text-xs text-zinc-500">
            Configure email and in-app notifications. Coming soon.
          </p>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Appearance</h2>
          </div>
          <p className="text-xs text-zinc-500">
            Customize theme, font size and editor layout. Coming soon.
          </p>
        </div>

        {/* Editor */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">
              Editor Preferences
            </h2>
          </div>
          <p className="text-xs text-zinc-500">
            Set tab size, auto-save, AI suggestions and keybindings. Coming
            soon.
          </p>
        </div>

        {/* Security */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Security</h2>
          </div>
          <p className="text-xs text-zinc-500">
            Manage sessions, connected accounts and OAuth. Coming soon.
          </p>
        </div>

        {/* ── Logout Card ── */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <LogOut className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-semibold text-white">Logout</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-7">
                You are logged in as{" "}
                <span className="text-zinc-400">{user?.email}</span>
              </p>
            </div>

            {/* LogoutButton already handles signOut logic */}
            <LogoutButton>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-sm font-medium transition-all duration-150 cursor-pointer">
                <LogOut className="w-4 h-4" />
                Logout
              </div>
            </LogoutButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
