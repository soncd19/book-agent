import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 px-4 text-zinc-950">
      <div className="max-w-sm text-center">
        <h1 className="text-3xl font-bold">Không tìm thấy trang</h1>
        <p className="mt-3 leading-6 text-zinc-600">Truyện hoặc chương bạn đang mở không tồn tại.</p>
        <Link
          href="/"
          className="mt-5 inline-flex h-11 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white"
        >
          Về thư viện
        </Link>
      </div>
    </main>
  );
}
