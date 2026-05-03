"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdInterstitialModal } from "@/components/ad-interstitial-modal";
import { ChapterNavigation } from "@/components/chapter-navigation";
import { ReaderControls } from "@/components/reader-controls";
import { saveReadingPosition, useReaderSettings } from "@/hooks/use-reader-settings";
import type { ResolvedAffiliateLink } from "@/lib/affiliate-links";
import type { Book, Chapter } from "@/lib/books";

interface ReaderProps {
  book: Book;
  chapter: Chapter;
  previousChapter?: Chapter;
  nextChapter?: Chapter;
  affiliateLink: ResolvedAffiliateLink;
}

export function Reader({ book, chapter, previousChapter, nextChapter, affiliateLink }: ReaderProps) {
  const router = useRouter();
  const [showAd, setShowAd] = useState(false);
  const { settings, setTheme, setFontFamily, increaseFontSize, decreaseFontSize } = useReaderSettings();

  useEffect(() => {
    saveReadingPosition(book.slug, chapter.chapterNumber);
  }, [book.slug, chapter.chapterNumber]);

  function goToNextChapter() {
    if (!nextChapter) {
      return;
    }

    if (nextChapter.chapterNumber % 5 === 0) {
      setShowAd(true);
      return;
    }

    router.push(`/truyen/${book.slug}/chuong/${nextChapter.chapterNumber}`);
  }

  function continueAfterAd() {
    setShowAd(false);
    if (nextChapter) {
      router.push(`/truyen/${book.slug}/chuong/${nextChapter.chapterNumber}`);
    }
  }

  return (
    <main
      className={`reader-theme-${settings.theme} min-h-screen bg-[var(--reader-bg)] text-[var(--reader-text)]`}
      style={{ "--reader-font": settings.fontFamily } as React.CSSProperties}
    >
      <ReaderControls
        theme={settings.theme}
        fontSize={settings.fontSize}
        fontFamily={settings.fontFamily}
        onThemeChange={setTheme}
        onFontFamilyChange={setFontFamily}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
      />

      <article className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <p className="text-sm font-semibold text-[var(--reader-muted)]">
          {book.title} · Chương {chapter.chapterNumber}
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{chapter.title}</h1>
        <div
          className="reader-prose mt-8 font-reader leading-[1.85]"
          style={{ fontSize: settings.fontSize }}
        >
          {chapter.content.split(/\n{2,}/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <ChapterNavigation
        bookSlug={book.slug}
        previousChapter={previousChapter}
        nextChapter={nextChapter}
        onNextChapter={goToNextChapter}
      />

      <AdInterstitialModal
        open={showAd}
        affiliateLink={affiliateLink}
        onClose={continueAfterAd}
        onContinue={continueAfterAd}
      />
    </main>
  );
}
