"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import clsx from "clsx";

export interface DropdownItem {
  value: string;
  label: string;
  description?: string;
}

interface DropdownProps {
  items: DropdownItem[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  "aria-label"?: string;
}

export function Dropdown({
  items,
  value,
  onChange,
  icon,
  label,
  className,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      // Focus first item when opened
      setTimeout(() => {
        const firstItem = containerRef.current?.querySelector(
          '[role="menuitem"]',
        ) as HTMLElement;
        firstItem?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const currentItem = items.find((item) => item.value === value);

  const handleSelect = (itemValue: string) => {
    onChange(itemValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, itemValue: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(itemValue);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const currentIndex = items.findIndex((item) => item.value === itemValue);
      const nextIndex = (currentIndex + 1) % items.length;
      const nextItem = containerRef.current?.querySelector(
        `[data-item-index="${nextIndex}"]`,
      ) as HTMLElement;
      nextItem?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const currentIndex = items.findIndex((item) => item.value === itemValue);
      const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      const prevItem = containerRef.current?.querySelector(
        `[data-item-index="${prevIndex}"]`,
      ) as HTMLElement;
      prevItem?.focus();
    }
  };

  return (
    <div ref={containerRef} className={clsx("footer-dropdown", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="footer-dropdown-button"
        aria-label={ariaLabel || label}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon && <span className="footer-dropdown-icon">{icon}</span>}
        {label && <span className="footer-dropdown-label">{label}</span>}
        <ChevronDown className="footer-dropdown-chevron" />
      </button>
      {isOpen && (
        <div className="footer-dropdown-menu" role="menu">
          {items.map((item, index) => (
            <button
              key={item.value}
              type="button"
              role="menuitem"
              data-item-index={index}
              onClick={() => handleSelect(item.value)}
              onKeyDown={(e) => handleKeyDown(e, item.value)}
              className={clsx(
                "footer-dropdown-item",
                value === item.value && "footer-dropdown-item-selected",
              )}
            >
              <span className="footer-dropdown-item-label">{item.label}</span>
              {item.description && (
                <span className="footer-dropdown-item-description">
                  {item.description}
                </span>
              )}
              {value === item.value && (
                <Check className="footer-dropdown-item-check" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

