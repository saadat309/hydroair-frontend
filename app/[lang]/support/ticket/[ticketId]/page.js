"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import { useTranslation } from "@/lib/i18n";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  Ticket,
  MessageCircle,
  RefreshCw,
  Lock,
  Mail as MailIcon,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import { fetchAPI } from "@/lib/api";
import useTicketStore from "@/lib/stores/useTicketStore";

export default function TicketDetailsPage({ params }) {
  const { ticketId, lang } = use(params);
  const { t, locale } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlToken = searchParams.get("token");

  const [ticketData, setTicketData] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(true);
  const [error, setError] = useState(null);

  // Secure access states
  const { activeToken, setToken, clearAccess } = useTicketStore();
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const [accessEmail, setAccessEmail] = useState("");
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [accessRequested, setAccessRequested] = useState(false);

  // Reply functionality
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [optimisticReplies, setOptimisticReplies] = useState([]);

  // Track message arrival times locally
  const [messageTimes, setMessageTimes] = useState({});

  const recordMessageTimes = useCallback((conversation, fallbackTime) => {
    if (!conversation) return;
    setMessageTimes((prev) => {
      const newTimes = { ...prev };
      let hasNew = false;
      conversation.forEach((msg) => {
        if (!newTimes[msg.id]) {
          const isFirstLoad = Object.keys(prev).length === 0;
          newTimes[msg.id] = isFirstLoad
            ? fallbackTime
            : new Date().toISOString();
          hasNew = true;
        }
      });
      return hasNew ? newTimes : prev;
    });
  }, []);

  // Polling for real-time updates
  const pollingRef = useRef(null);
  const lastReplyCountRef = useRef(0);

  const fetchTicket = useCallback(
    async (id, token) => {
      if (!id || !token) return;
      
      setLoadingTicket(true);
      setError(null);
      try {
        const data = await fetchAPI(`/support-tickets/by-ticket-id/${id}`, {
          token: token
        });
        if (data.data) {
          setTicketData(data.data);
          recordMessageTimes(data.data.conversation, data.data.updatedAt);
          setOptimisticReplies([]);
          lastReplyCountRef.current = data.data.conversation?.length || 0;
          setShowAccessRequest(false);
          
          // If we used a token from URL, save it to store
          if (token === urlToken) {
            setToken(urlToken);
          }
        }
      } catch (err) {
        console.error("Failed to fetch ticket:", err);
        if (err.message.includes("403") || err.message.includes("forbidden") || err.message.toLowerCase().includes("token")) {
           setShowAccessRequest(true);
        } else {
          setError("Failed to load ticket details.");
        }
      } finally {
        setLoadingTicket(false);
      }
    },
    [recordMessageTimes, setToken, urlToken],
  );

  // Initial load logic
  useEffect(() => {
    const tokenToUse = urlToken || activeToken;
    if (tokenToUse) {
      fetchTicket(ticketId, tokenToUse);
    } else {
      setShowAccessRequest(true);
      setLoadingTicket(false);
    }
  }, [ticketId, urlToken, activeToken, fetchTicket]);

  // Polling for new messages
  useEffect(() => {
    const tokenToUse = urlToken || activeToken;
    if (ticketData?.ticketId && ticketData?.ticketStatus !== "closed" && tokenToUse) {
      pollingRef.current = setInterval(async () => {
        try {
          const data = await fetchAPI(
            `/support-tickets/by-ticket-id/${ticketData.ticketId}`,
            { token: tokenToUse }
          );
          if (data.data) {
            const currentReplyCount = data.data.conversation?.length || 0;
            if (currentReplyCount !== lastReplyCountRef.current) {
              setTicketData(data.data);
              recordMessageTimes(data.data.conversation, data.data.updatedAt);
              lastReplyCountRef.current = currentReplyCount;
              setOptimisticReplies([]);
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
  }, [ticketData?.ticketId, ticketData?.ticketStatus, recordMessageTimes, activeToken, urlToken]);

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    if (!ticketId || !accessEmail) return;
    setIsRequestingAccess(true);
    try {
      await fetchAPI('/support-tickets/request-access', {
        method: 'POST',
        body: JSON.stringify({ ticketId, email: accessEmail })
      });
      setAccessRequested(true);
    } catch (err) {
      console.error("Failed to request access:", err);
    } finally {
      setIsRequestingAccess(false);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    const tokenToUse = urlToken || activeToken;
    if (!replyMessage.trim() || !ticketData || !tokenToUse) return;

    const messageText = replyMessage.trim();
    const tempId = Date.now();

    const optimisticReply = {
      id: tempId,
      message: messageText,
      author: "user",
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setOptimisticReplies((prev) => [...prev, optimisticReply]);
    setReplyMessage("");
    setIsSendingReply(true);

    try {
      const data = await fetchAPI(
        `/support-tickets/by-ticket-id/${ticketData.ticketId}/reply`,
        {
          method: "POST",
          body: JSON.stringify({ message: messageText, author: "user", token: tokenToUse }),
        },
      );
      if (data.data) {
        setTicketData(data.data);
        recordMessageTimes(data.data.conversation, data.data.updatedAt);
        setOptimisticReplies([]);
        lastReplyCountRef.current = data.data.conversation?.length || 0;
      }
    } catch (err) {
      console.error("Failed to add reply:", err);
      setOptimisticReplies((prev) => prev.filter((r) => r.id !== tempId));
    } finally {
      setIsSendingReply(false);
    }
  };

  const allReplies = [
    ...(ticketData?.conversation || []),
    ...optimisticReplies,
  ];

  if (loadingTicket) {
    return (
      <div className="min-h-screen pb-20">
        <PageHeader title={t("contact.ticket.title")} />
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeader title={t("contact.ticket.title")} />

      <div className="container mx-auto px-4 pb-12 -mt-5 md:-mt-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("contact.ticket.back")}
            </Link>
          </div>

          {showAccessRequest ? (
            <div className="bg-background rounded-lg p-12 text-center shadow-xl border border-border">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {t("contact.ticket.secureAccess")}
              </h2>
              <p className="text-foreground/70 mb-8 text-lg max-w-md mx-auto">
                {t("contact.ticket.secureDescription")}
              </p>
              
              {accessRequested ? (
                <div className="bg-emerald-50 text-emerald-700 p-8 rounded-3xl border border-emerald-100 mb-6 max-w-md mx-auto">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                  <p className="font-bold text-lg leading-tight">
                    {t("contact.ticket.accessSent")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestAccess} className="max-w-md mx-auto space-y-4">
                  <div className="relative">
                    <MailIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      required
                      type="email"
                      value={accessEmail}
                      onChange={(e) => setAccessEmail(e.target.value)}
                      placeholder={t("contact.ticket.emailPlaceholder")}
                      className="w-full bg-muted/30 border border-muted-foreground/10 rounded-2xl pl-14 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <button
                    disabled={isRequestingAccess}
                    className="w-full bg-primary text-primary-foreground h-16 rounded-2xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isRequestingAccess ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      t("contact.ticket.requestAccess")
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : error ? (
            <div className="bg-background rounded-lg p-12 text-center shadow-xl border border-border">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-4">{error}</h2>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
              >
                {t("common.retry") || "Retry"}
              </button>
            </div>
          ) : ticketData && (
            <div className="bg-background rounded-lg p-8 shadow-xl border border-border">
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

                <div className="border-t pt-6">
                  <h3 className="font-bold flex items-center gap-2 mb-4">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    {t("contact.ticket.conversation")}
                  </h3>

                  <div className="bg-muted/30 p-4 rounded-2xl rounded-tr-none mb-4 ml-auto max-w-[85%]">
                    <p className="text-xs font-bold mb-1 uppercase tracking-tighter opacity-60">
                      {t("contact.ticket.you")} •{" "}
                      {new Date(ticketData.createdAt).toLocaleString(
                        locale,
                        { dateStyle: "short", timeStyle: "short" },
                      )}
                    </p>
                    <p className="text-sm">{ticketData.message}</p>
                  </div>

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
                            {new Date(
                              reply.createdAt ||
                                messageTimes[reply.id] ||
                                ticketData.updatedAt,
                            ).toLocaleString(locale, {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                            {reply.isOptimistic && (
                              <span className="ml-1">(sending...)</span>
                            )}
                          </p>
                          <p className="text-sm">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
