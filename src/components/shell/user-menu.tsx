
'use client';

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Monitor, Moon, Settings, Sun, LogOut, Tv } from 'lucide-react';
import { useStreamerMode } from "@/contexts/streamer-mode-context";
import SwitchButton from "../ui/switch-button";

// --- Dropdown Primitives ---

interface DropdownMenuProps {
  children: ReactNode;
  trigger: ReactNode;
}

const DropdownMenu = ({ children, trigger }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={handleTriggerClick} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-72 rounded-xl shadow-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50 animate-in fade-in-0 zoom-in-95 p-2"
          role="menu"
          aria-orientation="vertical"
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const DropdownMenuItem = ({ children, onClick, className }: DropdownMenuItemProps) => (
  <a
    href="#"
    onClick={(e: React.MouseEvent) => {
      e.preventDefault();
      if (onClick) onClick();
    }}
    className={`text-zinc-700 dark:text-zinc-300 group flex w-full items-center px-3 py-2.5 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150 ${className}`}
    role="menuitem"
  >
    {children}
  </a>
);

interface DropdownMenuSubProps {
    trigger: ReactNode;
    children: ReactNode;
}

const DropdownMenuSub = ({ trigger, children }: DropdownMenuSubProps) => {
    const [isSubOpen, setIsSubOpen] = useState(false);
    return (
        <div className="relative" onMouseEnter={() => setIsSubOpen(true)} onMouseLeave={() => setIsSubOpen(false)}>
            {trigger}
            {isSubOpen && (
                 <div className="origin-top-right absolute -left-2 top-full -translate-x-full w-40 rounded-xl shadow-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50 animate-in fade-in-0 zoom-in-95 p-2">
                    {children}
                </div>
            )}
        </div>
    )
}

const DropdownMenuSeparator = () => (
  <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-700" />
);

// --- Main Component ---

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isStreamerMode, toggleStreamerMode } = useStreamerMode();
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNavClick = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("tab", value);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || '...';
  
  return (
    <DropdownMenu
      trigger={
        <button className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {userInitials}
          </div>
        </button>
      }
    >
      <div className="px-3 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {userInitials}
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-40">
              {user?.email}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Pro Trader
            </div>
          </div>
        </div>
      </div>

      <div className="py-1">
        <DropdownMenuItem onClick={() => handleNavClick('settings')}>
          <Settings className="mr-3 h-4 w-4 text-zinc-500" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={toggleStreamerMode}>
            <Tv className="mr-3 h-4 w-4 text-zinc-500" />
            Streamer Mode: {isStreamerMode ? 'On' : 'Off'}
        </DropdownMenuItem>
      </div>

      <DropdownMenuSeparator />

        <div className="p-2">
            <SwitchButton size="sm" className="w-full" />
        </div>


      <DropdownMenuSeparator />

      <div className="py-1">
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-3 h-4 w-4 text-zinc-500" />
          Sign Out
        </DropdownMenuItem>
      </div>
    </DropdownMenu>
  );
}
