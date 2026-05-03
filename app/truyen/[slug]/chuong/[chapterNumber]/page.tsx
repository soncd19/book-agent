import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reader } from "@/components/reader";
import { getAffiliateLink } from "@/lib/affiliate-links";
import { getAdjacentChapters, getChapter } from "@/lib/books";

export const dynamic = "force-dynamic";

interface ChapterPageProps {
  params: Promise<{ slug: string; chapterNumber: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { slug, chapterNumber } = await params;
  const { book, chapter } = getChapter(slug, Number(chapterNumber));

  if (!book || !chapter) {
    return {};
  }

  return {
    title: `Đọc ${book.title} Chương ${chapter.chapterNumber} - ${chapter.title}`,
    description: `${book.title} chương ${chapter.chapterNumber}: ${chapter.title}`
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug, chapterNumber } = await params;
  const { book, chapter } = getChapter(slug, Number(chapterNumber));

  if (!book || !chapter) {
    notFound();
  }

  const { previousChapter, nextChapter } = getAdjacentChapters(book, chapter.chapterNumber);
  const affiliateLink = await getAffiliateLink("chapter_transition", {
    bookSlug: book.slug,
    chapterId: String(chapter.chapterNumber),
    genreSlugs: book.genres
  });

  return <Reader book={book} chapter={chapter} previousChapter={previousChapter} nextChapter={nextChapter} affiliateLink={affiliateLink} />;
}
