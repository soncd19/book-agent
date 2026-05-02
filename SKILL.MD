# SKILL: BOOK AGENT - WEB NOVEL READER

## ROLE
Bạn là kỹ sư Full-stack phụ trách xây dựng, vận hành và mở rộng Book Agent: một web đọc truyện chữ tối ưu cho tốc độ, trải nghiệm đọc dài và triển khai production bằng Docker.

## PROJECT CONTEXT
- **Sản phẩm:** Web đọc truyện chữ, giao diện lấy cảm hứng từ các web đọc truyện Việt Nam nhưng thương hiệu hiển thị là Book Agent.
- **Mục tiêu:** Trải nghiệm đọc rõ ràng, mobile-first, có danh sách truyện, thể loại, tìm kiếm, trang chi tiết truyện, trang đọc chương và popup affiliate.
- **Tech Stack:** Next.js App Router, React 19, Tailwind CSS, Lucide Icons, Cheerio crawler, PostgreSQL, Prisma, Docker, Render Blueprint.
- **Deploy:** Dockerfile standalone Next.js + `docker-compose.yml` cho local production + `render.yaml` cho Render.

## CURRENT FEATURES

### 1. Home & Navigation
- Trang chủ có header, menu dropdown `Danh sách` và `Thể loại truyện`.
- Link phụ `Truyện mẫu` đứng riêng kiểu link nổi bật.
- Các khối chính:
  - Truyện hot
  - Truyện mới cập nhật
  - Thể loại truyện
  - Top đề cử
  - Truyện đã hoàn thành
- Các link truyện đã crawl mở trong route nội bộ `/nguon/sstruyen/[slug]`, không chuyển người dùng sang website nguồn.

### 2. Search
- Form tìm kiếm submit tới `/tim-kiem?s=...`.
- Trang kết quả hiển thị truyện phù hợp và link về trang chi tiết nội bộ.
- Search hiện dùng dữ liệu crawl live/fallback; DB search là hướng mở rộng tiếp theo.

### 3. Book Detail
- Trang chi tiết `/nguon/sstruyen/[slug]` hiển thị:
  - Breadcrumb Book Agent
  - Thông tin truyện
  - Bìa, tác giả, thể loại, số chương, trạng thái
  - Giới thiệu nội dung
  - Danh sách chương 2 cột
  - Top đề cử
- Không hiển thị text thương hiệu nguồn trong UI.

### 4. Reader
- Trang đọc chương `/nguon/sstruyen/[slug]/chuong/[chapterId]`.
- Bố cục gần web đọc truyện truyền thống:
  - Header
  - Breadcrumb
  - Tên truyện/tên chương căn giữa
  - Nút chương trước/danh sách/chương tiếp ở trên và dưới nội dung
  - Popup danh sách chương ngay trong trang đọc
  - Mobile sticky chapter controls
- Reader settings lưu vào `localStorage`:
  - Theme sáng/sepia/tối
  - Font size 14px-24px
  - Font family serif
  - Vị trí đọc gần nhất

### 5. Affiliate Modal
- Khi người dùng chuyển tới chương có số chương chia hết cho 5, hiển thị modal affiliate.
- Modal cho phép đóng ngay để đọc tiếp.

### 6. Database & Docker
- PostgreSQL + Prisma đã có schema ban đầu:
  - `Book`
  - `Chapter`
  - `Genre`
  - `BookGenre`
  - `CrawlLog`
- Docker Compose chạy `web` + `postgres`.
- Docker container chạy migration bằng Prisma trước khi start Next.js.
- Render Blueprint tạo web service + managed PostgreSQL.

## IMPORTANT FILES
- `app/page.tsx`: Trang chủ, menu, các danh sách truyện.
- `app/tim-kiem/page.tsx`: Trang tìm kiếm.
- `app/nguon/sstruyen/[slug]/page.tsx`: Trang chi tiết truyện crawl.
- `app/nguon/sstruyen/[slug]/chuong/[chapterId]/page.tsx`: Route đọc chương crawl.
- `components/source-reader.tsx`: Giao diện đọc chương crawl.
- `components/reader.tsx`: Giao diện đọc truyện mẫu nội bộ.
- `lib/sstruyen.ts`: Crawler/parser nguồn dữ liệu.
- `lib/db.ts`: Prisma client singleton.
- `prisma/schema.prisma`: DB schema.
- `Dockerfile`: Build Next.js standalone.
- `docker-compose.yml`: Local production stack.
- `render.yaml`: Render deploy blueprint.

## DEVELOPMENT RULES
1. Giữ UI hiển thị là Book Agent; không thêm lại text thương hiệu nguồn vào giao diện.
2. Các truyện crawl phải mở bằng route nội bộ, không chuyển người dùng sang website ngoài.
3. Nếu thêm dữ liệu persistent, ưu tiên PostgreSQL qua Prisma.
4. Nếu sửa reader, phải giữ mobile controls dễ bấm.
5. Nếu sửa Docker, kiểm tra bằng `docker compose build web`.
6. Nếu sửa schema DB, tạo migration trong `prisma/migrations`.

## NEXT RECOMMENDED PHASES
- Viết job đồng bộ truyện/chương từ crawler vào PostgreSQL.
- Đổi home/search/detail/chapter sang đọc từ DB trước, crawl live chỉ là fallback.
- Thêm full-text search PostgreSQL hoặc Meilisearch/Typesense khi dữ liệu lớn.
- Thêm admin/job dashboard để theo dõi crawl logs.
