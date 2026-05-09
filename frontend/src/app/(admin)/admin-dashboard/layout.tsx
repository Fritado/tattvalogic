"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  Target,
  BarChart3,
  Filter,
  Calendar as CalendarIcon,
  ClipboardList,
  Quote
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";
import ProfileDropdown from "@/components/layout/ProfileDropdown";
import GlobalFooter from "@/components/common/GlobalFooter";

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

      // Strict redirect for non-admins accessing the root admin dashboard
      if (parsedUser.role !== 'admin' && pathname === '/admin-dashboard') {
        router.push("/dashboard");
      }
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

  const menuSections = [
    {
      title: "Overview",
      items: [
        ...(hasPerm('dashboard') ? [{ name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard }] : []),
      ]
    },
    {
      title: "Sales & CRM",
      items: [
        ...(hasPerm('crm') || user?.department === 'Marketing & Sales' ? [
          { name: "Sales CRM", href: isAdmin ? "/admin-dashboard/crm" : "/sales-dashboard/crm", icon: TrendingUp },
          { name: isAdmin ? "Team Plan Vs Performance" : "My Performance", href: isAdmin ? "/admin-dashboard/performance" : "/sales-dashboard/performance", icon: BarChart3 }
        ] : []),
      ]
    },
    {
      title: "Content Management",
      items: [
        ...(hasPerm('settings') ? [
          { name: "Blogs", href: "/admin-dashboard/blogs", icon: FileText },
          { name: "Portfolio", href: "/admin-dashboard/portfolio", icon: Target },
          { name: "Testimonials", href: "/admin-dashboard/testimonials", icon: Quote }
        ] : []),
      ]
    },
    {
      title: "Human Resources",
      items: [
        ...(hasPerm('onboarding') ? [
          { name: "Careers", href: "/admin-dashboard/careers", icon: Briefcase },
          { name: "Candidate Pipeline", href: "/admin-dashboard/applications", icon: Users }
        ] : []),
        ...(hasPerm('employees') ? [
          { name: "Employee Onboarding", href: "/admin-dashboard/employees", icon: UserIcon },
          { name: "Our Team", href: "/admin-dashboard/team", icon: Users },
          { name: "Holiday Calendar", href: "/admin-dashboard/hr/holidays", icon: CalendarIcon },
          { name: "Leave Management", href: "/admin-dashboard/hr/leaves", icon: ClipboardList }
        ] : []),
      ]
    },
    {
      title: "System",
      items: [
        ...(isAdmin ? [{ name: "User Management", href: "/admin-dashboard/user-management", icon: ShieldCheck }] : []),
      ]
    }
  ].filter(section => section.items.length > 0);

  const getPageTitle = () => {
    if (pathname.includes('/crm/lead')) return 'Lead Details';
    if (pathname.includes('/crm')) return 'Sales CRM';

    const lastPart = pathname.split("/").pop();
    if (lastPart === 'admin-dashboard') return 'Dashboard';
    return lastPart?.replace("-", " ") || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-72" : "w-20"
          } bg-white border-r border-zinc-200 transition-all duration-300 flex flex-col fixed inset-y-0 z-50 shadow-sm`}
      >
        <div className="p-6 flex items-center justify-between border-b border-zinc-100 bg-white sticky top-0 z-10 h-20">
          <Link href="/admin-dashboard" className="flex items-center gap-3 overflow-hidden">
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
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-20"} flex flex-col min-h-screen`}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-zinc-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-zinc-900 capitalize truncate max-w-[200px] md:max-w-md">
              {getPageTitle()}
            </h1>
          </div>

          <ProfileDropdown user={user} />
        </header>

        <div className="p-8 flex-grow">
          {children}
        </div>
        <GlobalFooter />
      </main>
    </div>
  );
}
