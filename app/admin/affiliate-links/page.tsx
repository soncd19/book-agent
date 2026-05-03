import { revalidatePath } from "next/cache";
import Link from "next/link";
import { db } from "@/lib/db";
import { affiliatePlacements, affiliatePlatforms, affiliateScopes } from "@/lib/affiliate-links";

export const dynamic = "force-dynamic";

const adminPath = "/admin/affiliate-links";

function fieldValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function optionalField(formData: FormData, name: string) {
  const value = fieldValue(formData, name);
  return value.length > 0 ? value : null;
}

function numberField(formData: FormData, name: string) {
  const value = Number(fieldValue(formData, name));
  return Number.isFinite(value) ? value : 0;
}

async function createAffiliateLink(formData: FormData) {
  "use server";

  const name = fieldValue(formData, "name");
  const url = fieldValue(formData, "url");

  if (!name || !url) {
    return;
  }

  await db.affiliateLink.create({
    data: {
      name,
      url,
      platform: fieldValue(formData, "platform") || "custom",
      placement: fieldValue(formData, "placement") || "chapter_transition",
      scope: fieldValue(formData, "scope") || "global",
      bookSlug: optionalField(formData, "bookSlug"),
      chapterId: optionalField(formData, "chapterId"),
      genreSlug: optionalField(formData, "genreSlug"),
      active: formData.get("active") === "on",
      priority: numberField(formData, "priority")
    }
  });

  revalidatePath(adminPath);
}

async function updateAffiliateLink(formData: FormData) {
  "use server";

  const id = fieldValue(formData, "id");
  const name = fieldValue(formData, "name");
  const url = fieldValue(formData, "url");

  if (!id || !name || !url) {
    return;
  }

  await db.affiliateLink.update({
    where: { id },
    data: {
      name,
      url,
      platform: fieldValue(formData, "platform") || "custom",
      placement: fieldValue(formData, "placement") || "chapter_transition",
      scope: fieldValue(formData, "scope") || "global",
      bookSlug: optionalField(formData, "bookSlug"),
      chapterId: optionalField(formData, "chapterId"),
      genreSlug: optionalField(formData, "genreSlug"),
      active: formData.get("active") === "on",
      priority: numberField(formData, "priority")
    }
  });

  revalidatePath(adminPath);
}

async function deleteAffiliateLink(formData: FormData) {
  "use server";

  const id = fieldValue(formData, "id");

  if (!id) {
    return;
  }

  await db.affiliateLink.delete({ where: { id } });
  revalidatePath(adminPath);
}

function SelectField({
  name,
  value,
  options
}: {
  name: string;
  value?: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <select name={name} defaultValue={value} className="h-10 rounded border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-red-500">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function TextInput({
  name,
  defaultValue,
  placeholder,
  type = "text",
  required = false
}: {
  name: string;
  defaultValue?: string | number | null;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
      className="h-10 rounded border border-zinc-300 px-3 text-sm outline-none focus:border-red-500"
    />
  );
}

export default async function AffiliateLinksAdminPage() {
  const links = await db.affiliateLink.findMany({
    orderBy: [{ active: "desc" }, { placement: "asc" }, { priority: "desc" }, { updatedAt: "desc" }]
  });

  return (
    <main className="min-h-screen bg-[#f3f3f3] text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-red-700">Admin</p>
            <h1 className="text-xl font-extrabold">Quản lý link affiliate</h1>
          </div>
          <Link href="/" className="rounded border border-zinc-300 px-3 py-2 text-sm font-semibold hover:bg-zinc-50">
            Về trang chủ
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <form action={createAffiliateLink} className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-bold uppercase tracking-wide">Thêm link mới</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_150px_190px_150px]">
            <TextInput name="name" placeholder="Tên chiến dịch" required />
            <SelectField name="platform" options={affiliatePlatforms} />
            <SelectField name="placement" options={affiliatePlacements} />
            <SelectField name="scope" options={affiliateScopes} />
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_160px_160px_160px_110px]">
            <TextInput name="url" type="url" placeholder="Link Shopee/TikTok/affiliate" required />
            <TextInput name="bookSlug" placeholder="bookSlug" />
            <TextInput name="chapterId" placeholder="chapterId" />
            <TextInput name="genreSlug" placeholder="genreSlug" />
            <TextInput name="priority" type="number" defaultValue={0} placeholder="Ưu tiên" />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <input name="active" type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-300" />
              Đang bật
            </label>
            <button type="submit" className="rounded bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800">
              Thêm link
            </button>
          </div>
        </form>

        <div className="mt-5 overflow-hidden rounded-md border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
            <h2 className="text-base font-bold uppercase tracking-wide">Danh sách link</h2>
          </div>

          <div className="divide-y divide-zinc-100">
            {links.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm font-semibold text-zinc-500">
                Chưa có link nào. Reader sẽ dùng link fallback mặc định.
              </div>
            ) : (
              links.map((item) => (
                <form key={item.id} action={updateAffiliateLink} className="grid gap-3 px-4 py-4">
                  <input type="hidden" name="id" value={item.id} />
                  <div className="grid gap-3 lg:grid-cols-[1fr_150px_190px_150px]">
                    <TextInput name="name" defaultValue={item.name} placeholder="Tên chiến dịch" required />
                    <SelectField name="platform" value={item.platform} options={affiliatePlatforms} />
                    <SelectField name="placement" value={item.placement} options={affiliatePlacements} />
                    <SelectField name="scope" value={item.scope} options={affiliateScopes} />
                  </div>
                  <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px_160px_110px]">
                    <TextInput name="url" type="url" defaultValue={item.url} placeholder="Link affiliate" required />
                    <TextInput name="bookSlug" defaultValue={item.bookSlug} placeholder="bookSlug" />
                    <TextInput name="chapterId" defaultValue={item.chapterId} placeholder="chapterId" />
                    <TextInput name="genreSlug" defaultValue={item.genreSlug} placeholder="genreSlug" />
                    <TextInput name="priority" type="number" defaultValue={item.priority} placeholder="Ưu tiên" />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-500">
                      <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                        <input name="active" type="checkbox" defaultChecked={item.active} className="h-4 w-4 rounded border-zinc-300" />
                        Đang bật
                      </label>
                      <span>Cập nhật: {item.updatedAt.toLocaleString("vi-VN")}</span>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700">
                        Lưu
                      </button>
                      <button
                        type="submit"
                        formAction={deleteAffiliateLink}
                        className="rounded border border-red-200 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </form>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
