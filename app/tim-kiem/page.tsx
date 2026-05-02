import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { localBookHref, searchSourceBooks } from "@/lib/sstruyen";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ s?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { s } = await searchParams;
  return {
    title: s ? `Tìm kiếm: ${s} - Book Agent` : "Tìm kiếm - Book Agent"
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { s } = await searchParams;
  const query = s?.trim() ?? "";
  const results = query ? await searchSourceBooks(query) : [];

  return (
    <main className="min-h-screen bg-[#f3f3f3] text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-extrabold text-red-700">
            <BookOpen size={22} />
            Book Agent
          </Link>
          <form action="/tim-kiem" className="ml-auto flex h-10 w-full max-w-md items-center gap-2 rounded border border-zinc-200 bg-zinc-50 px-3">
            <Search size={17} className="shrink-0 text-zinc-400" />
            <input
              name="s"
              defaultValue={query}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              placeholder="Tìm kiếm truyện..."
            />
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-red-700">
          <ArrowLeft size={16} />
          Trang chủ
        </Link>

        <section className="mt-5 overflow-hidden rounded-md border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
            <h1 className="text-lg font-bold">
              {query ? `Kết quả tìm kiếm: "${query}"` : "Nhập từ khóa để tìm truyện"}
            </h1>
            {query ? <p className="mt-1 text-sm text-zinc-500">Tìm thấy {results.length} truyện phù hợp.</p> : null}
          </div>

          {query && results.length === 0 ? (
            <div className="p-6 text-sm text-zinc-600">Không tìm thấy truyện phù hợp.</div>
          ) : null}

          <div className="divide-y divide-zinc-100">
            {results.map((book) => (
              <Link key={book.url} href={localBookHref(book)} className="grid gap-3 px-4 py-4 hover:bg-red-50/50 sm:grid-cols-[72px_1fr_auto] sm:items-center">
                <div className="h-24 w-16 overflow-hidden rounded bg-zinc-200 sm:h-24">
                  {book.image ? <img src={book.image} alt={book.title} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="min-w-0">
                  <h2 className="line-clamp-2 font-bold text-zinc-950">{book.title}</h2>
                  <p className="mt-2 text-sm text-zinc-500">{book.genres.join(", ") || "Đang cập nhật"}</p>
                </div>
                <div className="text-sm font-semibold text-zinc-600">{book.chapterLabel || book.updatedAt || "Xem truyện"}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
