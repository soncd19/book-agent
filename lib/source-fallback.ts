import type { SourceHomeData } from "@/lib/sstruyen";

export const fallbackSourceHome: SourceHomeData = {
  source: "https://sstruyen.com.vn",
  fetchedAt: new Date(0).toISOString(),
  hotBooks: [
    {
      title: "Vạn Cổ Đệ Nhất Thần (Full)",
      slug: "van-co-de-nhat-than",
      url: "https://sstruyen.com.vn/van-co-de-nhat-than",
      image: "https://sstruyen.com.vn/media/book/van-co-de-nhat-than.jpg",
      genres: []
    },
    {
      title: "Song Trùng",
      slug: "song-trung",
      url: "https://sstruyen.com.vn/song-trung",
      image: "https://sstruyen.com.vn/media/book/song-trung.jpg",
      genres: []
    },
    {
      title: "Yêu Em Nhiều Đến Thế",
      slug: "yeu-em-nhieu-den-the",
      url: "https://sstruyen.com.vn/yeu-em-nhieu-den-the",
      image: "https://sstruyen.com.vn/media/book/yeu-em-nhieu-den-the.jpg",
      genres: []
    }
  ],
  latestBooks: [],
  completedBooks: [],
  recommendedBooks: [],
  categories: [
    { title: "Tiên Hiệp", slug: "tien-hiep", url: "https://sstruyen.com.vn/the-loai/tien-hiep" },
    { title: "Kiếm Hiệp", slug: "kiem-hiep", url: "https://sstruyen.com.vn/the-loai/kiem-hiep" },
    { title: "Ngôn Tình", slug: "ngon-tinh", url: "https://sstruyen.com.vn/the-loai/ngon-tinh" },
    { title: "Đam Mỹ", slug: "dam-my", url: "https://sstruyen.com.vn/the-loai/dam-my" },
    { title: "Huyền Huyễn", slug: "huyen-huyen", url: "https://sstruyen.com.vn/the-loai/huyen-huyen" },
    { title: "Đô Thị", slug: "do-thi", url: "https://sstruyen.com.vn/the-loai/do-thi" }
  ]
};
