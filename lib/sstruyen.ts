import * as cheerio from "cheerio";

const sourceBaseUrl = "https://sstruyen.com.vn";

export interface SourceBook {
  title: string;
  slug: string;
  url: string;
  image?: string;
  genres: string[];
  chapterLabel?: string;
  updatedAt?: string;
}

export interface SourceCategory {
  title: string;
  url: string;
  slug: string;
}

export interface SourceHomeData {
  source: string;
  fetchedAt: string;
  hotBooks: SourceBook[];
  latestBooks: SourceBook[];
  completedBooks: SourceBook[];
  recommendedBooks: SourceBook[];
  categories: SourceCategory[];
}

export interface SourceChapterLink {
  title: string;
  number?: number;
  sourceUrl: string;
  localHref: string;
  id: string;
}

export interface SourceBookDetail {
  title: string;
  slug: string;
  url: string;
  image?: string;
  author?: string;
  genres: string[];
  chapterCount?: string;
  status?: string;
  description: string;
  chapters: SourceChapterLink[];
}

export interface SourceChapterDetail {
  bookTitle: string;
  bookSlug: string;
  title: string;
  number?: number;
  content: string;
  sourceUrl: string;
  previousChapter?: SourceChapterLink;
  nextChapter?: SourceChapterLink;
}

export function absoluteUrl(path?: string) {
  if (!path) {
    return undefined;
  }

  return new URL(path, sourceBaseUrl).toString();
}

export function slugFromUrl(url: string) {
  const parsed = new URL(url, sourceBaseUrl);
  return parsed.pathname.replace(/^\/|\/$/g, "").split("/")[0] || "truyen";
}

function text(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function cleanSourceBranding(value: string) {
  return value
    .replace(/SS\s*Truyện/gi, "Book Agent")
    .replace(/SSTruyen/gi, "Book Agent")
    .replace(/TRUYỆN PLUS/gi, "Book Agent")
    .replace(/Truyện Plus/gi, "Book Agent")
    .trim();
}

function chapterIdFromUrl(url: string) {
  const parsed = new URL(url, sourceBaseUrl);
  return parsed.pathname.replace(/^\/|\/$/g, "").split("/")[1] || "chuong";
}

function chapterNumberFromTitle(title: string) {
  const match = title.match(/(?:Chương|Chuong)\s+(\d+)/i);
  return match ? Number(match[1]) : undefined;
}

export function localBookHref(book: Pick<SourceBook, "slug">) {
  return `/nguon/sstruyen/${book.slug}`;
}

export function localChapterHref(slug: string, sourceUrl: string) {
  return `/nguon/sstruyen/${slug}/chuong/${encodeURIComponent(chapterIdFromUrl(sourceUrl))}`;
}

function uniqueByUrl<T extends { url: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) {
      return false;
    }
    seen.add(item.url);
    return true;
  });
}

