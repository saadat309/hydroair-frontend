'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, Ticket, MessageCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/PageHeader';
import FAQSection from '@/components/FAQSection';
import { fetchAPI } from '@/lib/api';

export default function ContactPage() {
  const { t, locale } = useTranslation();
  const searchParams = useSearchParams();
  const ticketIdParam = searchParams.get('ticket');
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  
  const [ticketData, setTicketData] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(false);
  
  // Reply functionality
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [optimisticReplies, setOptimisticReplies] = useState([]);
  
  // Track message arrival times locally since Strapi repeatable components don't have individual timestamps
  const [messageTimes, setMessageTimes] = useState({});

  const recordMessageTimes = useCallback((conversation, fallbackTime) => {
    if (!conversation) return;
    setMessageTimes(prev => {
      const newTimes = { ...prev };
      let hasNew = false;
      conversation.forEach(msg => {
        if (!newTimes[msg.id]) {
          // If this is the very first time we're seeing any messages, use the fallback (updatedAt)
          // Otherwise, if new messages arrive during the session, use the current time
          const isFirstLoad = Object.keys(prev).length === 0;
          newTimes[msg.id] = isFirstLoad ? fallbackTime : new Date().toISOString();
          hasNew = true;
        }
      });
      return hasNew ? newTimes : prev;
    });
  }, []);
  
  // Polling for real-time updates
  const pollingRef = useRef(null);
  const lastReplyCountRef = useRef(0);

  const fetchTicket = useCallback(async (id) => {
    setLoadingTicket(true);
    try {
      const data = await fetchAPI(`/support-tickets/by-ticket-id/${id}`);
      if (data.data) {
        setTicketData(data.data);
        recordMessageTimes(data.data.conversation, data.data.updatedAt);
        // Clear optimistic replies once we have real data
        setOptimisticReplies([]);
        lastReplyCountRef.current = data.data.conversation?.length || 0;
      }
    } catch (err) {
      console.error("Failed to fetch ticket:", err);
    } finally {
      setLoadingTicket(false);
    }
  }, [recordMessageTimes]);

  // Initial load
  useEffect(() => {
    if (ticketIdParam) {
      fetchTicket(ticketIdParam);
    }
  }, [ticketIdParam, fetchTicket]);

  // Polling for new messages
  useEffect(() => {
    if (ticketData?.ticketId && ticketData?.ticketStatus !== 'closed') {
      // Poll every 5 seconds for new messages
      pollingRef.current = setInterval(async () => {
        try {
          const data = await fetchAPI(`/support-tickets/by-ticket-id/${ticketData.ticketId}`);
          if (data.data) {
            const currentReplyCount = data.data.conversation?.length || 0;
            // Only update if there are new replies
            if (currentReplyCount !== lastReplyCountRef.current) {
              setTicketData(data.data);
              recordMessageTimes(data.data.conversation, data.data.updatedAt);
              lastReplyCountRef.current = currentReplyCount;
              setOptimisticReplies([]); // Clear optimistic replies
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 5000);

      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [ticketData?.ticketId, ticketData?.ticketStatus, recordMessageTimes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await fetchAPI('/support-tickets', {
        method: 'POST',
        body: JSON.stringify({ data: { ...formData, language: locale } })
      });
      if (data.data) {
        setSubmittedId(data.data.ticketId);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !ticketData) return;
    
    const messageText = replyMessage.trim();
    const tempId = Date.now(); // Temporary ID for optimistic update
    
    // Optimistic UI - show message immediately
    const optimisticReply = {
      id: tempId,
      message: messageText,
      author: 'user',
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };
    
    setOptimisticReplies(prev => [...prev, optimisticReply]);
    setReplyMessage('');
    setIsSendingReply(true);
    
    try {
      const data = await fetchAPI(`/support-tickets/by-ticket-id/${ticketData.ticketId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message: messageText, author: 'user' })
      });
      if (data.data) {
        setTicketData(data.data);
        recordMessageTimes(data.data.conversation, data.data.updatedAt);
        setOptimisticReplies([]); // Clear optimistic replies
        lastReplyCountRef.current = data.data.conversation?.length || 0;
      }
    } catch (err) {
      console.error("Failed to add reply:", err);
      // Remove optimistic reply on error
      setOptimisticReplies(prev => prev.filter(r => r.id !== tempId));
    } finally {
      setIsSendingReply(false);
    }
  };

  // Combine real replies with optimistic replies
  const allReplies = [...(ticketData?.conversation || []), ...optimisticReplies];

  return (
    <div className="pb-20">
      <PageHeader title={t("contact.title")} />

      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-5xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
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
                      <p className="text-lg font-medium">
                        support@hydroair.tech
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
              <div className="bg-muted/30 p-8 rounded-3xl border">
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
                    if (id) fetchTicket(id);
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

            {/* Form or Ticket View */}
            <div className="lg:col-span-2">
              {ticketData ? (
                <div className="bg-background border rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8 border-b pb-6">
                    <div>
                      <span className="text-xs font-bold text-primary tracking-widest uppercase">
                        {t("contact.ticket.status")}
                      </span>
                      <h2 className="text-2xl font-bold mt-1">
                        {ticketData.ticketId}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Auto-refresh indicator */}
                      {ticketData.ticketStatus !== "closed" && (
                        <div className="flex items-center gap-1 text-xs text-foreground">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>{t("contact.ticket.live")}</span>
                        </div>
                      )}
                      <div
                        className={cn(
                          "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                          ticketData.ticketStatus === "open"
                            ? "bg-blue-100 text-blue-700"
                            : ticketData.ticketStatus === "closed"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-orange-100 text-orange-700",
                        )}
                      >
                        {ticketData.ticketStatus}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-muted/30 p-4 rounded-2xl">
                      <p className="text-xs font-bold text-foreground uppercase mb-2">
                        {t("contact.form.subject")}
                      </p>
                      <p className="font-medium">{ticketData.subject}</p>
                    </div>

                    {/* Ticket Conversation */}
                    <div className="border-t pt-6">
                      <h3 className="font-bold flex items-center gap-2 mb-4">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        {t("contact.ticket.conversation")}
                      </h3>

                      {/* Original Message */}
                      <div className="bg-muted/30 p-4 rounded-2xl rounded-tr-none mb-4 ml-auto max-w-[85%]">
                        <p className="text-xs font-bold mb-1 uppercase tracking-tighter opacity-60">
                          {t("contact.ticket.you")} •{" "}
                          {new Date(ticketData.createdAt).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                        <p className="text-sm">{ticketData.message}</p>
                      </div>

                      {/* Replies */}
                      {allReplies.length > 0 && (
                        <div className="space-y-4">
                          {allReplies.map((reply, i) => (
                            <div
                              key={reply.id || i}
                              className={cn(
                                "p-4 rounded-2xl max-w-[85%]",
                                reply.author === "admin"
                                  ? "bg-primary/10 mr-auto rounded-tl-none border-l-4 border-primary"
                                  : "bg-muted ml-auto rounded-tr-none",
                                reply.isOptimistic && "opacity-70",
                              )}
                            >
                              <p className="text-xs font-bold mb-1 uppercase tracking-tighter opacity-60">
                                {reply.author === "admin"
                                  ? t("contact.ticket.support")
                                  : t("contact.ticket.you")}{" "}
                                •{" "}
                                {new Date(reply.createdAt || messageTimes[reply.id] || ticketData.updatedAt).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' })}
                                {reply.isOptimistic && (
                                  <span className="ml-1">(sending...)</span>
                                )}
                              </p>
                              <p className="text-sm">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {ticketData.ticketStatus !== "closed" && (
                        <form
                          onSubmit={handleAddReply}
                          className="mt-6 pt-4 border-t"
                        >
                          <p className="text-sm font-medium mb-3">
                            {t("contact.form.message")}:
                          </p>
                          <div className="flex gap-2">
                            <textarea
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              placeholder={t("chat.placeholder")}
                              rows={2}
                              className="flex-grow bg-muted/30 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                            <button
                              type="submit"
                              disabled={isSendingReply || !replyMessage.trim()}
                              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              <span className="flex items-center">
                                {isSendingReply ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                              </span>
                            </button>
                          </div>
                        </form>
                      )}

                      {ticketData.ticketStatus === "closed" && (
                        <div className="mt-6 p-4 bg-slate-100 rounded-xl text-center">
                          <p className="text-sm text-foreground">
                            This ticket is closed. If you need further
                            assistance, please create a new ticket.
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setTicketData(null)}
                      className="w-full py-4 border-2 border-dashed rounded-2xl text-foreground hover:text-primary hover:border-primary transition-all font-medium mt-8"
                    >
                      {t("contact.ticket.back")}
                    </button>
                  </div>
                </div>
              ) : submittedId ? (
                <div className="bg-background border rounded-3xl p-12 text-center shadow-sm">
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
                      onClick={() => fetchTicket(submittedId)}
                      className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
                    >
                      {t("contact.form.viewStatus")}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-background border rounded-3xl p-8 md:p-10 shadow-sm space-y-6"
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
