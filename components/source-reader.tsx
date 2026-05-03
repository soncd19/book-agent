"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, List, Minus, Moon, Plus, Settings, Sun, Type, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AdInterstitialModal } from "@/components/ad-interstitial-modal";
import { saveReadingPosition, useReaderSettings, type ReaderTheme } from "@/hooks/use-reader-settings";
import type { SourceChapterDetail, SourceChapterLink } from "@/lib/sstruyen";

interface SourceReaderProps {
  chapter: SourceChapterDetail;
  chapters: SourceChapterLink[];
}

function chapterNumberOf(target?: SourceChapterLink) {
  return target?.number ?? Number(target?.id.match(/chuong-(\d+)/)?.[1]);
}

function ControlLink({
  target,
  direction,
  onNext
}: {
  target?: SourceChapterLink;
  direction: "previous" | "next";
  onNext?: () => void;
}) {
  const label = direction === "previous" ? "《 Chương trước" : "Chương tiếp 》";

  if (!target) {
    return (
      <span className="inline-flex h-10 min-w-32 items-center justify-center rounded border border-zinc-200 bg-zinc-100 px-3 text-sm font-semibold text-zinc-400">
        {label}
      </span>
    );
  }

  if (direction === "next" && onNext) {
    return (
      <button
        type="button"
        onClick={onNext}
        className="inline-flex h-10 min-w-32 items-center justify-center rounded border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
      >
        {label}
      </button>
    );
  }

  return (
    <Link
      href={target.localHref}
      className="inline-flex h-10 min-w-32 items-center justify-center rounded border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
    >
      {label}
    </Link>
  );
}

function ChapterControls({
  chapter,
  onNext,
  onOpenChapterList
}: {
  chapter: SourceChapterDetail;
  onNext: () => void;
  onOpenChapterList: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <ControlLink target={chapter.previousChapter} direction="previous" />
      <button
        type="button"
        onClick={onOpenChapterList}
        className="grid h-10 w-11 place-items-center rounded border border-zinc-300 bg-white text-zinc-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        aria-label="Danh sách chương"
        title="Danh sách chương"
      >
        <List size={18} />
      </button>
      <ControlLink target={chapter.nextChapter} direction="next" onNext={onNext} />
    </div>
  );
}

