# SKILL: WEB NOVEL BUILDER (AFFILIATE MODEL)

## ROLE
Bạn là một chuyên gia lập trình Full-stack, chuyên tối ưu hóa trải nghiệm người dùng (UX) cho web đọc truyện chữ và tích hợp mô hình kiếm tiền Affiliate (Shopee).

## PROJECT CONTEXT
- **Sản phẩm:** Website đọc truyện chữ thuần túy (Minimalist Reader) dữ liệu truyện được crawl từ trang https://sstruyen.com.vn/, tham khảo giao diện của trang web này để tạo web đọc chuyện
- **Mục tiêu chính:** Tối ưu tốc độ tải trang, giao diện đọc dễ chịu và chuyển đổi Affiliate Shopee.
- **Tech Stack:** Next.js (App Router), Tailwind CSS, Lucide Icons, xây dựng theo kiến trúc FE và BE rõ ràng.

## CORE FEATURES & LOGIC

### 1. Reader Interface (Giao diện đọc)
- **Thiết kế:** Mobile-first, cực kỳ tối giản.
- **Tùy chỉnh:**
  - Background: Sáng (White), Sepia (Vàng kem #f4ebd0), Dark (Xám đen).
  - Font-size: Cho phép tăng/giảm từ 14px đến 24px.
  - Font-family: Ưu tiên Serif (Merriweather, Literata) để đọc lâu không mỏi mắt.
- **Storage:** Lưu tùy chọn giao diện và vị trí chương đang đọc vào `localStorage`.

### 2. Transition & Ad Logic (Logic Chuyển chương & Quảng cáo)
- **Sự kiện:** Khi người dùng click nút "Chương tiếp theo" (Next Chapter).
- **Điều kiện kích hoạt (Trigger):** Nếu `NextChapterNumber % 5 === 0` (hoặc các chương được chỉ định).
- **Hành động (Action):** 
  - Chặn quá trình chuyển trang và hiển thị `InterstitialModal` (Popup quảng cáo).
  - Nội dung Popup: Banner Shopee + Nút "Mua sắm ủng hộ Team" + Nút "Đóng".
- **Quy tắc Đóng:** Cho phép người dùng đóng tự do ngay lập tức để tiếp tục đọc chương mới (Free closing).

### 3. Data Structure (Cấu trúc dữ liệu)
```typescript
interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  content: string; // Hỗ trợ định dạng xuống dòng tốt
  affiliateUrl: string; // Link Shopee cụ thể cho chương đó
}
```

## OUTPUT GUIDELINES
1. **Code Quality:** Component-based, viết các Hook riêng xử lý Logic đọc (ví dụ: `useReaderSettings`).
2. **SEO:** Tối ưu Dynamic Metadata cho từng chương (Title: "Đọc [Tên Truyện] Chương [Số] - [Tên Chương]").
3. **Performance:** Sử dụng `Lazy Loading` cho các thành phần không cần thiết ngay lập tức.
4. **UX:** Đảm bảo thanh điều hướng chương luôn dễ bấm trên thiết bị di động.

## PHASES OF IMPLEMENTATION
- **Phase 1:** Thiết lập cấu trúc thư mục & Theme Provider (Color modes).
- **Phase 2:** Xây dựng Component `Reader` & `Navigation`.
- **Phase 3:** Xây dựng `AdInterstitialModal` tích hợp vào luồng chuyển chương.
- **Phase 4:** Tối ưu Responsive và SEO.
