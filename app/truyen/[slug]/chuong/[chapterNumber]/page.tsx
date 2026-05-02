import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reader } from "@/components/reader";
import { books, getAdjacentChapters, getChapter } from "@/lib/books";

interface ChapterPageProps {
  params: Promise<{ slug: string; chapterNumber: string }>;
}

export function generateStaticParams() {
  return books.flatMap((book) =>
    book.chapters.map((chapter) => ({
      slug: book.slug,
      chapterNumber: String(chapter.chapterNumber)
    }))
  );
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

  return <Reader book={book} chapter={chapter} previousChapter={previousChapter} nextChapter={nextChapter} />;
}
