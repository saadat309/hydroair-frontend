"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { useGlobalStore } from "@/lib/stores/useGlobalStore";
import { fetchAPI } from "@/lib/api";
import { Mail, Phone, Clock } from "lucide-react";

export default function MaintenancePage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const setMaintenanceMode = useGlobalStore((state) => state.setMaintenanceMode);
  const [maintenanceData, setMaintenanceData] = useState(null);

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const data = await fetchAPI("/global-setting", {
          locale: language,
        });
        const isMaintenance = data?.data?.Show_Maintenance_Message || false;
        setMaintenanceData(data?.data);
        setMaintenanceMode(isMaintenance);
      } catch (error) {
        console.error("Failed to fetch global setting:", error);
        setMaintenanceMode(false);
      }
    }
    checkMaintenance();
  }, [language, setMaintenanceMode]);

  if (!maintenanceData?.Show_Maintenance_Message) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary mb-6">
            <Clock className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            {t("maintenance.title") || "Under Maintenance"}
          </h1>
          <p className="text-lg text-foreground/80 leading-relaxed">
            {t("maintenance.message") || "We're currently performing scheduled maintenance. We'll be back soon!"}
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">
            {t("maintenance.contactTitle") || "Need Assistance?"}
          </h2>
          <p className="text-foreground/70 mb-6">
            {t("maintenance.contactMessage") || "If you have any questions or need urgent assistance, please contact us:"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@hydroair.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <Mail className="w-5 h-5" />
              <span>info@hydroair.com</span>
            </a>
            <a
              href="tel:+1234567890"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-full font-semibold hover:opacity-90 transition-opacity border border-border"
            >
              <Phone className="w-5 h-5" />
              <span>+1 234 567 890</span>
            </a>
          </div>
        </div>

        <p className="mt-8 text-sm text-foreground/50">
          {t("maintenance.apology") || "We apologize for any inconvenience caused."}
        </p>
      </div>
    </div>
  );
}
