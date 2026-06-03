"use client";

import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { useLanguage } from "@/context/LanguageContext";

export default function LogoutSuccessfulPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <div className="max-w-2xl">
        <SectionHeader label={t("auth_logout_success_title")} sub={t("auth_logout_success_sub")} />

        <div className="mt-12 bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8">
          <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
            {t("auth_status_label")}
          </div>
          <div className="mt-3 text-2xl sm:text-3xl tracking-[0.12em] text-[#a8ff00]">
            {t("auth_logout_success_msg")}
          </div>
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-[#999] font-normal">
            {t("auth_logout_success_desc")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-sm border border-[#a8ff00] bg-[#a8ff00] px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#0a0a0a] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("auth_go_to_login_btn")}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-sm border border-[#222] bg-transparent px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#f0f0f0] transition-colors hover:border-[#a8ff00] hover:text-[#a8ff00]"
            >
              {t("auth_return_home_btn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
