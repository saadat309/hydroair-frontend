"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  Ticket,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import FAQSection from "@/components/FAQSection";
import { fetchAPI } from "@/lib/api";
import useTicketStore from "@/lib/stores/useTicketStore";

export default function ContactPage() {
  const { t, locale } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const ticketIdParam = searchParams.get("ticket");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  // Secure access states
  const { setToken } = useTicketStore();

  // Redirect to dedicated ticket page if ticket param exists
  useEffect(() => {
    if (ticketIdParam) {
      router.replace(`/${locale}/support/ticket/${ticketIdParam}`);
    }
  }, [ticketIdParam, router, locale]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await fetchAPI("/support-tickets", {
        method: "POST",
        body: JSON.stringify({ data: { ...formData, language: locale } }),
      });
      if (data.data) {
        // Capture the token returned by our custom create controller for seamless view
        if (data.data.access_token) {
          setToken(data.data.access_token);
        }
        setSubmittedId(data.data.ticketId);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-20">
      <PageHeader title={t("contact.title")} />

      <div className="container mx-auto px-4 pb-12 -mt-5 md:-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div
                className="bg-background p-8 rounded-lg"
                style={{
                  boxShadow: "0 4px 15px rgba(var(--color-primary-rgb), 0.15)",
                }}
              >
                <h3 className="text-xl font-bold mb-6">
                  {t("contact.info.title")}
                </h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground uppercase tracking-wider">
                        {t("contact.info.phone")}
                      </p>
                      <p className="text-lg font-medium">+998 90 123 45 67</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground uppercase tracking-wider">
                        {t("contact.info.email")}
                      </p>
                      <p className="text-lg font-medium break-all">
                        support@hydroairtechnologies.com
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground uppercase tracking-wider">
                        {t("contact.info.office")}
                      </p>
                      <p className="text-lg font-medium">
                        {t("contact.info.officeAddress")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Search */}
              <div
                className="bg-background p-8 rounded-lg"
                style={{
                  boxShadow: "0 4px 15px rgba(var(--color-primary-rgb), 0.15)",
                }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" />{" "}
                  {t("contact.ticket.title")}
                </h3>
                <p className="text-sm text-foreground mb-4">
                  {t("contact.ticket.description")}
                </p>
                <form
                  className="flex gap-2 w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const id = e.target.ticketId.value;
                    if (id) {
                      router.push(`/${locale}/support/ticket/${id}`);
                    }
                  }}
                >
                  <input
                    name="ticketId"
                    placeholder={t("contact.ticket.placeholder")}
                    className="flex-1 min-w-0 bg-background border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
                    {t("contact.ticket.button")}
                  </button>
                </form>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submittedId ? (
                <div
                  className="bg-background rounded-lg p-12 text-center"
                  style={{
                    boxShadow:
                      "0 4px 15px rgba(var(--color-primary-rgb), 0.15)",
                  }}
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    {t("contact.form.successTitle")}
                  </h2>
                  <p className="text-foreground mb-8 text-lg">
                    {t("contact.form.successDesc").replace("{id}", submittedId)}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setSubmittedId(null)}
                      className="px-8 py-3 border rounded-xl font-bold hover:bg-muted transition-colors"
                    >
                      {t("contact.form.sendAnother")}
                    </button>
                    <button
                      onClick={() => router.push(`/${locale}/support/ticket/${submittedId}`)}
                      className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
                    >
                      {t("contact.form.viewStatus")}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-background rounded-lg p-8 md:p-10 space-y-6"
                  style={{
                    boxShadow:
                      "0 4px 15px rgba(var(--color-primary-rgb), 0.15)",
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                        {t("contact.form.name")}
                      </label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-muted/30 border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder={t("contact.form.namePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                        {t("contact.form.email")}
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-muted/30 border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder={t("contact.form.emailPlaceholder")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                      {t("contact.form.subject")}
                    </label>
                    <input
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full bg-muted/30 border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder={t("contact.form.subjectPlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                      {t("contact.form.message")}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-muted/30 border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                      placeholder={t("contact.form.messagePlaceholder")}
                    />
                  </div>
                  <button
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2">
                      {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      <span>{t("contact.form.button")}</span>
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
