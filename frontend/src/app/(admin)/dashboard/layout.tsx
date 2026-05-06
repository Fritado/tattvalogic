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
  User as UserIcon,
  ShieldCheck,
  GitBranch,
  TrendingUp,
  BarChart3,
  Calendar,
  ClipboardList
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";
import GlobalFooter from "@/components/common/GlobalFooter";
import ProfileDropdown from "@/components/layout/ProfileDropdown";

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
      router.push("/portal");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/portal");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const hasPerm = (feature: string) => isAdmin || user?.permissions?.[feature]?.view;

  const navItems = [
    ...(hasPerm('dashboard') ? [{ name: "Dashboard", href: user?.department === 'Marketing & Sales' ? "/dashboard/marketing" : "/dashboard", icon: LayoutDashboard }] : []),
    ...(hasPerm('crm') || user?.department === 'Marketing & Sales' ? [
      { name: "Sales CRM", href: isAdmin ? "/admin-dashboard/crm" : "/dashboard/marketing/crm", icon: TrendingUp },
      { name: "My Performance", href: isAdmin ? "/admin-dashboard/performance" : "/dashboard/marketing/performance", icon: BarChart3 }
    ] : []),
    ...(hasPerm('settings') ? [{ name: "Blogs", href: "/admin-dashboard/blogs", icon: FileText }] : []),
    ...(hasPerm('onboarding') ? [
      { name: "Careers", href: "/admin-dashboard/careers", icon: Briefcase },
      { name: "Candidate Pipeline", href: "/admin-dashboard/applications", icon: Users }
    ] : []),
    ...(hasPerm('employees') ? [
      { name: "Employee Onboarding", href: "/admin-dashboard/employees", icon: UserIcon },
      { name: "Our Team", href: "/admin-dashboard/team", icon: Users }
    ] : []),
    ...(isAdmin ? [
      { name: "User Management", href: "/admin-dashboard/user-management", icon: ShieldCheck },
    ] : []),
    { name: "Holiday Calendar", href: "/dashboard/hr/holidays", icon: Calendar },
    { name: "Leave Management", href: "/dashboard/hr/leaves", icon: ClipboardList },
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="text-primary" size={24} />
            </div>
            {sidebarOpen && <span className="text-xl font-bold tracking-tighter text-white">Brand<span className="text-primary italic">Panel</span></span>}
          </div>
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

        {/* Logout removed from sidebar */}
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-20"} flex flex-col min-h-screen`}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-xl font-bold text-zinc-900 capitalize">
            {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
          </h1>
          
          <ProfileDropdown user={user} />
        </header>

        <div className="p-8 flex-grow">{children}</div>
        <GlobalFooter />
      </main>
    </div>
  );
}
