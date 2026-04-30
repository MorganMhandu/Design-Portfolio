"use client";

import { useAdmin } from "@/context/AdminContext";
import { Mail, Trash2, Eye, EyeOff, Inbox } from "lucide-react";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function InquiryLog() {
  const { messages, markRead, deleteMessage } = useAdmin();

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-base font-bold text-white tracking-[0.15em] uppercase">Inquiry Log</h2>
          <p className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest mt-0.5">
            {messages.length} total transmission{messages.length !== 1 ? "s" : ""}
            {unread > 0 && (
              <span className="ml-3 text-[#00F2FF] font-bold">
                {unread} UNREAD
              </span>
            )}
          </p>
        </div>
        {unread > 0 && (
          <div className="flex items-center gap-2 bg-[#00F2FF]/10 border border-[#00F2FF]/30 rounded-lg px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF] animate-pulse shadow-[0_0_6px_rgba(0,242,255,0.8)]" />
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#00F2FF]">
              {unread} New Transmission{unread !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div className="w-16 h-16 rounded-2xl border border-[#00F2FF]/20 bg-[#00F2FF]/5 flex items-center justify-center">
            <Inbox className="w-7 h-7 text-[#00F2FF]/30" />
          </div>
          <div className="text-center">
            <p className="font-mono text-sm text-[#94A3B8]/40 tracking-[0.2em] uppercase">No Transmissions Received</p>
            <p className="font-mono text-[9px] text-[#94A3B8]/25 tracking-widest mt-1">
              Messages submitted via the public Engage terminal will appear here.
            </p>
          </div>
          <div className="font-mono text-[8px] tracking-widest text-[#00F2FF]/20 uppercase flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00F2FF]/20 animate-pulse" />
            AWAITING_TRANSMISSION
          </div>
        </div>
      )}

      {/* Message list */}
      <div className="flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`group border rounded-xl p-5 transition-all duration-300 ${
              msg.read
                ? "border-[#00F2FF]/10 bg-black/20"
                : "border-[#00F2FF]/30 bg-[#00F2FF]/5 shadow-[0_0_20px_rgba(0,242,255,0.05)]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: Sender info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${msg.read ? "border-[#00F2FF]/15 bg-black/30" : "border-[#00F2FF]/40 bg-[#00F2FF]/10"}`}>
                  <Mail className={`w-4 h-4 ${msg.read ? "text-[#00F2FF]/30" : "text-[#00F2FF]/70"}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`font-mono text-sm font-bold truncate ${msg.read ? "text-white/70" : "text-white"}`}>
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span className="font-mono text-[7px] tracking-widest uppercase bg-[#00F2FF] text-black px-1.5 py-0.5 rounded font-bold">
                        NEW
                      </span>
                    )}
                    <span className="font-mono text-[9px] text-[#94A3B8]/50 tracking-widest">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-[#00F2FF]/60 tracking-widest truncate mt-0.5">
                    {msg.email}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => markRead(msg.id)}
                  disabled={msg.read}
                  className="p-1.5 text-[#00F2FF]/50 hover:text-[#00F2FF] hover:bg-[#00F2FF]/10 rounded transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  title={msg.read ? "Already read" : "Mark as read"}
                >
                  {msg.read ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { if (window.confirm("Delete this transmission?")) deleteMessage(msg.id); }}
                  className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Message body */}
            <div className={`mt-4 pl-12 font-mono text-xs leading-relaxed border-l-2 ${msg.read ? "border-[#00F2FF]/10 text-[#94A3B8]/50" : "border-[#00F2FF]/30 text-[#94A3B8]/80"}`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
