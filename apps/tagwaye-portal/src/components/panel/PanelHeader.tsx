"use client";

import { X } from "lucide-react";
import type { PanelContextConfig } from "./contexts/types";
import clsx from "clsx";

type Props = {
  config: PanelContextConfig;
  onClose: () => void;
};

export function PanelHeader({ config, onClose }: Props) {
  const Icon = config.icon;

  if (!config.showHeader) {
    return null;
  }

  return (
    <div
      className="panel-header"
      role="banner"
      aria-label={`${config.name} panel`}
    >
      <div className="panel-header-content">
        <Icon size={16} className="panel-header-icon" aria-hidden="true" />
        <span className="panel-header-name">{config.name}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="panel-header-close"
        aria-label={`Close ${config.name} panel`}
        title="Close panel (Cmd+\\)"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

