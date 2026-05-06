"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  LogOut, 
  User as UserIcon, 
  Settings, 
  ChevronDown,
  ShieldCheck,
  Building,
  Mail,
  UserCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/config/apiConfig";

interface ProfileDropdownProps {
  user: any;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/portal");
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 p-1.5 rounded-2xl transition-all duration-300 group ${isOpen ? 'bg-zinc-100 shadow-inner' : 'hover:bg-zinc-50'}`}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-zinc-50 to-zinc-200 rounded-full flex items-center justify-center border border-zinc-200 overflow-hidden shrink-0 group-hover:border-primary/50 transition-all shadow-sm">
          {user?.employeeRef?.photoUrl ? (
            <img 
              src={`${API_BASE.replace('/api','')}${user?.employeeRef?.photoUrl}`} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <UserIcon size={20} className="text-zinc-600" />
          )}
        </div>
        <div className="text-left hidden lg:block">
          <p className="text-sm font-black text-zinc-900 leading-tight tracking-tight">
            {user?.employeeRef?.fullName || user?.email?.split('@')[0] || 'User'}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
             <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-md ${isAdmin ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'}`}>
               {user?.role === 'admin' ? 'ADMIN' : (user?.role || 'STAFF')}
             </span>
          </div>
        </div>
        <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary' : 'group-hover:text-zinc-600'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-zinc-100 py-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300 ease-out origin-top-right">
          {/* User Profile Header */}
          <div className="px-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 overflow-hidden shadow-sm">
                {user?.employeeRef?.photoUrl ? (
                  <img 
                    src={`${API_BASE.replace('/api','')}${user?.employeeRef?.photoUrl}`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <UserCircle size={32} className="text-primary" />
                )}
              </div>
              <div>
                <p className="text-base font-black text-zinc-900 tracking-tight leading-none mb-1">
                  {user?.employeeRef?.fullName || 'TattvaLogic User'}
                </p>
                <div className="flex items-center gap-1 text-zinc-400">
                  <Mail size={12} />
                  <p className="text-xs font-medium truncate max-w-[140px]">{user?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-50/50 border border-zinc-100 p-4 rounded-[1.5rem] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Role</p>
                <p className="text-xs font-bold text-zinc-900 capitalize">{user?.role || 'User'}</p>
              </div>
              <div className="h-8 w-px bg-zinc-200" />
              <div className="text-right">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Status</p>
                <div className="flex items-center gap-1.5 justify-end">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold text-zinc-900">Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 space-y-1">
            <p className="px-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2 mt-4">Account</p>
            
            <Link 
              href={isAdmin ? "/admin-dashboard/employees" : "/employee-dashboard"}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold text-zinc-600 hover:bg-primary/5 hover:text-primary transition-all group"
            >
              <UserIcon size={18} className="text-zinc-400 group-hover:text-primary transition-colors" />
              My Profile
            </Link>

            <div className="h-px bg-zinc-100 my-4 mx-5" />

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all group"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              Logout from Session
            </button>
          </div>

          {/* Footer Logo */}
          <div className="mt-6 px-8 pt-6 border-t border-zinc-50 flex justify-center">
            <Image 
              src="/TattvaLogic.png" 
              alt="TattvaLogic" 
              width={100}
              height={24}
              className="h-6 w-auto opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-help" 
              quality={50}
            />
          </div>
        </div>
      )}
    </div>
  );
}
