"use client";

import { X } from "lucide-react";

interface AdInterstitialModalProps {
  open: boolean;
  affiliateLink: {
    name: string;
    platform: string;
    url: string;
  };
  onClose: () => void;
  onContinue: () => void;
}

function platformLabel(platform: string) {
  if (platform === "tiktok") {
    return "TikTok";
  }

  if (platform === "shopee") {
    return "Shopee";
  }

  return "Ưu đãi";
}

export function AdInterstitialModal({ open, affiliateLink, onClose, onContinue }: AdInterstitialModalProps) {
  if (!open) {
    return null;
  }

  const label = platformLabel(affiliateLink.platform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6">
      <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white text-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <p className="text-sm font-semibold">Ủng hộ team dịch</p>
          <button
            type="button"
            aria-label="Đóng quảng cáo"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <div className="mb-3 inline-flex rounded-md bg-orange-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {label}
            </div>
            <h2 className="text-xl font-bold leading-tight">{affiliateLink.name}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Bạn có thể đóng ngay để đọc tiếp, hoặc ghé liên kết giới thiệu để ủng hộ chi phí vận hành.
            </p>
          </div>

          <div className="mt-4 grid gap-2">
            <a
              href={affiliateLink.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-orange-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-orange-700"
            >
              Mở liên kết {label}
            </a>
            <button
              type="button"
              onClick={onContinue}
              className="rounded-md border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Đóng và đọc tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
