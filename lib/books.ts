export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  content: string;
  affiliateUrl: string;
}

export interface Book {
  slug: string;
  title: string;
  author: string;
  description: string;
  genres: string[];
  coverColor: string;
  chapters: Chapter[];
}

const affiliateUrl = "https://shopee.vn/";

export const books: Book[] = [
  {
    slug: "kiem-anh-du-hanh",
    title: "Kiếm Ảnh Du Hành",
    author: "Mộc An",
    description:
      "Một kiếm khách trẻ rời khỏi thành cũ, theo dấu những mảnh thư thất lạc để tìm ra bí mật phía sau cuộc biến loạn mười năm trước.",
    genres: ["Tiên hiệp", "Phiêu lưu", "Huyền bí"],
    coverColor: "from-zinc-900 via-stone-700 to-amber-500",
    chapters: [
      {
        id: "kiem-anh-du-hanh-1",
        chapterNumber: 1,
        title: "Mưa trên thành cũ",
        affiliateUrl,
        content: `Mưa đổ xuống mái ngói thành Nam Lăng từ lúc hoàng hôn chưa tắt. Những vệt nước mỏng trườn qua hàng đèn lồng, làm con phố bán sách cũ sáng lên như một dòng ký ức.

Lục Trầm đứng dưới hiên trà quán, tay giữ thanh kiếm bọc vải xám. Chàng đã đi ba ngày không nghỉ để đến đây, chỉ vì một mảnh thư có dấu son hình cánh hạc.

Người đưa thư hẹn chàng vào canh hai. Nhưng khi tiếng mõ đầu tiên vang lên, trong hẻm đối diện chỉ còn một chiếc ô giấy bị gió lật ngược và vết máu loang trên nền đá.

Lục Trầm bước qua màn mưa. Vết máu chưa kịp nhạt. Bên cạnh nó là nửa trang giấy ướt, trên giấy có bốn chữ: Đừng tin cố nhân.`
      },
      {
        id: "kiem-anh-du-hanh-2",
        chapterNumber: 2,
        title: "Khách không tên",
        affiliateUrl,
        content: `Sáng hôm sau, trà quán mở cửa muộn. Chủ quán bảo đêm qua không nghe thấy gì ngoài tiếng mưa, nhưng ánh mắt ông ta luôn tránh thanh kiếm của Lục Trầm.

Ở bàn cạnh cửa sổ có một vị khách áo xanh. Người ấy gọi một bình trà nhạt, đọc sách ngược từ cuối lên đầu, như thể đang chờ ai nhận ra mình.

"Nếu muốn tìm người đưa thư," khách áo xanh nói, "hãy đến bến Đông trước khi thuyền hàng rời bến."

Lục Trầm đặt đồng bạc lên bàn. "Các hạ là ai?"

Người kia khép sách, mỉm cười rất nhẹ. "Một người vẫn còn muốn sống."`
      },
      {
        id: "kiem-anh-du-hanh-3",
        chapterNumber: 3,
        title: "Bến Đông",
        affiliateUrl,
        content: `Bến Đông lúc bình minh đầy tiếng dây thừng kéo trên cọc gỗ. Thuyền hàng chen nhau rời bờ, khoang nào cũng phủ bạt kín.

Lục Trầm tìm thấy ký hiệu cánh hạc trên một thùng trà khô. Khi chàng chạm tay vào nắp thùng, từ phía sau vang lên tiếng nỏ bật dây.

Mũi tên lướt sát tai. Lục Trầm nghiêng người, kiếm chưa rút khỏi vải mà đã gạt gãy hai mũi tên kế tiếp.

Trong thùng trà không có lá trà. Chỉ có một chiếc hộp gỗ nhỏ và một tấm lệnh bài đã nứt đôi, khắc tên phụ thân chàng.`
      },
      {
        id: "kiem-anh-du-hanh-4",
        chapterNumber: 4,
        title: "Lệnh bài nứt",
        affiliateUrl,
        content: `Lệnh bài lạnh như vừa được vớt từ lòng sông. Lục Trầm nhận ra nét khắc của phủ Tĩnh Vương, nơi phụ thân chàng từng làm hộ vệ trưởng.

Mười năm trước, phủ ấy cháy suốt một đêm. Người trong thành nói không ai sống sót, nhưng từ hôm nay, lời đồn ấy đã có một khe nứt.

Khách áo xanh xuất hiện trên mạn thuyền, vạt áo bay trong gió sớm. "Ngươi đã cầm nó lên, nghĩa là không thể quay lại."

Lục Trầm nhìn mặt sông rộng. "Ta chưa từng định quay lại."`
      },
      {
        id: "kiem-anh-du-hanh-5",
        chapterNumber: 5,
        title: "Chuyến thuyền không bến",
        affiliateUrl,
        content: `Thuyền hàng rời Nam Lăng khi mặt trời vừa nhô khỏi mái thành. Trong khoang dưới, Lục Trầm nghe tiếng bước chân rất khẽ, đều đến mức không giống người say sóng.

Chàng tắt đèn, để bóng tối phủ kín hộp gỗ. Nắp hộp có một khe khóa hình hoa mai, còn bên trong vang lên tiếng kim loại va nhẹ mỗi khi thuyền nghiêng.

Đến giữa dòng, sương mù kéo đến dày đặc. Người chèo thuyền biến mất. Trên boong chỉ còn một sợi dây buộc vào cột buồm, đầu dây treo chiếc chuông đồng nhỏ.

Chuông chưa từng ngân, nhưng tất cả sát khí trong sương đều hướng về phía nó.`
      },
      {
        id: "kiem-anh-du-hanh-6",
        chapterNumber: 6,
        title: "Chuông đồng trong sương",
        affiliateUrl,
        content: `Tiếng kiếm rời vỏ bị sương nuốt mất một nửa. Lục Trầm không nhìn thấy đối thủ, chỉ thấy các vệt nước bị cắt đôi trước mặt.

Chàng lùi ba bước, mượn tiếng chuông đồng làm mốc. Khi sợi dây rung lên lần thứ ba, mũi kiếm của chàng xuyên qua một bóng áo đen.

Người kia không kêu. Trước khi ngã xuống, hắn ném ra một mảnh ngọc khắc chữ "Tĩnh".

Khách áo xanh nhặt mảnh ngọc, sắc mặt lần đầu tiên thay đổi. "Chúng ta phải đến Cô Sơn trước rằm."`
      }
    ]
  }
];

export function getBook(slug: string) {
  return books.find((book) => book.slug === slug);
}

export function getChapter(slug: string, chapterNumber: number) {
  const book = getBook(slug);
  return {
    book,
    chapter: book?.chapters.find((chapter) => chapter.chapterNumber === chapterNumber)
  };
}

export function getAdjacentChapters(book: Book, chapterNumber: number) {
  const currentIndex = book.chapters.findIndex((chapter) => chapter.chapterNumber === chapterNumber);

  return {
    previousChapter: currentIndex > 0 ? book.chapters[currentIndex - 1] : undefined,
    nextChapter: currentIndex >= 0 ? book.chapters[currentIndex + 1] : undefined
  };
}
