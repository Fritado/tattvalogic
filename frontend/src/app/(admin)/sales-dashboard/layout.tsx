"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  ChevronRight,
  Menu,
  X,
  User as UserIcon,
  TrendingUp,
  BarChart3,
  Briefcase,
  Users,
  LayoutDashboard as DashboardIcon,
  Calendar as CalendarIcon,
  ClipboardList
} from "lucide-react";
import ProfileDropdown from "@/components/layout/ProfileDropdown";
import { API_BASE } from "@/config/apiConfig";
import GlobalFooter from "@/components/common/GlobalFooter";
import { getDashboardRoute } from "@/config/routeConfig";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
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

      // Route Protection
      if (parsedUser.role !== 'admin' && parsedUser.department !== 'Marketing & Sales') {
        const correctRoute = getDashboardRoute(parsedUser);
        if (pathname !== correctRoute) {
          router.push(correctRoute);
        }
      }
    }
  }, [router, pathname]);

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

  const menuSections = [
    {
      title: "Overview",
      subtitle: "Analytics & Performance",
      items: [
        { name: "Dashboard", href: "/sales-dashboard", icon: LayoutDashboard },
        { name: "My Performance", href: "/sales-dashboard/performance", icon: BarChart3 },
      ]
    },
    {
      title: "Sales & CRM",
      subtitle: "Pipeline & Leads",
      items: [
        { name: "Sales CRM", href: "/sales-dashboard/crm", icon: TrendingUp },
      ]
    },
    ...(hasPerm('settings') ? [{
      title: "Resources",
      subtitle: "Public & HR",
      items: [
        ...(hasPerm('settings') ? [{ name: "Blogs", href: "/admin-dashboard/blogs", icon: FileText }] : []),
      ]
    }] : []),
    {
      title: "HR",
      subtitle: "Management",
      items: [
        { name: "Holiday Calendar", href: "/sales-dashboard/hr/holidays", icon: CalendarIcon },
        { name: "Leave Management", href: "/sales-dashboard/hr/leaves", icon: ClipboardList },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-72" : "w-20"
          } bg-white border-r border-zinc-200 transition-all duration-300 flex flex-col fixed inset-y-0 z-50 shadow-sm`}
      >
        <div className="p-6 flex items-center justify-between border-b border-zinc-100 bg-white sticky top-0 z-10">
          <Link href="/sales-dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className={`${sidebarOpen ? "h-10" : "h-6"} relative transition-all duration-300 min-w-[32px]`} style={{ width: sidebarOpen ? '140px' : '32px' }}>
              <Image
                src="/TattvaLogic.png"
                alt="TattvaLogic Logo"
                fill
                className="object-contain object-left"
                quality={50}
                priority
              />
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-zinc-100 text-zinc-400 rounded-lg transition-colors">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-8 overflow-y-auto custom-scrollbar">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              {sidebarOpen && (
                <div className="px-3">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">{section.title}</p>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${isActive
                          ? "bg-primary/5 text-primary"
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                    >
                      <item.icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 text-zinc-400 group-hover:text-primary'}`} />
                      {sidebarOpen && <span className="text-sm font-bold tracking-tight">{item.name}</span>}
                      {sidebarOpen && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout removed from sidebar */}
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-20"} flex flex-col min-h-screen`}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-xl font-bold text-zinc-900 capitalize">
            {pathname.includes("/crm") ? "Sales CRM" : (pathname.split("/").pop()?.replace("-", " ") || "Sales Dashboard")}
          </h1>

          <ProfileDropdown user={user} />
        </header>

        <div className="p-8 flex-grow">{children}</div>
        <GlobalFooter />
      </main>
    </div>
  );
}
