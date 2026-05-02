"use client";

import { Minus, Moon, Plus, Settings, Sun, Type } from "lucide-react";
import type { ReaderFont, ReaderTheme } from "@/hooks/use-reader-settings";

interface ReaderControlsProps {
  theme: ReaderTheme;
  fontSize: number;
  fontFamily: ReaderFont;
  onThemeChange: (theme: ReaderTheme) => void;
  onFontFamilyChange: (fontFamily: ReaderFont) => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
}

export function ReaderControls({
  theme,
  fontSize,
  fontFamily,
  onThemeChange,
  onFontFamilyChange,
  onIncreaseFontSize,
  onDecreaseFontSize
}: ReaderControlsProps) {
  return (
    <section className="border-b border-[var(--reader-border)] bg-[var(--reader-panel)] px-4 py-3 text-[var(--reader-text)]">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--reader-muted)]">
          <Settings size={17} />
          <span>Hiển thị</span>
        </div>

        <div className="flex rounded-md border border-[var(--reader-border)] p-1">
          {[
            { value: "light" as const, icon: Sun, label: "Sáng" },
            { value: "sepia" as const, icon: Type, label: "Sepia" },
            { value: "dark" as const, icon: Moon, label: "Tối" }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.value}
                type="button"
                title={item.label}
                aria-label={item.label}
                onClick={() => onThemeChange(item.value)}
                className={`grid h-9 w-10 place-items-center rounded ${
                  theme === item.value ? "bg-[var(--reader-text)] text-[var(--reader-bg)]" : "text-[var(--reader-muted)]"
                }`}
              >
                <Icon size={17} />
              </button>
            );
          })}
        </div>

        <select
          value={fontFamily}
          onChange={(event) => onFontFamilyChange(event.target.value as ReaderFont)}
          className="h-10 rounded-md border border-[var(--reader-border)] bg-[var(--reader-bg)] px-3 text-sm"
          aria-label="Chọn font chữ"
        >
          <option value="Georgia">Georgia</option>
          <option value="Merriweather">Merriweather</option>
          <option value="Literata">Literata</option>
        </select>

        <div className="flex items-center rounded-md border border-[var(--reader-border)]">
          <button
            type="button"
            title="Giảm cỡ chữ"
            aria-label="Giảm cỡ chữ"
            onClick={onDecreaseFontSize}
            className="grid h-10 w-10 place-items-center text-[var(--reader-muted)]"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center text-sm font-semibold">{fontSize}px</span>
          <button
            type="button"
            title="Tăng cỡ chữ"
            aria-label="Tăng cỡ chữ"
            onClick={onIncreaseFontSize}
            className="grid h-10 w-10 place-items-center text-[var(--reader-muted)]"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
