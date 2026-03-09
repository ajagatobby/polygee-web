"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, BarChart3, CalendarDays, Target, Settings, Trophy, HelpCircle, LogOut, CircleDot, ClipboardList, TrendingUp, AlertTriangle, Zap, Users, Shirt } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { duration, easing } from "@/lib/animations";
import { ConnectPolymarketModal } from "@/components/ui/connect-polymarket-modal";
import { DepositModal } from "@/components/ui/deposit-modal";
import { useAuth } from "@/lib/auth-context";
import { useUnreadAlerts, useAcknowledgeAlert, useAcknowledgeAllAlerts } from "@/lib/hooks/use-alerts";
import { timeAgo } from "@/lib/utils";
import type { AlertType } from "@/types/api";

const navLinks = [
  { href: "/", label: "Predictions", icon: BarChart3 },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
  { href: "/positions", label: "Open Positions", icon: CircleDot },
];

export function Header() {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const { isAuthenticated, signOut, firebaseUser } = useAuth();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [isPolymarketConnected, setIsPolymarketConnected] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notifTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setAvatarMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setAvatarMenuOpen(false), 150);
  };

  const handleNotifEnter = () => {
    if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    notifTimeoutRef.current = setTimeout(() => setNotifOpen(true), 300);
  };

  const handleNotifLeave = () => {
    notifTimeoutRef.current = setTimeout(() => setNotifOpen(false), 150);
  };

  // Real alerts from API
  const { data: unreadData } = useUnreadAlerts(isAuthenticated);
  const acknowledgeOne = useAcknowledgeAlert();
  const acknowledgeAll = useAcknowledgeAllAlerts();

  const alerts = unreadData?.data ?? [];
  const unreadCount = unreadData?.count ?? 0;

  const alertTypeIcon = (type: AlertType) => {
    switch (type) {
      case "high_confidence": return Zap;
      case "value_bet": return TrendingUp;
      case "live_event": return AlertTriangle;
      case "lineup_change": return Shirt;
      default: return Bell;
    }
  };

  return (
    <>
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8e8e8]">
      <div className="h-[60px] flex items-center px-6 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[18px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
              Polygee
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-[400px]">
          <div className="relative">
            <motion.div
              animate={{ opacity: searchFocused ? 1 : 0.5 }}
              transition={{ duration: duration.fast, ease: easing.ease }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            </motion.div>
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-[#f5f5f5] rounded-[8px] text-[#1a1a2e] placeholder:text-[#999] focus:outline-none focus:ring-1 focus:ring-[#ddd] transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Nav links — only when authenticated */}
          {isAuthenticated && (
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/" || pathname.startsWith("/prediction")
                    : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors
                      ${isActive
                        ? "text-[#1a1a2e] bg-[#f0f0f0] font-semibold"
                        : "text-[#808080] hover:text-[#1a1a2e] hover:bg-[#f7f7f7]"
                      }
                    `}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {isAuthenticated ? (
            <>
              <AnimatePresence mode="wait">
                {isPolymarketConnected ? (
                  <motion.button
                    key="deposit"
                    onClick={() => setDepositModalOpen(true)}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    transition={{ duration: duration.normal, ease: easing.easeOut }}
                    className="flex items-center gap-1.5 h-[34px] px-3.5 text-[13px] font-medium text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors cursor-pointer"
                  >
                    Deposit
                  </motion.button>
                ) : (
                  <motion.button
                    key="connect"
                    onClick={() => setConnectModalOpen(true)}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    transition={{ duration: duration.normal, ease: easing.easeOut }}
                    className="flex items-center gap-1.5 h-[34px] px-3.5 text-[13px] font-medium text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors cursor-pointer"
                  >
                    Connect Polymarket
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Notifications */}
              <div
                className="relative"
                ref={notifRef}
                onMouseEnter={handleNotifEnter}
                onMouseLeave={handleNotifLeave}
              >
                <button className="relative p-2 text-[#666] hover:text-[#333] transition-colors cursor-pointer">
                  <Bell className="w-[18px] h-[18px]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-[#ff3b30] ring-2 ring-white text-[9px] font-bold text-white px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.97, y: -4, filter: "blur(4px)" }}
                      transition={{ duration: duration.normal, ease: easing.easeOut }}
                      className="absolute right-0 top-[calc(100%+8px)] w-[340px] bg-white border border-[#e8e8e8] rounded-[12px] shadow-lg overflow-hidden z-50"
                      style={{ transformOrigin: "top right" }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 pt-4 pb-2.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[14px] font-bold text-[#1a1a2e]">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="flex items-center justify-center min-w-[20px] h-[20px] rounded-full bg-[#ff3b30] text-white text-[10px] font-bold px-1.5">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => acknowledgeAll.mutate()}
                            disabled={acknowledgeAll.isPending}
                            className="text-[11px] font-medium text-[#1552f0] cursor-pointer hover:underline disabled:opacity-50"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="h-px bg-[#f0f0f0]" />

                      {/* Notification list */}
                      <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
                        {alerts.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <Bell className="w-6 h-6 text-[#ccc] mx-auto mb-2" />
                            <p className="text-[13px] text-[#999]">No notifications</p>
                          </div>
                        ) : (
                          alerts.map((alert) => {
                            const Icon = alertTypeIcon(alert.type);
                            const severityColor =
                              alert.severity === "critical" ? "#ff3b30"
                              : alert.severity === "high" ? "#ff9100"
                              : alert.severity === "medium" ? "#1552f0"
                              : "#808080";

                            return (
                              <button
                                key={alert.id}
                                onClick={() => {
                                  if (!alert.acknowledged) {
                                    acknowledgeOne.mutate(alert.id);
                                  }
                                }}
                                className={`
                                  flex gap-3 w-full px-4 py-3 text-left transition-colors cursor-pointer
                                  ${!alert.acknowledged ? "bg-[#f7f9ff] hover:bg-[#eef2ff]" : "hover:bg-[#f7f7f7]"}
                                `}
                              >
                                {/* Icon */}
                                <div className="shrink-0 mt-0.5">
                                  <div
                                    className="w-[28px] h-[28px] rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: severityColor + "14" }}
                                  >
                                    <Icon className="w-3.5 h-3.5" style={{ color: severityColor }} />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`text-[13px] text-[#1a1a2e] truncate ${!alert.acknowledged ? "font-semibold" : "font-medium"}`}>
                                    {alert.title}
                                  </p>
                                  <p className="text-[12px] text-[#808080] mt-0.5 line-clamp-2">
                                    {alert.message}
                                  </p>
                                </div>
                                <span className="shrink-0 text-[11px] text-[#bbb] pt-0.5 whitespace-nowrap">
                                  {timeAgo(alert.createdAt)}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>

                      {alerts.length > 0 && (
                        <>
                          <div className="h-px bg-[#f0f0f0]" />
                          <div className="px-4 py-2.5">
                            <button className="w-full text-center text-[12px] font-medium text-[#1552f0] hover:underline cursor-pointer">
                              View all notifications
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Avatar + Popover */}
              <div
                className="relative"
                ref={avatarMenuRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-green-400 to-emerald-500 cursor-pointer hover:opacity-90 transition-opacity" />

                <AnimatePresence>
                  {avatarMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.97, y: -4, filter: "blur(4px)" }}
                      transition={{ duration: duration.normal, ease: easing.easeOut }}
                      className="absolute right-0 top-[calc(100%+8px)] w-[220px] bg-white border border-[#e8e8e8] rounded-[12px] shadow-lg overflow-hidden z-50"
                      style={{ transformOrigin: "top right" }}
                    >
                      {/* User info */}
                      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
                        {firebaseUser?.photoURL ? (
                          <img src={firebaseUser.photoURL} alt="" className="w-[36px] h-[36px] rounded-full shrink-0 object-cover" />
                        ) : (
                          <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#1a1a2e] truncate">
                            {firebaseUser?.displayName || firebaseUser?.email || "User"}
                          </p>
                        </div>
                        <button className="ml-auto shrink-0 p-1 text-[#999] hover:text-[#1a1a2e] transition-colors cursor-pointer">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="h-px bg-[#f0f0f0]" />

                      {/* Primary menu items */}
                      <div className="py-1.5">
                        {[
                          { icon: ClipboardList, label: "Orders" },
                          { icon: Target, label: "Accuracy" },
                          { icon: TrendingUp, label: "Stats" },
                          { icon: Settings, label: "Settings" },
                          { icon: Trophy, label: "Leaderboard" },
                          { icon: HelpCircle, label: "Support" },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => setAvatarMenuOpen(false)}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-medium text-[#1a1a2e] hover:bg-[#f7f7f7] transition-colors cursor-pointer"
                          >
                            <item.icon className="w-4 h-4 text-[#808080]" />
                            {item.label}
                          </button>
                        ))}
                      </div>

                      <div className="h-px bg-[#f0f0f0]" />

                      {/* Logout */}
                      <div className="py-1.5">
                        <button
                          onClick={() => {
                            setAvatarMenuOpen(false);
                            setLogoutModalOpen(true);
                          }}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-medium text-[#ff3b30] hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/sign-in"
                className="flex items-center h-[34px] px-4 text-[13px] font-medium text-[#1a1a2e] bg-[#f5f5f5] rounded-[8px] hover:bg-[#ebebeb] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="flex items-center h-[34px] px-4 text-[13px] font-medium text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>

    <ConnectPolymarketModal
      open={connectModalOpen}
      onClose={() => setConnectModalOpen(false)}
      onConnect={() => setIsPolymarketConnected(true)}
    />

    <DepositModal
      open={depositModalOpen}
      onClose={() => setDepositModalOpen(false)}
    />

    {/* Logout Confirmation Modal */}
    <AnimatePresence>
      {logoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.normal, ease: easing.easeOut }}
            onClick={() => setLogoutModalOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-[360px] mx-4 bg-white rounded-[16px] shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, y: 6, filter: "blur(4px)" }}
            transition={{ duration: duration.medium, ease: easing.easeOut }}
          >
            <div className="px-6 pt-6 pb-2 text-center">
              <motion.div
                className="flex items-center justify-center w-[44px] h-[44px] rounded-full bg-red-50 mx-auto mb-3"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.25, delay: 0.1 }}
              >
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 0.4, delay: 0.35, ease: easing.easeOut }}
                >
                  <LogOut className="w-5 h-5 text-[#ff3b30]" />
                </motion.div>
              </motion.div>
              <h2 className="text-[17px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                Log out?
              </h2>
              <p className="text-[13px] text-[#808080] mt-1">
                Are you sure you want to log out of your account?
              </p>
            </div>
            <div className="px-6 pb-6 pt-4 flex gap-2.5">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 h-[40px] text-[13px] font-medium text-[#666] bg-[#f5f5f5] rounded-[10px] hover:bg-[#ebebeb] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setLogoutModalOpen(false);
                  setIsPolymarketConnected(false);
                  await signOut();
                }}
                className="flex-1 h-[40px] text-[13px] font-bold text-white bg-[#ff3b30] rounded-[10px] hover:bg-[#e6352b] transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
