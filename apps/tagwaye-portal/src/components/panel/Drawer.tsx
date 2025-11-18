"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";
import clsx from "clsx";
import { getDrawerSpringConfig } from "@/utils/animations";

interface DrawerProps {
  id: string;
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export function Drawer({
  id,
  title,
  icon,
  defaultOpen = false,
  children,
  className,
}: DrawerProps) {
  return (
    <Accordion.Item
      value={id}
      className={clsx(
        "overflow-hidden rounded-lg border",
        "border-[var(--color-border)] bg-[var(--color-surface)]",
        className,
      )}
    >
      <Accordion.Trigger
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors button-hover hover:bg-[var(--color-bg-secondary)]"
        style={{
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--color-text-primary)",
        }}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        <ChevronDown
          className="h-4 w-4 transition-icon group-data-[state=open]:rotate-180"
          style={{ 
            color: "var(--color-text-secondary)",
            transitionDuration: "var(--duration-fast)",
          }}
        />
      </Accordion.Trigger>
      <Accordion.Content
        className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        style={{
          padding: "0 var(--space-md) var(--space-md)",
          transitionDuration: "var(--duration-fast)",
        }}
      >
        <div className="pt-2">{children}</div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