export async function fetchSSTruyenHome(): Promise<SourceHomeData> {
  const response = await fetch(sourceBaseUrl, {
    headers: {
      "user-agent": "BookAgent/0.1 (+local development reader)"
    },
    next: { revalidate: 900 }
  });

  if (!response.ok) {
    throw new Error(`SSTruyen returned ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const categories = uniqueByUrl(
    $(".tag-name a, .menu-column-3 a")
      .toArray()
      .map((element) => {
        const $link = $(element);
        const url = absoluteUrl($link.attr("href")) ?? sourceBaseUrl;
        return {
          title: text($link.text()),
          url,
          slug: slugFromUrl(url)
        };
      })
      .filter((category) => category.title.length > 0)
  );

  const hotBooks = $("#slide .item")
    .toArray()
    .map((element) => {
      const $item = $(element);
      const $link = $item.find("a").first();
      const url = absoluteUrl($link.attr("href")) ?? sourceBaseUrl;
      const title = text($link.attr("title") || $item.find("h3").text());

      return {
        title,
        slug: slugFromUrl(url),
        url,
        image: absoluteUrl($item.find("img").attr("src")),
        genres: []
      };
    })
    .filter((book) => book.title.length > 0);

  const latestBooks = $(".itemupdate")
    .toArray()
    .map((element) => {
      const $item = $(element);
      const $bookLink = $item.find(".iname a").first();
      const url = absoluteUrl($bookLink.attr("href")) ?? sourceBaseUrl;

      return {
        title: text($bookLink.attr("title") || $bookLink.text()),
        slug: slugFromUrl(url),
        url,
        genres: $item
          .find(".icate a")
          .toArray()
          .map((genre) => text($(genre).text()))
          .filter(Boolean),
        chapterLabel: text($item.find(".ichapter").text()),
        updatedAt: text($item.find(".iupdated").text())
      };
    })
    .filter((book) => book.title.length > 0);

  const recommendedBooks = $(".suggest .item")
    .toArray()
    .map((element) => {
      const $item = $(element);
      const $link = $item.find("a").first();
      const url = absoluteUrl($link.attr("href")) ?? sourceBaseUrl;
      const genreText = text($item.find("i").text());
      const title = text($link.clone().children().remove().end().text());

      return {
        title,
        slug: slugFromUrl(url),
        url,
        genres: genreText ? genreText.split(",").map((genre) => text(genre)) : []
      };
    })
    .filter((book) => book.title.length > 0);

  const completedBooks = $(".full-book .item")
    .toArray()
    .map((element) => {
      const $item = $(element);
      const $link = $item.find("a").first();
      const url = absoluteUrl($link.attr("href")) ?? sourceBaseUrl;

      return {
        title: text($item.find("h3").text() || $link.attr("title") || ""),
        slug: slugFromUrl(url),
        url,
        image: absoluteUrl($item.find("img").attr("src")),
        genres: [],
        chapterLabel: text($item.find(".label-full").text())
      };
    })
    .filter((book) => book.title.length > 0);

  return {
    source: sourceBaseUrl,
    fetchedAt: new Date().toISOString(),
    hotBooks,
    latestBooks,
    completedBooks,
    recommendedBooks,
    categories
  };
}

export async function searchSourceBooks(query: string): Promise<SourceBook[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const html = await fetchSourceHtml(`/tim-kiem?s=${encodeURIComponent(trimmedQuery)}`);
  const $ = cheerio.load(html);
  const results = $(".itemupdate, .book-list .item, .truyen-list .item, .list-truyen .item")
    .toArray()
    .map((element) => {
      const $item = $(element);
      const $bookLink = $item.find(".iname a, h3 a, h2 a, a").first();
      const url = absoluteUrl($bookLink.attr("href")) ?? sourceBaseUrl;
      const title = text($bookLink.attr("title") || $bookLink.text());

      return {
        title,
        slug: slugFromUrl(url),
        url,
        image: absoluteUrl($item.find("img").attr("src")),
        genres: $item
          .find(".icate a, .genres a, .category a")
          .toArray()
          .map((genre) => text($(genre).text()))
          .filter(Boolean),
        chapterLabel: text($item.find(".ichapter").text()),
        updatedAt: text($item.find(".iupdated").text())
      };
    })
    .filter((book) => book.title.length > 0);

  if (results.length > 0) {
    return uniqueByUrl(results);
  }

  const home = await fetchSSTruyenHome();
  const normalizedQuery = trimmedQuery.toLocaleLowerCase("vi-VN");
  return uniqueByUrl([...home.hotBooks, ...home.latestBooks, ...home.completedBooks, ...home.recommendedBooks]).filter(
    (book) => book.title.toLocaleLowerCase("vi-VN").includes(normalizedQuery)
  );
}

async function fetchSourceHtml(path: string, revalidate = 900) {
  const response = await fetch(new URL(path, sourceBaseUrl), {
    headers: {
      "user-agent": "BookAgent/0.1 (+local development reader)"
    },
    next: { revalidate }
  });

  if (!response.ok) {
    throw new Error(`SSTruyen returned ${response.status}`);
  }

  return response.text();
}

function parseChapterLinks($: cheerio.CheerioAPI, slug: string) {
  return uniqueByUrl(
    $("#chapter-list a, .chapter-list a")
      .toArray()
      .map((element) => {
        const $link = $(element);
        const sourceUrl = absoluteUrl($link.attr("href")) ?? sourceBaseUrl;
        const title = text($link.text());

        return {
          title,
          number: chapterNumberFromTitle(title),
          sourceUrl,
          localHref: localChapterHref(slug, sourceUrl),
          id: chapterIdFromUrl(sourceUrl),
          url: sourceUrl
        };
      })
      .filter((chapter) => chapter.title.length > 0)
  ).map(({ url: _url, ...chapter }) => chapter);
}

export async function fetchSSTruyenBook(slug: string): Promise<SourceBookDetail> {
  const html = await fetchSourceHtml(`/${slug}`);
  const $ = cheerio.load(html);
  const url = absoluteUrl(`/${slug}`) ?? sourceBaseUrl;
  const title = text($("h1[itemprop='name']").first().text() || $("h1").first().text());
  const descriptionNode = $("[itemprop='description']").first();
  descriptionNode.find("br").replaceWith("\n");

  const chapters = parseChapterLinks($, slug);
  const chapterCount = $(".book-info-text li")
    .toArray()
    .map((element) => text($(element).text()))
    .find((line) => line.includes("Số chương"))
    ?.replace("Số chương:", "")
    .trim();

  return {
    title,
    slug,
    url,
    image: absoluteUrl($("[itemprop='image']").first().attr("src")),
    author: text($("[itemprop='author']").first().text()),
    genres: $(".li--genres a")
      .toArray()
      .map((element) => text($(element).text()))
      .filter(Boolean),
    chapterCount,
    status: text($(".label-status").first().text()),
    description: cleanSourceBranding(text(descriptionNode.text())),
    chapters
  };
}

export async function fetchSSTruyenChapter(slug: string, chapterId: string): Promise<SourceChapterDetail> {
  const sourcePath = `/${slug}/${chapterId}`;
  const html = await fetchSourceHtml(sourcePath, 3600);
  const $ = cheerio.load(html);
  const contentNode = $(".truyen").first();
  contentNode.find("script, style, ins").remove();
  contentNode.find("br").replaceWith("\n");

  const bookTitle = cleanSourceBranding(text($(".current-book").first().text()));
  const title = text($(".current-chapter").first().text() || $("title").first().text());
  const previousHref = $(".chapter_control").first().find(".back").attr("href");
  const nextHref = $(".chapter_control").first().find(".next").attr("href");

  function navChapter(href?: string) {
    if (!href || href === "#") {
      return undefined;
    }

    const sourceUrl = absoluteUrl(href) ?? sourceBaseUrl;
    const id = chapterIdFromUrl(sourceUrl);
    const label = id.replace(/-/g, " ");

    return {
      title: label,
      number: chapterNumberFromTitle(label),
      sourceUrl,
      localHref: localChapterHref(slug, sourceUrl),
      id
    };
  }

  return {
    bookTitle,
    bookSlug: slug,
    title,
    number: chapterNumberFromTitle(title),
    content: cleanSourceBranding(contentNode.text().replace(/\n{3,}/g, "\n\n").trim()),
    sourceUrl: absoluteUrl(sourcePath) ?? sourceBaseUrl,
    previousChapter: navChapter(previousHref),
    nextChapter: navChapter(nextHref)
  };
}