function ChapterListModal({
  open,
  chapters,
  currentId,
  onClose
}: {
  open: boolean;
  chapters: SourceChapterLink[];
  currentId: string;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-3 py-6">
      <div className="flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-md bg-white text-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <h2 className="text-base font-bold uppercase tracking-wide">Danh sách chương</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100"
            aria-label="Đóng danh sách chương"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {chapters.map((item) => {
              const active = item.id === currentId;
              return (
                <Link
                  key={item.sourceUrl}
                  href={item.localHref}
                  className={`rounded border px-3 py-2 text-sm font-semibold ${
                    active
                      ? "border-red-700 bg-red-50 text-red-700"
                      : "border-zinc-200 text-zinc-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  }`}
                >
                  <span className="line-clamp-1">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingSettings({
  theme,
  fontSize,
  setTheme,
  increaseFontSize,
  decreaseFontSize
}: {
  theme: ReaderTheme;
  fontSize: number;
  setTheme: (theme: ReaderTheme) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}) {
  return (
    <aside className="fixed right-3 top-28 z-30 hidden w-52 rounded-md border border-zinc-200 bg-white shadow-lg lg:block">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-2 text-sm font-bold uppercase tracking-wide text-zinc-800">
        <Settings size={16} />
        Cài đặt
      </div>
      <div className="space-y-3 p-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={decreaseFontSize}
            className="inline-flex h-9 items-center justify-center gap-1 rounded border border-zinc-200 text-sm font-semibold hover:bg-zinc-50"
          >
            <Minus size={15} />
            Aa
          </button>
          <button
            type="button"
            onClick={increaseFontSize}
            className="inline-flex h-9 items-center justify-center gap-1 rounded border border-zinc-200 text-sm font-semibold hover:bg-zinc-50"
          >
            A
            <Plus size={15} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "light" as const, icon: Sun, label: "Sáng" },
            { value: "sepia" as const, icon: Type, label: "Vàng" },
            { value: "dark" as const, icon: Moon, label: "Tối" }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.value}
                type="button"
                title={item.label}
                aria-label={item.label}
                onClick={() => setTheme(item.value)}
                className={`grid h-9 place-items-center rounded border text-sm ${
                  theme === item.value ? "border-red-700 bg-red-50 text-red-700" : "border-zinc-200 text-zinc-600"
                }`}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
        <div className="text-center text-xs font-semibold text-zinc-500">{fontSize}px</div>
      </div>
    </aside>
  );
}

export function SourceReader({ chapter, chapters }: SourceReaderProps) {
  const [pendingHref, setPendingHref] = useState<string | undefined>();
  const [showChapterList, setShowChapterList] = useState(false);
  const { settings, setTheme, increaseFontSize, decreaseFontSize } = useReaderSettings();

  useEffect(() => {
    saveReadingPosition(`sstruyen:${chapter.bookSlug}`, chapter.number ?? 0);
  }, [chapter.bookSlug, chapter.number]);

  function shouldShowAd(target?: SourceChapterLink) {
    const number = chapterNumberOf(target);
    return Number.isFinite(number) && number % 5 === 0;
  }

  function goNext() {
    if (!chapter.nextChapter) {
      return;
    }

    if (shouldShowAd(chapter.nextChapter)) {
      setPendingHref(chapter.nextChapter.localHref);
      return;
    }

    window.location.href = chapter.nextChapter.localHref;
  }

  function continueToChapter() {
    if (pendingHref) {
      window.location.href = pendingHref;
    }
  }

  return (
    <main
      className={`reader-theme-${settings.theme} min-h-screen bg-[#f3f3f3] text-zinc-950`}
      style={{ "--reader-font": settings.fontFamily } as React.CSSProperties}
    >
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-extrabold text-red-700">
            <BookOpen size={22} />
            MD Truyện
          </Link>
          <Link
            href={`/nguon/sstruyen/${chapter.bookSlug}`}
            className="ml-auto hidden text-sm font-semibold text-zinc-600 hover:text-red-700 sm:inline"
          >
            Danh sách chương
          </Link>
        </div>
      </header>

      <div className="border-b border-zinc-200 bg-zinc-100">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 text-sm text-zinc-600">
          <Link href="/" className="font-semibold hover:text-red-700">MD Truyện</Link>
          <span>/</span>
          <Link href={`/nguon/sstruyen/${chapter.bookSlug}`} className="line-clamp-1 font-semibold hover:text-red-700">
            {chapter.bookTitle}
          </Link>
          <span>/</span>
          <span className="line-clamp-1 text-zinc-900">{chapter.title}</span>
        </div>
      </div>

      <FloatingSettings
        theme={settings.theme}
        fontSize={settings.fontSize}
        setTheme={setTheme}
        increaseFontSize={increaseFontSize}
        decreaseFontSize={decreaseFontSize}
      />

      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="rounded-md border border-zinc-200 bg-white">
          <div className="px-4 py-7 text-center sm:px-8">
            <h1 className="text-2xl font-bold leading-tight text-zinc-950 sm:text-3xl">
              <Link href={`/nguon/sstruyen/${chapter.bookSlug}`} className="hover:text-red-700">
                {chapter.bookTitle}
              </Link>
            </h1>
            <h2 className="mt-3 text-lg font-semibold leading-7 text-zinc-700">{chapter.title}</h2>
          </div>

          <div className="border-y border-zinc-200 bg-zinc-50 px-4 py-3">
            <ChapterControls chapter={chapter} onNext={goNext} onOpenChapterList={() => setShowChapterList(true)} />
          </div>

          <article
            className="reader-prose bg-[var(--reader-bg)] px-5 py-7 font-reader leading-[1.9] text-[var(--reader-text)] sm:px-10 sm:py-10"
            style={{ fontSize: settings.fontSize }}
          >
            {chapter.content.split(/\n{2,}/).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-4">
            <ChapterControls chapter={chapter} onNext={goNext} onOpenChapterList={() => setShowChapterList(true)} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
          <span>Bạn có thể dùng nút chương trước/tiếp để chuyển chương trong MD Truyện.</span>
          <div className="flex gap-2">
            <button type="button" className="inline-flex items-center gap-1 rounded border border-zinc-200 px-3 py-2 font-semibold hover:bg-zinc-50">
              <ArrowLeft size={15} />
              Báo lỗi
            </button>
            <button type="button" className="inline-flex items-center gap-1 rounded border border-zinc-200 px-3 py-2 font-semibold hover:bg-zinc-50">
              Bình luận
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white/95 px-3 py-3 shadow-lg backdrop-blur lg:hidden">
        <ChapterControls chapter={chapter} onNext={goNext} onOpenChapterList={() => setShowChapterList(true)} />
      </div>

      <ChapterListModal
        open={showChapterList}
        chapters={chapters}
        currentId={chapter.sourceUrl.replace(/^https?:\/\/[^/]+\//, "").split("/")[1] ?? ""}
        onClose={() => setShowChapterList(false)}
      />

      <AdInterstitialModal
        open={Boolean(pendingHref)}
        affiliateUrl="https://shopee.vn/"
        onClose={continueToChapter}
        onContinue={continueToChapter}
      />
    </main>
  );
}
