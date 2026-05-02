"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, List } from "lucide-react";
import type { Chapter } from "@/lib/books";

interface ChapterNavigationProps {
  bookSlug: string;
  previousChapter?: Chapter;
  nextChapter?: Chapter;
  onNextChapter: () => void;
}

export function ChapterNavigation({ bookSlug, previousChapter, nextChapter, onNextChapter }: ChapterNavigationProps) {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-[var(--reader-border)] bg-[var(--reader-panel)] px-3 py-3 text-[var(--reader-text)]">
      <div className="mx-auto grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-2">
        {previousChapter ? (
          <Link
            href={`/truyen/${bookSlug}/chuong/${previousChapter.chapterNumber}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[var(--reader-border)] px-3 text-sm font-semibold"
          >
            <ArrowLeft size={17} />
            <span className="hidden min-[390px]:inline">Trước</span>
          </Link>
        ) : (
          <span />
        )}

        <Link
          href={`/truyen/${bookSlug}`}
          className="grid h-11 w-11 place-items-center rounded-md border border-[var(--reader-border)]"
          aria-label="Danh sách chương"
          title="Danh sách chương"
        >
          <List size={18} />
        </Link>

        {nextChapter ? (
          <button
            type="button"
            onClick={onNextChapter}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--reader-text)] px-3 text-sm font-semibold text-[var(--reader-bg)]"
          >
            <span className="hidden min-[390px]:inline">Chương tiếp</span>
            <ArrowRight size={17} />
          </button>
        ) : (
          <span className="rounded-md border border-[var(--reader-border)] px-3 py-3 text-center text-xs text-[var(--reader-muted)]">
            Hết
          </span>
        )}
      </div>
    </nav>
  );
}
