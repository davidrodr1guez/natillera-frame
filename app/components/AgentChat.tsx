"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "agent";
  text: string;
}

const SUGGESTED = [
  "¿Cuál es el estado de las natilleras?",
  "¿Cómo unirme a un grupo?",
  "¿Cuándo es el próximo pago?",
];

const INITIAL_MESSAGE =
  "Soy el agente autónomo que gestiona las natilleras on-chain. Controlo 4 grupos de ahorro con contribuciones registradas en Celo Mainnet. ¿Qué necesitas?";

export default function AgentChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", text: INITIAL_MESSAGE },
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
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #35D07F 0%, #2ab86d 100%)",
            border: "1px solid rgba(53,208,127,0.5)",
            cursor: "pointer",
            fontSize: "24px",
            boxShadow:
              "0 4px 20px rgba(53,208,127,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow =
              "0 6px 28px rgba(53,208,127,0.5), inset 0 1px 0 rgba(255,255,255,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(53,208,127,0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
          }}
          title="Habla con el Agente"
        >
          🤖
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            width: "min(380px, calc(100vw - 32px))",
            height: "min(520px, calc(100vh - 32px))",
            background: "#0a0f1a",
            borderRadius: "20px",
            border: "1px solid rgba(53,208,127,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 200,
            boxShadow:
              "0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(53,208,127,0.1)",
            fontFamily:
              "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              background:
                "linear-gradient(180deg, rgba(53,208,127,0.08) 0%, transparent 100%)",
              borderBottom: "1px solid rgba(53,208,127,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, rgba(53,208,127,0.2) 0%, rgba(53,208,127,0.05) 100%)",
                  border: "1px solid rgba(53,208,127,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                🤖
              </div>
              <div>
                <div
                  style={{
                    color: "#F1F5F9",
                    fontWeight: 700,
                    fontSize: "13px",
                    letterSpacing: "0.02em",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  Natillera Agent{" "}
                  <span style={{ color: "#35D07F" }}>#12</span>
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "10px",
                    letterSpacing: "0.05em",
                    marginTop: "2px",
                    fontFamily:
                      "'SF Mono', 'Fira Code', monospace",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#35D07F",
                      marginRight: "5px",
                      boxShadow: "0 0 6px rgba(53,208,127,0.6)",
                      verticalAlign: "middle",
                    }}
                  />
                  Autónomo · Celo Mainnet · ERC-8004
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "14px",
                padding: "4px 8px",
                borderRadius: "6px",
                lineHeight: 1,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
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
              padding: "14px 14px",
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
                    maxWidth: "82%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "14px 14px 4px 14px"
                        : "14px 14px 14px 4px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #35D07F 0%, #2ab86d 100%)"
                        : "rgba(255,255,255,0.06)",
                    border:
                      msg.role === "user"
                        ? "none"
                        : "1px solid rgba(255,255,255,0.06)",
                    color: msg.role === "user" ? "#0a0f1a" : "#e2e8f0",
                    fontSize: "13px",
                    lineHeight: "1.55",
                    fontFamily: "system-ui, -apple-system, sans-serif",
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
                    padding: "10px 14px",
                    borderRadius: "14px 14px 14px 4px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(53,208,127,0.7)",
                    fontSize: "13px",
                    fontFamily:
                      "'SF Mono', 'Fira Code', monospace",
                    letterSpacing: "0.05em",
                  }}
                >
                  ⟳ consultando chain...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div
              style={{
                padding: "0 14px 10px",
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
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(53,208,127,0.25)",
                    background: "rgba(53,208,127,0.06)",
                    color: "#35D07F",
                    fontSize: "11px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(53,208,127,0.15)";
                    e.currentTarget.style.borderColor =
                      "rgba(53,208,127,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(53,208,127,0.06)";
                    e.currentTarget.style.borderColor =
                      "rgba(53,208,127,0.25)";
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
              padding: "12px 14px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(0,0,0,0.2)",
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
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "10px 14px",
                color: "#F1F5F9",
                fontSize: "13px",
                outline: "none",
                fontFamily: "system-ui, -apple-system, sans-serif",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(53,208,127,0.4)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                padding: "10px 16px",
                background: input.trim()
                  ? "linear-gradient(135deg, #35D07F 0%, #2ab86d 100%)"
                  : "rgba(53,208,127,0.15)",
                border: "none",
                borderRadius: "10px",
                color: input.trim() ? "#0a0f1a" : "rgba(53,208,127,0.4)",
                fontWeight: 700,
                cursor: input.trim() ? "pointer" : "default",
                fontSize: "14px",
                transition: "all 0.15s ease",
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
