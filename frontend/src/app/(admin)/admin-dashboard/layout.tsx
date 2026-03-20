"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  User as UserIcon
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");

    if (!token || !storedUser) {
      router.push("/admin-login");
    } else {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Blogs", href: "/admin-dashboard/blogs", icon: FileText },
    { name: "Enquiries", href: "/admin-dashboard/enquiries", icon: MessageSquare },
    { name: "Careers", href: "/admin-dashboard/careers", icon: Briefcase },
    { name: "Candidate Pipeline", href: "/admin-dashboard/applications", icon: Users },
    // { name: "Settings", href: "/admin-dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-zinc-900 text-white transition-all duration-300 flex flex-col fixed inset-y-0 z-50`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          {sidebarOpen ? (
            <span className="text-xl font-bold tracking-tighter">Tattva<span className="text-primary italic">Logic</span></span>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg" />
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-white/5 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={22} />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
                {sidebarOpen && isActive && <ChevronRight className="ml-auto" size={16} />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={22} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-20"}`}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-xl font-bold text-zinc-900 capitalize">
            {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-zinc-900">{user?.email}</p>
              <p className="text-xs text-zinc-400">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200">
              <UserIcon size={20} className="text-zinc-600" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
