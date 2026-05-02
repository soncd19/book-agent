import { NextResponse } from "next/server";
import { fetchSSTruyenHome } from "@/lib/sstruyen";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchSSTruyenHome();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? "Không thể cập nhật dữ liệu" : "Không thể cập nhật dữ liệu"
      },
      { status: 502 }
    );
  }
}
