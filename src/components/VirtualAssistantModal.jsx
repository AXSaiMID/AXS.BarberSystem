import React, { useState } from "react";
import {
  MessageCircle,
  Sparkles,
  X,
  Send,
  Calendar,
  MapPin,
  Clock,
  Scissors,
  PhoneCall,
} from "lucide-react";
import { BARBERSHOP_INFO } from "../data/barbershopData";

const QUICK_QUESTIONS = [
  {
    id: "precos",
    label: "💈 Tabela de preços",
    reply:
      "Nossos valores principais: Corte Social R$ 50, Corte Degradê R$ 55, Corte na Tesoura (nossa especialidade!) R$ 60, Corte Infantil R$ 50, Barboterapia na Toalha Quente R$ 50 e o Combo Sr. José (Corte + Barba + Chopp/Café) por R$ 95!",
  },
  {
    id: "horarios",
    label: "🕒 Horários de atendimento",
    reply:
      "Atendemos de Terça a Sexta das 10:00 às 20:00 (toda quarta tem nosso tradicional Hambúrguer Artesanal 🍔) e aos Sábados das 09:00 às 17:00. Domingo e Segunda estamos fechados.",
  },
  {
    id: "endereco",
    label: "📍 Endereço e estacionamento",
    reply:
      "Estamos na R. Raimundo Corrêa, 276 — Zona 06, Maringá/PR (CEP 87015-400), pertinho do Bosque das Grevíleas! Ambiente climatizado, acessível e com fácil estacionamento.",
  },
  {
    id: "pub",
    label: "🎱 Tem sinuca, chopp e kids?",
    reply:
      "Sim! Desde 2016 somos especialistas em cortes na tesoura e cortes infantis em um ambiente 100% familiar. Além disso, temos mesa de sinuca brasileira, chopp gelado, drinks, café cortado e espaço gourmet!",
  },
];

export default function VirtualAssistantModal({ onGoToBooking }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Sou o Atendente Virtual da Barbearia Senhor José em Maringá 🎩💈 Como posso ajudar você hoje?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleQuickQuestion = (q) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: q.label },
      { sender: "bot", text: q.reply },
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    let botReply =
      "Excelente! Você pode escolher seu barbeiro (Gui Brisce, Nil, Lucas, Rafael, Matheus ou Diego) aqui mesmo na seção 'Agende seu horário' ou confirmar direto no nosso WhatsApp (44) 3047-2202.";

    if (lower.includes("preço") || lower.includes("valor") || lower.includes("corte") || lower.includes("quanto")) {
      botReply =
        "O Corte Social é R$ 50, Degradê R$ 55, Corte na Tesoura R$ 60, Corte Infantil R$ 50, Barboterapia R$ 50 e o Combo Corte + Barba sai por R$ 95 (com chopp ou café cortado!). Quer reservar um horário?";
    } else if (lower.includes("endereço") || lower.includes("onde") || lower.includes("local") || lower.includes("mapa")) {
      botReply =
        "Ficamos na R. Raimundo Corrêa, 276 — Zona 06, Maringá/PR (CEP 87015-400), próximo ao Bosque das Grevíleas.";
    } else if (lower.includes("horário") || lower.includes("abre") || lower.includes("sábado") || lower.includes("hoje")) {
      botReply =
        "Funcionamos de Terça a Sexta das 10h às 20h e aos Sábados das 09h às 17h. Domingo e Segunda fechado.";
    } else if (lower.includes("telefone") || lower.includes("whats") || lower.includes("contato")) {
      botReply =
        "Nosso telefone e WhatsApp principal é (44) 3047-2202 (também atendemos no (44) 99881-2871 e (44) 3040-2222).";
    } else if (lower.includes("nil") || lower.includes("gui") || lower.includes("barbeiro")) {
      botReply =
        "Nosso time conta com o fundador Guilherme Brisce (Gui), o barbeiro Nil (super elogiado nas avaliações 5★ do Google!), Lucas (especialista infantil e tesoura), Rafael, Matheus e Diego!";
    }

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: trimmed },
      { sender: "bot", text: botReply },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Floating Button matching DESIGN.md `button-secondary` (`button.glass.rounded-full.pl-3`) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setOpen(!open)}
          className="glass rounded-full pl-3 pr-5 py-2.5 min-h-[62px] sm:w-[352px] border border-border shadow-gold-soft hover:border-gold/60 transition-all flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold shadow-gold animate-pulse-gold shrink-0">
              <Sparkles className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25d366] border-2 border-background" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gold flex items-center gap-1.5">
                <span>ATENDENTE VIRTUAL</span>
                <span className="px-1.5 py-0.5 rounded bg-gold/15 text-[9px] text-gold-light">
                  Atendente IA
                </span>
              </div>
              <div className="text-xs sm:text-sm text-foreground/90 font-medium line-clamp-1">
                Agende pelo chat ou WhatsApp
              </div>
            </div>
          </div>
          <MessageCircle className="w-5 h-5 text-[#25d366] group-hover:scale-110 transition-transform shrink-0" />
        </button>
      </div>

      {/* Chat Drawer Modal */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[390px] rounded-2xl bg-card border border-gold/40 shadow-2xl overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="p-4 bg-background-2 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="./images/logo-sr-jose.jpg"
                alt="Sr. José"
                className="w-10 h-10 rounded-full object-cover border border-gold/50"
              />
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  Concierge Sr. José
                  <span className="w-2 h-2 rounded-full bg-[#25d366]" />
                </h4>
                <p className="text-xs text-muted-foreground">
                  R. Raimundo Corrêa, 276 • (44) 3047-2202
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-lg border border-border hover:border-gold/50 flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 max-h-72 overflow-y-auto space-y-3 bg-background/60">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-gold text-primary-foreground font-semibold rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Quick Reply Chips */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs px-2.5 py-1.5 rounded-full bg-background-2 border border-border hover:border-gold/60 text-foreground/85 hover:text-gold transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-card border-t border-border flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre cortes, preços, horários..."
              className="flex-1 bg-background-2 border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-gradient-gold text-primary-foreground flex items-center justify-center shadow-gold hover:brightness-110"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Direct Actions Footer */}
          <div className="px-3 pb-3 pt-1 bg-card grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setOpen(false);
                onGoToBooking();
              }}
              className="py-2 px-3 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gold/25 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              Agendar pelo Site
            </button>
            <a
              href={BARBERSHOP_INFO.links.whatsappPrimary}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-[#25d366] text-[#04240f] text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-105 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Abrir WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
