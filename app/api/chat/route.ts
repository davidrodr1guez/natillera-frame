import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const NATILLERA_CONTEXT = `
Eres el agente de Natillera On-Chain, un sistema de ahorro rotativo descentralizado en la blockchain de Celo.

SOBRE EL PROYECTO:
- Natillera On-Chain es un grupo de ahorro rotativo (tanda/natillera) en Celo Mainnet
- Los participantes contribuyen periódicamente en cUSD (stablecoin)
- En cada ronda, una persona recibe el pozo completo
- El sistema es transparente, autónomo y sin intermediarios
- Agent ID: #12 registrado en ERC-8004 (estándar de identidad on-chain)
- Reputación verificada: ~96-97/100 (25 feedbacks on-chain)
- Verificación SelfClaw: identidad humana verificada con ZK proof

NATILLERAS ACTIVAS:
1. 🇨🇴 Natillera Colombia — 0xE9D8670897b7AEdFD7a7ACB783c229d63Ce76F2E
2. 🏔️ Ahorro Semanal Medellín — 0xBbBE5ea3aF0bb6abea36f507DfD722F6c70E8926
3. 👨‍👩‍👧‍👦 Tanda Familiar Bogotá — 0x28F97572d0f70ff7596e12e3C1043517FB96d046
4. 🎄 Natillera Navideña — 0x3416455b8b23957E2Fe1d72ceFA0F7f3c09b4415

CONTRATOS:
- Factory: 0x6567645D4150AbC2c7802DaD76711be8b8669171 (Celo Mainnet)
- cUSD: 0x765DE816845861e75A25fCA122bb6898B8B1282a

LINKS:
- Frontend completo: https://frontend-neon-nine-31.vercel.app
- Celoscan: https://celoscan.io/address/0xE9D8670897b7AEdFD7a7ACB783c229d63Ce76F2E

FUNCIONALIDADES DEL SMART CONTRACT:
- Crear grupo con nombre, monto en cUSD, frecuencia (semanal/quincenal/mensual)
- Unirse depositando colateral (= 1 contribución)
- Contribuir cada ronda con la cuota en cUSD
- Pago automático al recipiente cuando todos contribuyen
- Orden aleatorio de pagos (shuffle con prevrandao)
- Penalización por no pagar a tiempo (pierde colateral)
- Colateral devuelto al completar todas las rondas

INSTRUCCIONES:
- Responde siempre en español
- Sé conciso y directo
- Si te preguntan sobre el estado on-chain específico, indica que pueden verificarlo en Celoscan o en el frontend
- Puedes ayudar a unirse, entender cómo funciona, y resolver dudas sobre el proyecto
- Eres un agente autónomo que gestiona estas natilleras
`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Agent not configured" }, { status: 500 });
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: NATILLERA_CONTEXT },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Lo siento, no pude procesar tu pregunta.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { reply: "Lo siento, hubo un error. Por favor intenta de nuevo." },
      { status: 200 }
    );
  }
}
