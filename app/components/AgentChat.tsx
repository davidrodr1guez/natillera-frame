"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "agent";
  text: string;
}

const SUGGESTED = [
  "¿Cómo funciona?",
  "¿Cómo me uno?",
  "¿Cuándo recibo mi pago?",
];

export default function AgentChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      text: "¡Hola! Soy el Agente Natillera On-Chain (#12). ¿En qué te puedo ayudar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "agent", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Error de conexión. Intenta de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#35D07F",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          boxShadow: "0 4px 16px rgba(53,208,127,0.4)",
          zIndex: 100,
          display: open ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Habla con el Agente"
      >
        🤖
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            width: "min(360px, calc(100vw - 32px))",
            height: "480px",
            background: "#0f1923",
            borderRadius: "16px",
            border: "1px solid rgba(53,208,127,0.3)",
            display: "flex",
            flexDirection: "column",
            zIndex: 200,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <span style={{ fontSize: "20px" }}>🤖</span>
              <div>
                <div
                  style={{
                    color: "#35D07F",
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                >
                  Agente Natillera
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "11px",
                  }}
                >
                  ERC-8004 ID #12 · On-Chain
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontSize: "18px",
                padding: "4px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "8px 12px",
                    borderRadius:
                      msg.role === "user"
                        ? "12px 12px 2px 12px"
                        : "12px 12px 12px 2px",
                    background:
                      msg.role === "user"
                        ? "#35D07F"
                        : "rgba(255,255,255,0.08)",
                    color: msg.role === "user" ? "#0a0f1a" : "#fff",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "12px 12px 12px 2px",
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                  }}
                >
                  Pensando...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div
              style={{
                padding: "0 12px 8px",
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    border: "1px solid rgba(53,208,127,0.4)",
                    background: "transparent",
                    color: "#35D07F",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Pregúntale al agente..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                padding: "8px 14px",
                background: input.trim()
                  ? "#35D07F"
                  : "rgba(53,208,127,0.3)",
                border: "none",
                borderRadius: "8px",
                color: "#0a0f1a",
                fontWeight: 700,
                cursor: input.trim() ? "pointer" : "default",
                fontSize: "13px",
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
