"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import ClientLayout from "@/components/ClientLayout";

export default function Loading() {
  const params = useParams();
  const lang = params?.lang || "en";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ClientLayout initialLocale={lang}>
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    </ClientLayout>
  );
}
