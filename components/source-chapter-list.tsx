"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { SourceChapterLink } from "@/lib/sstruyen";

interface SourceChapterListProps {
  chapters: SourceChapterLink[];
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function matchesChapter(chapter: SourceChapterLink, query: string) {
  if (!query) {
    return true;
  }

  const normalizedTitle = normalize(chapter.title);
  const normalizedNumber = chapter.number ? String(chapter.number) : "";
  const normalizedId = normalize(chapter.id);

  return normalizedTitle.includes(query) || normalizedNumber === query || normalizedId.includes(query);
}

export function SourceChapterList({ chapters }: SourceChapterListProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalize(query);

  const filteredChapters = useMemo(
    () => chapters.filter((chapter) => matchesChapter(chapter, normalizedQuery)),
    [chapters, normalizedQuery]
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!normalizedQuery) {
      return;
    }

    const exactChapter =
      chapters.find((chapter) => chapter.number && String(chapter.number) === normalizedQuery) ?? filteredChapters[0];

    if (exactChapter) {
      window.location.href = exactChapter.localHref;
    }
  }

  return (
    <section className="rounded-md border border-zinc-200 bg-white">
      <div className="grid gap-3 border-b border-zinc-200 px-4 py-3 md:grid-cols-[1fr_auto] md:items-center">
        <h2 className="text-base font-bold uppercase tracking-wide">Danh sách chương</h2>
        <form onSubmit={handleSubmit} className="flex h-10 min-w-0 rounded border border-zinc-200 bg-zinc-50">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            inputMode="numeric"
            placeholder="Nhập số chương..."
            aria-label="Nhập số chương hoặc tên chương"
          />
          <button type="submit" className="border-l border-zinc-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50">
            Tìm
          </button>
        </form>
      </div>

      {filteredChapters.length > 0 ? (
        <div className="grid md:grid-cols-2">
          {filteredChapters.map((chapter) => (
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
      ) : (
        <div className="px-4 py-8 text-center text-sm font-medium text-zinc-500">
          Không tìm thấy chương phù hợp.
        </div>
      )}
    </section>
  );
}
