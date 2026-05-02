import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { getBook } from "@/lib/books";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);

  if (!book) {
    return {};
  }

  return {
    title: `${book.title} - Đọc truyện online`,
    description: book.description
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBook(slug);

  if (!book) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-950">
          <ArrowLeft size={17} />
          Thư viện
        </Link>

        <section className="mt-6 grid gap-6 rounded-lg border border-zinc-200 bg-white p-5 sm:grid-cols-[160px_1fr]">
          <div className={`h-56 rounded-md bg-gradient-to-br ${book.coverColor}`} />
          <div>
            <div className="flex flex-wrap gap-2">
              {book.genres.map((genre) => (
                <span key={genre} className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                  {genre}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight">{book.title}</h1>
            <p className="mt-2 text-sm font-medium text-zinc-500">{book.author}</p>
            <p className="mt-4 max-w-2xl leading-7 text-zinc-700">{book.description}</p>
            <Link
              href={`/truyen/${book.slug}/chuong/${book.chapters[0].chapterNumber}`}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              <BookOpen size={17} />
              Đọc từ đầu
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h2 className="font-bold">Danh sách chương</h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {book.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/truyen/${book.slug}/chuong/${chapter.chapterNumber}`}
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-zinc-50"
              >
                <div>
                  <p className="font-semibold">Chương {chapter.chapterNumber}</p>
                  <p className="mt-1 text-sm text-zinc-500">{chapter.title}</p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-zinc-400" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
