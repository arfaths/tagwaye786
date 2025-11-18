"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CalendarClock,
  Command,
  Search,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import { useCommandPalette } from "@/components/command-palette/CommandPaletteProvider";
import { useLayoutStore } from "@/state/layout-store";
import { ProjectPill } from "@/components/header/ProjectPill";
import { ProfileDropdown } from "@/components/header/ProfileDropdown";
import {
  NotificationsPanel,
  type Notification,
} from "@/components/header/NotificationsPanel";
import { Tooltip } from "@/components/shared/Tooltip";
import { getSpringConfig } from "@/utils/animations";

export function Header() {
  const { setOpen } = useCommandPalette();
  const selectedProjectId = useLayoutStore(
    (state) => state.selectedProjectId,
  );
  const layoutMode = useLayoutStore((state) => state.layoutMode);
  const [userInitials] = useState("JD"); // TODO: Get from user context
  const [userName] = useState("John Doe"); // TODO: Get from user context
  const [userEmail] = useState("john.doe@example.com"); // TODO: Get from user context
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const userAvatarRef = useRef<HTMLButtonElement>(null);

  // Mock notifications - TODO: Get from actual notifications service
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      title: "Project update",
      message: "New assets added to Building A",
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Schedule alert",
      message: "Commissioning phase delayed by 3 days",
      timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      read: false,
    },
    {
      id: "3",
      type: "success",
      title: "Work order completed",
      message: "HVAC maintenance completed successfully",
      timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
      read: true,
    },
  ]);
  const notificationCount = notifications.filter((n) => !n.read).length;
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);

  return (
    <motion.header
      layout
      transition={getSpringConfig()}
      className="tagwaye-header"
      role="banner"
      aria-label="Application header"
    >
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight text-white" style={{ fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-semibold)", letterSpacing: "var(--letter-spacing-tight)" }}>
          Tagwaye
        </h1>
        <div className="relative hidden lg:block">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 min-w-[320px] items-center rounded-full border border-white/10 bg-white/5 pl-12 pr-4 text-left text-sm text-white/70"
            style={{ fontSize: "var(--font-size-sm)" }}
            aria-label="Open command palette. Search spaces, assets, decisions, time. Press Command K or Control K"
            aria-keyshortcuts="Meta+K Ctrl+K"
          >
            <span aria-hidden="true">Search spaces, assets, decisions, time…</span>
            <span
              className="ml-auto flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-xs uppercase text-white/60"
              style={{ fontSize: "var(--font-size-xs)" }}
              aria-hidden="true"
            >
              <Command className="h-3 w-3" />
              K
            </span>
          </button>
        </div>
      </div>

      {/* Center Zone - Contextual (empty by default, shows context when relevant) */}
      <div
        className="hidden text-sm text-white/70 lg:flex lg:flex-col lg:items-center"
        style={{ fontSize: "var(--font-size-sm)" }}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Empty by default - can show contextual indicators when needed */}
      </div>

      <div className="flex items-center gap-2" role="toolbar" aria-label="Header actions">
        <Tooltip content={`Today • ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`} position="bottom">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-wide text-white/70"
            style={{ fontSize: "var(--font-size-xs)", letterSpacing: "var(--letter-spacing-wide)" }}
            aria-label="Today's date and time"
          >
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            <span>Today</span>
          </button>
        </Tooltip>
        <Tooltip content="View settings and filters" position="bottom">
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors button-hover"
            aria-label="View settings and filters"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Settings</span>
          </button>
        </Tooltip>
        <div className="header-notification-badge">
          <Tooltip content={notificationCount > 0 ? `${notificationCount} unread notification${notificationCount > 1 ? "s" : ""}` : "No notifications"} position="bottom">
            <button
              ref={notificationsButtonRef}
              type="button"
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors button-hover"
              aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
              aria-describedby="notifications-count"
              aria-expanded={notificationsPanelOpen}
              aria-haspopup="true"
              onClick={() => setNotificationsPanelOpen(!notificationsPanelOpen)}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Notifications</span>
              {notificationCount > 0 && (
                <span
                  className="header-notification-badge-count"
                  id="notifications-count"
                  aria-label={`${notificationCount} unread notifications`}
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>
          </Tooltip>
          <NotificationsPanel
            isOpen={notificationsPanelOpen}
            onClose={() => setNotificationsPanelOpen(false)}
            notifications={notifications}
            onNotificationClick={(notification) => {
              // TODO: Handle notification click (navigate to relevant page)
              console.log("Notification clicked:", notification);
            }}
            onMarkAllRead={() => {
              // TODO: Mark all notifications as read
              console.log("Mark all as read");
            }}
            anchorElement={notificationsButtonRef.current}
          />
        </div>
        <Tooltip content="Share project" position="bottom">
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors button-hover"
            aria-label="Share project"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Share</span>
          </button>
        </Tooltip>
        <ProjectPill />
        <div className="header-user-avatar">
          <Tooltip content={`User: ${userInitials}`} position="bottom">
            <button
              ref={userAvatarRef}
              type="button"
              className="header-user-avatar-button"
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={profileDropdownOpen}
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <span className="header-user-avatar-initials">{userInitials}</span>
              <span className="sr-only">User menu</span>
            </button>
          </Tooltip>
          <ProfileDropdown
            isOpen={profileDropdownOpen}
            onClose={() => setProfileDropdownOpen(false)}
            userInitials={userInitials}
            userName={userName}
            userEmail={userEmail}
            anchorElement={userAvatarRef.current}
          />
        </div>
      </div>
    </motion.header>
  );
}

