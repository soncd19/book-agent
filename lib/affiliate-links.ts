import { db } from "@/lib/db";

export const affiliatePlacements = [
  { value: "chapter_transition", label: "Popup khi chuyển chương" },
  { value: "reader_inline", label: "Trong chương đang đọc" },
  { value: "book_detail", label: "Trang thông tin truyện" },
  { value: "home", label: "Trang chủ" }
] as const;

export const affiliateScopes = [
  { value: "global", label: "Toàn site" },
  { value: "genre", label: "Theo thể loại" },
  { value: "book", label: "Theo truyện" },
  { value: "chapter", label: "Theo chương" }
] as const;

export const affiliatePlatforms = [
  { value: "shopee", label: "Shopee" },
  { value: "tiktok", label: "TikTok" },
  { value: "custom", label: "Khác" }
] as const;

export type AffiliatePlacement = (typeof affiliatePlacements)[number]["value"];

export interface AffiliateContext {
  bookSlug?: string;
  chapterId?: string;
  genreSlugs?: string[];
}

export interface ResolvedAffiliateLink {
  name: string;
  platform: string;
  url: string;
}

const fallbackAffiliateLink: ResolvedAffiliateLink = {
  name: "Shopee",
  platform: "shopee",
  url: "https://shopee.vn/"
};

function linkScore(link: {
  scope: string;
  bookSlug: string | null;
  chapterId: string | null;
  genreSlug: string | null;
  priority: number;
}, context: AffiliateContext) {
  if (link.scope === "chapter" && link.chapterId && link.chapterId === context.chapterId) {
    return 4000 + link.priority;
  }

  if (link.scope === "book" && link.bookSlug && link.bookSlug === context.bookSlug) {
    return 3000 + link.priority;
  }

  if (link.scope === "genre" && link.genreSlug && context.genreSlugs?.includes(link.genreSlug)) {
    return 2000 + link.priority;
  }

  if (link.scope === "global") {
    return 1000 + link.priority;
  }

  return -1;
}

export async function getAffiliateLink(
  placement: AffiliatePlacement,
  context: AffiliateContext = {}
): Promise<ResolvedAffiliateLink> {
  try {
    const links = await db.affiliateLink.findMany({
      where: {
        active: true,
        placement,
        OR: [
          { scope: "global" },
          { scope: "book", bookSlug: context.bookSlug },
          { scope: "chapter", chapterId: context.chapterId },
          ...(context.genreSlugs?.length ? [{ scope: "genre", genreSlug: { in: context.genreSlugs } }] : [])
        ]
      },
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }]
    });

    const bestLink = links
      .map((link) => ({ link, score: linkScore(link, context) }))
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)[0]?.link;

    if (!bestLink) {
      return fallbackAffiliateLink;
    }

    return {
      name: bestLink.name,
      platform: bestLink.platform,
      url: bestLink.url
    };
  } catch {
    return fallbackAffiliateLink;
  }
}
