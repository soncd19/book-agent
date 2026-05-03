import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock3,
  Hash,
  Search,
  Star,
  UserRound
} from "lucide-react";
import { fetchSSTruyenBook, fetchSSTruyenHome, localBookHref } from "@/lib/sstruyen";

export const dynamic = "force-dynamic";

interface SourceBookPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SourceBookPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const book = await fetchSSTruyenBook(slug);
    return {
      title: `${book.title} - Đọc tại MD Truyện`,
      description: book.description
    };
  } catch {
    return {};
  }
}

async function getRecommendations() {
  try {
    const home = await fetchSSTruyenHome();
    return home.recommendedBooks.slice(0, 9);
  } catch {
    return [];
  }
}

export default async function SourceBookPage({ params }: SourceBookPageProps) {
  const { slug } = await params;
  let book;

  try {
    book = await fetchSSTruyenBook(slug);
  } catch {
    notFound();
  }

  const recommendedBooks = await getRecommendations();
  const firstChapter = book.chapters[0];
  const lastChapter = book.chapters[book.chapters.length - 1];

  return (
    <main className="min-h-screen bg-[#f3f3f3] text-zinc-950">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-extrabold text-red-700">
            <BookOpen size={22} />
            MD Truyện
          </Link>
          <div className="ml-auto hidden h-9 w-64 items-center gap-2 rounded border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 sm:flex">
            <Search size={16} />
            Tìm kiếm truyện...
          </div>
        </div>
      </div>

      <div className="border-b border-zinc-200 bg-zinc-100">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-sm text-zinc-600">
          <Link href="/" className="inline-flex items-center gap-1 font-semibold hover:text-red-700">
            <ArrowLeft size={15} />
            MD Truyện
          </Link>
          <ChevronRight size={14} />
          <span className="line-clamp-1 font-medium text-zinc-900">{book.title}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 lg:grid-cols-[1fr_310px]">
        <div className="space-y-5">
          <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
              <span className="inline-flex rounded bg-red-700 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Thông tin truyện
              </span>
            </div>

            <div className="grid gap-5 p-4 md:grid-cols-[190px_1fr] md:p-5">
              <div>
                <div className="overflow-hidden rounded border border-zinc-200 bg-zinc-200 shadow-sm">
                  {book.image ? (
                    <img src={book.image} alt={book.title} className="aspect-[3/4] h-full w-full object-cover" />
                  ) : (
                    <div className="grid aspect-[3/4] place-items-center p-4 text-center text-sm font-semibold text-zinc-500">
                      {book.title}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-extrabold leading-tight text-zinc-950">{book.title}</h1>

                <div className="mt-4 grid gap-2 text-sm text-zinc-700">
                  <div className="flex items-start gap-2">
                    <UserRound size={17} className="mt-0.5 shrink-0 text-zinc-400" />
                    <span>
                      <b>Tác giả:</b> {book.author || "Đang cập nhật"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Hash size={17} className="mt-0.5 shrink-0 text-zinc-400" />
                    <span>
                      <b>Thể loại:</b> {book.genres.length > 0 ? book.genres.join(", ") : "Đang cập nhật"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen size={17} className="mt-0.5 shrink-0 text-zinc-400" />
                    <span>
                      <b>Số chương:</b> {book.chapterCount || book.chapters.length}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock3 size={17} className="mt-0.5 shrink-0 text-zinc-400" />
                    <span>
                      <b>Trạng thái:</b>{" "}
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        {book.status || "Đang cập nhật"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {book.genres.map((genre) => (
                    <span key={genre} className="rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
                      {genre}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {firstChapter ? (
                    <Link
                      href={firstChapter.localHref}
                      className="inline-flex h-11 items-center gap-2 rounded bg-red-700 px-4 text-sm font-bold text-white hover:bg-red-800"
                    >
                      <BookOpen size={17} />
                      Đọc từ đầu
                    </Link>
                  ) : null}
                  {lastChapter ? (
                    <Link
                      href={lastChapter.localHref}
                      className="inline-flex h-11 items-center gap-2 rounded border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-800 hover:bg-zinc-50"
                    >
                      Chương mới nhất
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-md border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-4 py-3">
              <h2 className="text-base font-bold uppercase tracking-wide">Giới thiệu nội dung</h2>
            </div>
            <div className="p-4 md:p-5">
              <div className="max-h-[260px] overflow-hidden whitespace-pre-line rounded border border-zinc-100 bg-zinc-50 p-4 leading-7 text-zinc-700">
                {book.description || "Truyện đang được cập nhật giới thiệu."}
              </div>
            </div>
          </section>

          <section className="rounded-md border border-zinc-200 bg-white">
            <div className="grid gap-3 border-b border-zinc-200 px-4 py-3 md:grid-cols-[1fr_auto] md:items-center">
              <h2 className="text-base font-bold uppercase tracking-wide">Danh sách chương</h2>
              <form className="flex h-10 min-w-0 rounded border border-zinc-200 bg-zinc-50">
                <input
                  name="chapter"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                  placeholder="Nhập số chương..."
                />
                <button type="button" className="border-l border-zinc-200 px-3 text-sm font-bold text-red-700">
                  Tìm
                </button>
              </form>
            </div>

            <div className="grid md:grid-cols-2">
              {book.chapters.map((chapter) => (
                <Link
                  key={chapter.sourceUrl}
                  href={chapter.localHref}
                  className="flex min-h-12 items-center justify-between gap-4 border-b border-zinc-100 px-4 py-3 hover:bg-red-50"
                >
                  <span className="line-clamp-1 text-sm font-semibold text-zinc-800">{chapter.title}</span>
                  <ChevronRight size={17} className="shrink-0 text-zinc-400" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-md border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-4 py-3">
              <h2 className="inline-flex items-center gap-2 text-base font-bold uppercase tracking-wide">
                <Star size={17} className="text-red-700" />
                Top đề cử
              </h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {recommendedBooks.map((item, index) => (
                <Link key={item.url} href={localBookHref(item)} className="grid grid-cols-[32px_1fr] gap-2 px-4 py-3 hover:bg-zinc-50">
                  <span className="grid h-7 w-7 place-items-center rounded bg-zinc-900 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span>
                    <span className="line-clamp-2 text-sm font-semibold leading-5">{item.title}</span>
                    <span className="mt-1 line-clamp-1 text-xs text-zinc-500">{item.genres.join(", ") || "Đang cập nhật"}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-zinc-200 bg-white p-4">
            <h2 className="text-base font-bold uppercase tracking-wide">Truyện đang đọc</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Vị trí đọc được lưu trong trình duyệt khi bạn mở chương bằng MD Truyện.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
