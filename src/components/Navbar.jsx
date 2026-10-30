import React, { useState, useEffect } from "react";
import {
  Scissors,
  Phone,
  MapPin,
  Instagram,
  Menu,
  X,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { BARBERSHOP_INFO } from "../data/barbershopData";

const NAV_LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#barbeiros", label: "Barbeiros" },
  { href: "#servicos", label: "Serviços" },
  { href: "#agendar", label: "Agendar" },
  { href: "#agenda", label: "Agenda" },
  { href: "#loja", label: "Pub & Loja" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#galeria", label: "Galeria" },
  { href: "#contato", label: "Contato" },
];

export default function Navbar({ onQuickBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-gradient-to-b from-background/90 via-background/55 to-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#inicio"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gold/60 bg-black flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform">
            <img
              src="./images/logo-sr-jose.jpg"
              alt="Logo Barbearia Senhor José"
              className="w-full h-full object-cover scale-125"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg md:text-xl font-extrabold tracking-wide leading-none text-foreground">
              SENHOR <span className="text-gradient-gold italic">JOSÉ</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-0.5">
              Barbearia & Pub • Maringá
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden xl:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <a
            href={BARBERSHOP_INFO.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram @barbeariasenhorjosemaringa"
            className="w-10 h-10 rounded-full border border-border bg-card/60 hover:border-gold/50 hover:text-gold flex items-center justify-center text-muted-foreground transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>

          <button
            onClick={onQuickBook}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-gold text-primary-foreground text-sm font-bold shadow-gold hover:brightness-110 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar</span>
          </button>

          <a
            href={BARBERSHOP_INFO.links.whatsappPrimary}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25d366]/15 border border-[#25d366]/40 text-[#5ee29a] hover:bg-[#25d366]/25 text-sm font-bold transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#25d366]" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={BARBERSHOP_INFO.links.whatsappPrimary}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#25d366]/15 border border-[#25d366]/40 text-[#5ee29a] text-xs font-bold"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25d366]" />
            <span>Whats</span>
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menu"
            className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-background-2/95 backdrop-blur-xl border-b border-border px-5 py-6 space-y-4 animate-fade-up">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3.5 py-2.5 rounded-xl bg-card border border-border/60 text-sm font-medium text-foreground hover:border-gold/50 hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-border flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                setMobileOpen(false);
                onQuickBook();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-bold shadow-gold"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Horário Online</span>
            </button>
            <a
              href={BARBERSHOP_INFO.links.whatsappPrimary}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25d366] text-[#04240f] text-sm font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp {BARBERSHOP_INFO.phonePrimary}</span>
            </a>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              {BARBERSHOP_INFO.address.street} — {BARBERSHOP_INFO.address.neighborhood}
            </span>
            <a
              href={BARBERSHOP_INFO.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              {BARBERSHOP_INFO.links.instagramHandle}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
