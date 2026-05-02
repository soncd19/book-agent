import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book Agent - Web đọc truyện tối giản",
  description: "Website đọc truyện chữ tối giản, tối ưu cho mobile và trải nghiệm đọc dài."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
