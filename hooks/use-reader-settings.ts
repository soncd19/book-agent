"use client";

import { useEffect, useMemo, useState } from "react";

export type ReaderTheme = "light" | "sepia" | "dark";
export type ReaderFont = "Georgia" | "Merriweather" | "Literata";

export interface ReaderSettings {
  theme: ReaderTheme;
  fontSize: number;
  fontFamily: ReaderFont;
}

const defaultSettings: ReaderSettings = {
  theme: "sepia",
  fontSize: 18,
  fontFamily: "Georgia"
};

const storageKey = "book-agent-reader-settings";

function clampFontSize(size: number) {
  return Math.min(24, Math.max(14, size));
}

export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return;
    }

    try {
      const saved = JSON.parse(raw) as Partial<ReaderSettings>;
      setSettings({
        theme: saved.theme ?? defaultSettings.theme,
        fontSize: clampFontSize(saved.fontSize ?? defaultSettings.fontSize),
        fontFamily: saved.fontFamily ?? defaultSettings.fontFamily
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  const actions = useMemo(
    () => ({
      setTheme: (theme: ReaderTheme) => setSettings((current) => ({ ...current, theme })),
      setFontFamily: (fontFamily: ReaderFont) => setSettings((current) => ({ ...current, fontFamily })),
      increaseFontSize: () =>
        setSettings((current) => ({ ...current, fontSize: clampFontSize(current.fontSize + 1) })),
      decreaseFontSize: () =>
        setSettings((current) => ({ ...current, fontSize: clampFontSize(current.fontSize - 1) }))
    }),
    []
  );

  return { settings, ...actions };
}

export function saveReadingPosition(slug: string, chapterNumber: number) {
  window.localStorage.setItem(
    "book-agent-reading-position",
    JSON.stringify({ slug, chapterNumber, updatedAt: new Date().toISOString() })
  );
}
