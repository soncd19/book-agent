import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SourceReader } from "@/components/source-reader";
import { fetchSSTruyenBook, fetchSSTruyenChapter } from "@/lib/sstruyen";

export const dynamic = "force-dynamic";

interface SourceChapterPageProps {
  params: Promise<{ slug: string; chapterId: string }>;
}

export async function generateMetadata({ params }: SourceChapterPageProps): Promise<Metadata> {
  const { slug, chapterId } = await params;

  try {
    const chapter = await fetchSSTruyenChapter(slug, decodeURIComponent(chapterId));
    return {
      title: `Đọc ${chapter.bookTitle} - ${chapter.title}`,
      description: `${chapter.bookTitle} ${chapter.title}`
    };
  } catch {
    return {};
  }
}

export default async function SourceChapterPage({ params }: SourceChapterPageProps) {
  const { slug, chapterId } = await params;
  let chapter;
  let book;

  try {
    [chapter, book] = await Promise.all([
      fetchSSTruyenChapter(slug, decodeURIComponent(chapterId)),
      fetchSSTruyenBook(slug)
    ]);
  } catch {
    notFound();
  }

  return <SourceReader chapter={chapter} chapters={book.chapters} />;
}
