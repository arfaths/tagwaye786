"use client";

import { useEffect, useRef, useState } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getSpringConfig } from "@/utils/animations";

export interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userInitials: string;
  userName?: string;
  userEmail?: string;
  anchorElement?: HTMLElement | null;
}

export function ProfileDropdown({
  isOpen,
  onClose,
  userInitials,
  userName = "User",
  userEmail,
  anchorElement,
}: ProfileDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorElement &&
        !anchorElement.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, anchorElement]);

  // Calculate position relative to anchor element
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (isOpen && anchorElement) {
      const rect = anchorElement.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen, anchorElement]);

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      onClick: () => {
        router.push("/profile");
        onClose();
      },
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      onClick: () => {
        router.push("/settings");
        onClose();
      },
    },
    {
      id: "divider",
      type: "divider" as const,
    },
    {
      id: "signout",
      label: "Sign Out",
      icon: LogOut,
      onClick: () => {
        // Handle sign out - in a real app, this would call an auth service
        // For now, redirect to login page
        router.push("/login");
        onClose();
      },
      danger: true,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={getSpringConfig()}
          className="fixed z-[var(--z-index-dropdown)] rounded-lg border shadow-lg"
          style={{
            top: `${position.top}px`,
            right: `${position.right}px`,
            minWidth: "200px",
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-lg)",
          }}
          role="menu"
          aria-label="User menu"
        >
          {/* User Info Header */}
          <div
            className="border-b px-4 py-3"
            style={{
              borderBottomColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: "var(--color-accent)",
                  color: "white",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="font-semibold"
                  style={{
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--color-text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userName}
                </div>
                {userEmail && (
                  <div
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: "var(--color-text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userEmail}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => {
              if (item.type === "divider") {
                return (
                  <div
                    key={item.id}
                    className="my-1"
                    style={{
                      height: "1px",
                      background: "var(--color-border)",
                    }}
                  />
                );
              }

              const Icon = item.icon;
              const isDanger = item.danger;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onClick}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors"
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: isDanger
                      ? "var(--color-error)"
                      : "var(--color-text-primary)",
                  }}
                  role="menuitem"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDanger
                      ? "var(--color-error-10)"
                      : "var(--color-bg-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid var(--color-accent)";
                    e.currentTarget.style.outlineOffset = "-2px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                  }}
                >
                  <Icon
                    style={{
                      width: "18px",
                      height: "18px",
                      color: isDanger
                        ? "var(--color-error)"
                        : "var(--color-text-secondary)",
                    }}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.id !== "signout" && (
                    <ChevronRight
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "var(--color-text-tertiary)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

