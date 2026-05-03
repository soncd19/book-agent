import Link from "next/link";
import { BookOpen, Clock3, Flame, Menu, Search, Sparkles } from "lucide-react";
import { books } from "@/lib/books";
import { fallbackSourceHome } from "@/lib/source-fallback";
import { fetchSSTruyenHome, localBookHref, type SourceBook, type SourceCategory } from "@/lib/sstruyen";

export const dynamic = "force-dynamic";

async function getSourceData() {
  try {
    return await fetchSSTruyenHome();
  } catch {
    return fallbackSourceHome;
  }
}

const listMenuItems = [
  { title: "Truyện full", href: "#truyen-hoan-thanh" },
  { title: "Truyện hot", href: "#truyen-hot" },
  { title: "Truyện mới cập nhật", href: "#truyen-moi-cap-nhat" },
  { title: "Ngôn tình hay", href: "#the-loai-truyen" },
  { title: "Tiên hiệp hay", href: "#the-loai-truyen" },
  { title: "Kiếm hiệp hay", href: "#the-loai-truyen" },
  { title: "Đô thị hay", href: "#the-loai-truyen" },
  { title: "Truyện hoàn", href: "#truyen-hoan-thanh" },
  { title: "Top đề cử", href: "#top-de-cu" }
];

function HeaderMenu({ categories }: { categories: SourceCategory[] }) {
  return (
    <nav className="ml-4 hidden items-center gap-1 text-sm font-bold uppercase text-zinc-700 md:flex">
      <div className="group relative">
        <button type="button" className="h-10 rounded px-3 hover:bg-zinc-50 hover:text-red-700">
          Danh sách
        </button>
        <div className="invisible absolute left-0 top-full z-50 w-[420px] rounded-md border border-zinc-200 bg-white p-3 normal-case opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
          <div className="grid grid-cols-2 gap-2">
            {listMenuItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="rounded border border-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="group relative">
        <button type="button" className="h-10 rounded px-3 hover:bg-zinc-50 hover:text-red-700">
          Thể loại truyện
        </button>
        <div className="invisible absolute left-0 top-full z-50 w-[560px] rounded-md border border-zinc-200 bg-white p-3 normal-case opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
          <div className="grid grid-cols-3 gap-2">
            {categories.slice(0, 30).map((category) => (
              <a
                key={category.url}
                href="#the-loai-truyen"
                className="rounded border border-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                {category.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function GenreTags({ genres }: { genres: string[] }) {
  if (genres.length === 0) {
    return <span className="text-xs text-zinc-400">Đang cập nhật</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {genres.slice(0, 3).map((genre) => (
        <span key={genre} className="rounded border border-zinc-200 px-1.5 py-0.5 text-xs text-zinc-600">
          {genre}
        </span>
      ))}
    </div>
  );
}

function HotShelf({ books: hotBooks }: { books: SourceBook[] }) {
  return (
    <section id="truyen-hot" className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 text-base font-bold uppercase tracking-wide text-zinc-900">
            <Flame size={18} className="text-red-700" />
            Truyện hot
          </h2>
          <span className="text-sm font-semibold text-zinc-500">Đề xuất nổi bật</span>
        </div>

        <div className="grid grid-flow-col auto-cols-[150px] gap-3 overflow-x-auto pb-2 sm:auto-cols-[170px]">
          {hotBooks.slice(0, 12).map((book) => (
            <Link
              key={book.url}
              href={localBookHref(book)}
              className="group overflow-hidden rounded-md border border-zinc-200 bg-zinc-50"
            >
              <div className="aspect-[3/4] overflow-hidden bg-zinc-200">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center px-3 text-center text-sm font-semibold text-zinc-500">
                    {book.title}
                  </div>
                )}
              </div>
              <div className="min-h-16 p-2">
                <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-zinc-900 group-hover:text-red-700">
                  {book.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestList({ latestBooks }: { latestBooks: SourceBook[] }) {
  const rows = latestBooks.length > 0 ? latestBooks : books[0].chapters.map((chapter) => ({
    title: books[0].title,
    slug: books[0].slug,
    url: `/truyen/${books[0].slug}/chuong/${chapter.chapterNumber}`,
    genres: books[0].genres,
    chapterLabel: `${chapter.chapterNumber} chương`,
    updatedAt: "Nội bộ"
  }));

  return (
    <section id="truyen-moi-cap-nhat" className="overflow-hidden rounded-md border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3">
        <h2 className="inline-flex items-center gap-2 text-base font-bold uppercase tracking-wide">
          <Clock3 size={18} className="text-red-700" />
          Truyện mới cập nhật
        </h2>
        <span className="text-xs font-medium text-zinc-500">Cập nhật tự động</span>
      </div>

      <div className="hidden grid-cols-[minmax(0,1fr)_170px_110px_92px] gap-4 border-b border-zinc-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-zinc-500 md:grid">
        <span>Tên truyện</span>
        <span>Thể loại</span>
        <span className="text-right">Chương</span>
        <span className="text-right">Cập nhật</span>
      </div>

      <div className="divide-y divide-zinc-100">
        {rows.slice(0, 24).map((book) => (
          <div
            key={`${book.url}-${book.chapterLabel}`}
            className="grid gap-2 px-4 py-3 transition hover:bg-red-50/50 md:grid-cols-[minmax(0,1fr)_170px_110px_92px] md:items-center md:gap-4"
          >
            <div className="min-w-0">
              <Link
                href={book.url.startsWith("http") ? localBookHref(book) : book.url}
                className="flex min-w-0 items-start gap-2 font-semibold leading-6 text-zinc-900 hover:text-red-700"
              >
                <span className="mt-0.5 shrink-0 text-red-700">›</span>
                <span className="line-clamp-2 min-w-0 md:line-clamp-1">
                {book.title}
                </span>
              </Link>
            </div>
            <div className="min-w-0">
              <GenreTags genres={book.genres} />
            </div>
            <div className="text-sm font-semibold text-zinc-700 md:text-right">{book.chapterLabel ?? "Đang cập nhật"}</div>
            <div className="text-sm text-zinc-500 md:text-right">{book.updatedAt ?? "Mới cập nhật"}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Sidebar({ categories, recommendedBooks }: { categories: SourceCategory[]; recommendedBooks: SourceBook[] }) {
  return (
    <aside className="space-y-4">
      <section id="the-loai-truyen" className="rounded-md border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-4 py-3 text-base font-bold uppercase tracking-wide">Thể loại truyện</h2>
        <div className="grid grid-cols-2 gap-2 p-4">
          {categories.slice(0, 30).map((category) => (
            <a
              key={category.url}
              href={category.url}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-zinc-200 px-2 py-1.5 text-sm font-medium text-zinc-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              {category.title}
            </a>
          ))}
        </div>
      </section>

      <section id="top-de-cu" className="rounded-md border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-4 py-3 text-base font-bold uppercase tracking-wide">Top đề cử</h2>
        <div className="divide-y divide-zinc-100">
          {recommendedBooks.slice(0, 9).map((book, index) => (
            <Link key={book.url} href={localBookHref(book)} className="grid grid-cols-[32px_1fr] gap-2 px-4 py-3 hover:bg-zinc-50">
              <span className="grid h-7 w-7 place-items-center rounded bg-zinc-900 text-sm font-bold text-white">{index + 1}</span>
              <span>
                <span className="line-clamp-2 text-sm font-semibold leading-5 text-zinc-900">{book.title}</span>
                <span className="mt-1 line-clamp-1 text-xs text-zinc-500">{book.genres.join(", ") || "Đang cập nhật"}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}

function CompletedShelf({ completedBooks }: { completedBooks: SourceBook[] }) {
  if (completedBooks.length === 0) {
    return null;
  }

  return (
    <section id="truyen-hoan-thanh" className="mt-5 rounded-md border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <h2 className="inline-flex items-center gap-2 text-base font-bold uppercase tracking-wide">
          <Sparkles size={18} className="text-red-700" />
          Truyện đã hoàn thành
        </h2>
        <span className="text-sm font-semibold text-zinc-500">Đã hoàn tất</span>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-6">
        {completedBooks.slice(0, 12).map((book) => (
          <Link key={book.url} href={localBookHref(book)} className="group">
            <div className="aspect-[3/4] overflow-hidden rounded bg-zinc-200">
              {book.image ? <img src={book.image} alt={book.title} className="h-full w-full object-cover transition group-hover:scale-105" /> : null}
            </div>
            <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 group-hover:text-red-700">{book.title}</h3>
            <p className="mt-1 text-xs text-zinc-500">{book.chapterLabel}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const sourceData = await getSourceData();
  const latestBooks = sourceData.latestBooks;

  return (
    <main className="min-h-screen bg-[#f3f3f3] text-zinc-950">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-red-700">
            <BookOpen size={24} />
            MD Truyện
          </Link>

          <HeaderMenu categories={sourceData.categories} />

          <Link
            href={`/truyen/${books[0].slug}`}
            className="hidden text-sm font-bold uppercase text-blue-600 hover:text-blue-700 md:inline-flex"
          >
            Truyện mẫu
          </Link>

          <form action="/tim-kiem" className="ml-auto hidden h-10 w-72 items-center gap-2 rounded border border-zinc-200 bg-zinc-50 px-3 md:flex">
            <Search size={17} className="text-zinc-400" />
            <input name="s" className="w-full bg-transparent text-sm outline-none" placeholder="Tìm kiếm truyện..." />
          </form>

          <button type="button" aria-label="Menu" className="ml-auto grid h-10 w-10 place-items-center rounded border border-zinc-200 md:hidden">
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div className="border-b border-red-900 bg-red-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-2 text-sm font-medium">
          Danh sách truyện được cập nhật tự động, tối ưu cho trải nghiệm đọc gọn hơn.
        </div>
      </div>

      <HotShelf books={sourceData.hotBooks} />

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 lg:grid-cols-[1fr_330px]">
        <div>
          <LatestList latestBooks={latestBooks} />
          <CompletedShelf completedBooks={sourceData.completedBooks} />
        </div>
        <Sidebar categories={sourceData.categories} recommendedBooks={sourceData.recommendedBooks} />
      </div>
    </main>
  );
}
