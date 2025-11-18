"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { getSpringConfig } from "@/utils/animations";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  anchorElement?: HTMLElement | null;
}

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const notificationColors = {
  info: "var(--color-info)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  error: "var(--color-error)",
};

export function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  onNotificationClick,
  onMarkAllRead,
  anchorElement,
}: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={getSpringConfig()}
          className="fixed z-[var(--z-index-dropdown)] rounded-lg border shadow-lg"
          style={{
            top: `${position.top}px`,
            right: `${position.right}px`,
            width: "380px",
            maxHeight: "500px",
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-xl)",
            display: "flex",
            flexDirection: "column",
          }}
          role="dialog"
          aria-label="Notifications"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{
              borderBottomColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center gap-2">
              <Bell
                style={{
                  width: "18px",
                  height: "18px",
                  color: "var(--color-text-primary)",
                }}
                aria-hidden="true"
              />
              <h3
                className="font-semibold"
                style={{
                  fontSize: "var(--font-size-base)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--color-text-primary)",
                }}
              >
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span
                  className="rounded-full px-2 py-0.5"
                  style={{
                    fontSize: "var(--font-size-xs)",
                    background: "var(--color-accent)",
                    color: "white",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && onMarkAllRead && (
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="text-xs"
                  style={{
                    fontSize: "var(--font-size-xs)",
                    color: "var(--color-accent)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex h-6 w-6 items-center justify-center rounded"
                aria-label="Close notifications"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-bg-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <X
                  style={{
                    width: "16px",
                    height: "16px",
                    color: "var(--color-text-secondary)",
                  }}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "400px" }}
          >
            {notifications.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 px-4 text-center"
                style={{
                  color: "var(--color-text-secondary)",
                }}
              >
                <Bell
                  style={{
                    width: "48px",
                    height: "48px",
                    marginBottom: "var(--space-md)",
                    opacity: 0.3,
                  }}
                  aria-hidden="true"
                />
                <p
                  style={{
                    fontSize: "var(--font-size-sm)",
                  }}
                >
                  No notifications
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderTopColor: "var(--color-border)" }}>
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type];
                  const color = notificationColors[notification.type];

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => {
                        onNotificationClick?.(notification);
                        onClose();
                      }}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors"
                      style={{
                        background: notification.read
                          ? "transparent"
                          : "var(--color-accent-04)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--color-bg-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = notification.read
                          ? "transparent"
                          : "var(--color-accent-04)";
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
                        className="mt-0.5 flex-shrink-0"
                        style={{
                          width: "20px",
                          height: "20px",
                          color: color,
                        }}
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-semibold"
                          style={{
                            fontSize: "var(--font-size-sm)",
                            fontWeight: notification.read
                              ? "var(--font-weight-regular)"
                              : "var(--font-weight-semibold)",
                            color: "var(--color-text-primary)",
                            marginBottom: "var(--space-xs)",
                          }}
                        >
                          {notification.title}
                        </div>
                        <div
                          style={{
                            fontSize: "var(--font-size-xs)",
                            color: "var(--color-text-secondary)",
                            marginBottom: "var(--space-xs)",
                          }}
                        >
                          {notification.message}
                        </div>
                        <div
                          style={{
                            fontSize: "var(--font-size-xs)",
                            color: "var(--color-text-tertiary)",
                          }}
                        >
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                      {!notification.read && (
                        <div
                          className="mt-1 flex-shrink-0"
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "var(--color-accent)",
                          }}
                          aria-label="Unread"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

