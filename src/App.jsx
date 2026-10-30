import React, { useState, useEffect } from "react";
import {
  Scissors,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Star,
  Check,
  Clock,
  Calendar,
  MessageCircle,
  ExternalLink,
  Beer,
  Sparkles,
  Award,
  Users,
  ShieldCheck,
  Navigation,
  ShoppingBag,
  CreditCard,
  Banknote,
  QrCode,
  Gift,
  X,
  ZoomIn,
} from "lucide-react";
import Navbar from "./components/Navbar";
import BookingSection from "./components/BookingSection";
import VirtualAssistantModal from "./components/VirtualAssistantModal";
import {
  BARBERSHOP_INFO,
  BARBERS,
  SERVICE_CATEGORIES,
  INITIAL_BOOKINGS,
  OPENING_HOURS,
  GOOGLE_REVIEWS,
  REVIEW_TAGS,
  GALLERY_ITEMS,
  PUB_AND_SHOP_ITEMS,
} from "./data/barbershopData";

export default function App() {
  const [selectedBarberId, setSelectedBarberId] = useState("gui");
  const [selectedServiceIds, setSelectedServiceIds] = useState(["corte-tesoura"]);
  const [activeServiceTab, setActiveServiceTab] = useState("all");
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState(null);

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem("sr_jose_bookings_v1");
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sr_jose_bookings_v1", JSON.stringify(bookings));
    } catch {
      // ignore storage errors
    }
  }, [bookings]);

  const handleAddBooking = (newBooking) => {
    setBookings((prev) => [...prev, newBooking]);
  };

  const scrollToBooking = () => {
    const el = document.getElementById("agendar");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectBarberAndBook = (barberId) => {
    setSelectedBarberId(barberId);
    scrollToBooking();
  };

  const handleSelectServiceAndBook = (serviceId) => {
    setSelectedServiceIds([serviceId]);
    scrollToBooking();
  };

  const heroPhotos = [
    {
      src: "./images/interior-sinuca-sr-jose.jpg",
      label: "Interior Real • Sinuca, Bar & Cadeiras Clássicas",
      caption: "R. Raimundo Corrêa, 276 — Zona 06, Maringá/PR",
    },
    {
      src: "./images/fachada-sr-jose.jpg",
      label: "Fachada Real • Nosso Espaço em Maringá",
      caption: "Pergolado em madeira, estacionamento fácil e ambiente familiar",
    },
    {
      src: "./images/corte-tesoura.jpg",
      label: "Especialidade • Corte na Tesoura & Infantil",
      caption: "Tradição e atendimento 100% desde 2016",
    },
  ];

  // Current day index (Thursday = 4 for Oct 29, 2026)
  const todayDayIndex = new Date().getDay();

  const displayedServiceCategories =
    activeServiceTab === "all"
      ? SERVICE_CATEGORIES
      : SERVICE_CATEGORIES.filter((cat) => cat.id === activeServiceTab);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* TOP NAVIGATION */}
      <Navbar onQuickBook={scrollToBooking} />

      {/* HERO SECTION (`section#inicio`) */}
      <section
        id="inicio"
        className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden"
      >
        {/* Background Backdrop */}
        <div className="absolute inset-0 -z-10">
          <img
            src="./images/interior-sinuca-sr-jose.jpg"
            alt="Interior da Barbearia Senhor José em Maringá"
            className="w-full h-full object-cover opacity-25 scale-105 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-gold/10 blur-2xl rounded-full pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center">
            {/* Left Column: Hero Copy */}
            <div className="space-y-6 animate-fade-up">
              <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/90 border border-gold/40 text-xs font-semibold text-foreground shadow-gold-soft">
                <span>💈 Desde 2016 em Maringá</span>
                <span className="text-gold">•</span>
                <span className="text-gold font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  5.0 no Google (95 avaliações)
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-[68px] font-extrabold text-foreground leading-[1.05] tracking-tight">
                Tornando você{" "}
                <em className="text-gradient-gold italic font-extrabold">
                  diferente
                </em>{" "}
                dos{" "}
                <em className="text-gradient-gold italic font-extrabold">
                  iguais.
                </em>
              </h1>

              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl font-normal">
                Especialista em <strong className="text-foreground">cortes na tesoura</strong>,{" "}
                <strong className="text-foreground">cortes infantis</strong>, degradê e
                barba na toalha quente na <strong className="text-gold">Zona 06 de Maringá</strong>.
                Ambiente familiar estilo Pub com sinuca brasileira, chopp gelado,
                drinks e hambúrguer toda quarta-feira.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={scrollToBooking}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-gradient-gold text-primary-foreground text-sm md:text-base font-extrabold shadow-gold hover:brightness-110 hover:-translate-y-0.5 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Agendar meu horário</span>
                </button>

                <a
                  href={BARBERSHOP_INFO.links.whatsappPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[#25d366]/15 border border-[#25d366]/50 text-[#5ee29a] hover:bg-[#25d366]/25 text-sm md:text-base font-bold transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-[#25d366]" />
                  <span>Falar no WhatsApp {BARBERSHOP_INFO.phonePrimary}</span>
                </a>
              </div>

              {/* Quick Address & Instagram Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                <a
                  href={BARBERSHOP_INFO.links.googleMapsShort}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
                >
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span>
                    R. Raimundo Corrêa, 276 — Zona 06, Maringá/PR
                  </span>
                </a>
                <span className="hidden sm:inline text-border">•</span>
                <a
                  href={BARBERSHOP_INFO.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-gold hover:underline font-semibold"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{BARBERSHOP_INFO.links.instagramHandle}</span>
                </a>
              </div>

              {/* 4 KPI Stats Strip (matching Wolf Base44 layout) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                {[
                  { value: "2016", label: "Tradição em Maringá" },
                  { value: "5.0 ★", label: "95 Avaliações Google" },
                  { value: "6", label: "Barbeiros Especialistas" },
                  { value: "BAR & PUB", label: "Sinuca, Chopp & Café" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-card/80 border border-border text-center sm:text-left"
                  >
                    <div className="font-heading text-xl md:text-2xl font-extrabold text-gold">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: `card-primary` (height: 452px, rounded-2xl, border #2D261B) */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-border bg-card h-[452px] shadow-gold relative group">
                <img
                  src={heroPhotos[heroImageIndex].src}
                  alt={heroPhotos[heroImageIndex].label}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                {/* Top Floating Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <div className="glass px-3.5 py-1.5 rounded-full text-xs font-bold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
                    <span>Terça a Sábado • Zona 06</span>
                  </div>
                  <div className="glass px-3 py-1.5 rounded-full text-xs font-bold text-gold">
                    📸 Fotos Reais
                  </div>
                </div>

                {/* Bottom Caption & Photo Switcher */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div className="glass p-3.5 rounded-xl backdrop-blur-md">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-gold">
                      {heroPhotos[heroImageIndex].label}
                    </div>
                    <div className="text-xs text-foreground/90 mt-0.5">
                      {heroPhotos[heroImageIndex].caption}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end">
                    {heroPhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setHeroImageIndex(idx)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                          heroImageIndex === idx
                            ? "border-gold scale-105 shadow-gold"
                            : "border-border/70 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={photo.src}
                          alt={photo.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: SOBRE A BARBEARIA (`section#sobre`) */}
      <section
        id="sobre"
        className="py-20 md:py-24 bg-background-2/60 border-y border-border"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
            {/* Left Copy */}
            <div className="space-y-6">
              <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-gold">
                Sobre a Barbearia • Desde 2016
              </span>

              <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight">
                Elegância clássica,{" "}
                <em className="text-gradient-gold italic">BAR...bearia</em> &
                ambiente familiar
              </h2>

              <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                Fundada em <strong className="text-foreground">2016</strong> em
                Maringá e sob direção de{" "}
                <strong className="text-gold">Guilherme Brisce (Gui)</strong>, a{" "}
                <strong className="text-foreground">
                  Barbearia Senhor José
                </strong>{" "}
                nasceu na Rua Raimundo Corrêa, 276 (Zona 06, pertinho do Bosque
                das Grevíleas) com um propósito claro: aqui você é nossa
                prioridade máxima.
              </p>

              <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                Somos reconhecidos em Maringá como{" "}
                <strong className="text-foreground">
                  especialistas em cortes na tesoura e cortes infantis
                </strong>
                , unindo o atendimento familiar 100% personalizado a um autêntico{" "}
                <strong className="text-gold">Barber Pub</strong>: mesa de sinuca
                brasileira, chopp e cerveja gelada, café cortado, drinks
                elegantes, espaço gourmet com{" "}
                <strong className="text-foreground">
                  hambúrguer toda quarta-feira
                </strong>{" "}
                e atendimento exclusivo para{" "}
                <strong className="text-foreground">Dia do Noivo</strong>.
              </p>

              {/* Bullet List */}
              <ul className="space-y-3 pt-1">
                {[
                  "Especialista em cortes na tesoura, degradê e cortes infantis (Kids)",
                  "Ambiente familiar + Pub com sinuca brasileira, chopp, café cortado e drinks",
                  "Quarta do Hambúrguer no nosso espaço gourmet & pacotes Dia do Noivo",
                  "Atendimento com hora marcada pelo site, App ou WhatsApp — zero fila",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-foreground/90">
                    <span className="w-5 h-5 rounded-full bg-gold/20 border border-gold/50 text-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <button
                  onClick={scrollToBooking}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-gold text-primary-foreground text-sm font-extrabold shadow-gold hover:brightness-110 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar agora</span>
                </button>
                <a
                  href="#servicos"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-card border border-border hover:border-gold/50 text-foreground text-sm font-bold transition-all"
                >
                  <span>Ver serviços e preços</span>
                </a>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden border border-border bg-card h-80 sm:h-96 relative">
                  <img
                    src="./images/fachada-sr-jose.jpg"
                    alt="Fachada da Barbearia Senhor José na R. Raimundo Corrêa, 276"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 glass p-3 rounded-xl">
                    <div className="text-xs font-extrabold text-gold">
                      Zona 06 • Maringá/PR
                    </div>
                    <div className="text-[11px] text-foreground/90">
                      R. Raimundo Corrêa, 276
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl overflow-hidden border border-border bg-black p-6 flex flex-col items-center justify-center text-center h-44">
                    <img
                      src="./images/logo-sr-jose.jpg"
                      alt="Emblema Barbearia Sr. José"
                      className="w-24 h-24 object-contain mb-2"
                    />
                    <span className="text-xs font-bold uppercase tracking-widest text-gold">
                      Desde 2016 • Sr. José
                    </span>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-border bg-card flex-1 relative min-h-[190px]">
                    <img
                      src="./images/interior-sinuca-sr-jose.jpg"
                      alt="Mesa de sinuca e bancadas da Barbearia Senhor José"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs font-bold text-gold block">
                        Barba, Cabelo & Beer 🍻🎱
                      </span>
                      <span className="text-[11px] text-foreground/85">
                        Sinuca brasileira, chopp e som ambiente
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: NOSSOS BARBEIROS (`section#barbeiros`) */}
      <section id="barbeiros" className="py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-gold mb-3">
              Time Sr. José
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
              Nossos <em className="text-gradient-gold italic">barbeiros</em>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mt-3">
              Toque no profissional de sua preferência para agendar diretamente com ele.
            </p>
          </div>

          {/* 6 Barber Cards matching DESIGN.md `card-variant-3` (`button.group.relative.text-center`) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {BARBERS.map((barber) => (
              <button
                key={barber.id}
                type="button"
                onClick={() => handleSelectBarberAndBook(barber.id)}
                className="group relative text-center rounded-[16px] bg-card border border-border p-6 min-h-[227px] flex flex-col items-center justify-between hover:border-gold hover:shadow-gold hover:-translate-y-1 transition-all"
              >
                <span className="px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-[10px] font-bold text-gold mb-3">
                  {barber.badge}
                </span>

                <div className="w-16 h-16 rounded-full bg-background-2 border-2 border-gold/40 group-hover:border-gold group-hover:bg-gradient-gold group-hover:text-primary-foreground text-gold font-heading text-xl font-extrabold flex items-center justify-center transition-all mb-3 shadow-gold-soft">
                  {barber.initials}
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-gold transition-colors">
                    {barber.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-gold/80 mt-0.5">
                    {barber.role}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
                    {barber.specialty}
                  </p>
                </div>

                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold opacity-80 group-hover:opacity-100">
                  <span>Agendar com {barber.name}</span>
                  <span>→</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: SERVIÇOS & PREÇOS (`section#servicos`) */}
      <section
        id="servicos"
        className="py-20 md:py-24 bg-background-2/40 border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-gold mb-3">
              Tabela Oficial
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
              Serviços & <em className="text-gradient-gold italic">preços</em>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mt-3">
              Toque em “Agendar” em qualquer serviço para reservar direto na Barbearia Senhor José.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10">
            <button
              type="button"
              onClick={() => setActiveServiceTab("all")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all shrink-0 ${
                activeServiceTab === "all"
                  ? "bg-gradient-gold text-primary-foreground border-gold shadow-gold"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-gold/40"
              }`}
            >
              Todos os Serviços
            </button>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveServiceTab(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all shrink-0 ${
                  activeServiceTab === cat.id
                    ? "bg-gradient-gold text-primary-foreground border-gold shadow-gold"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-gold/40"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Categories & Service Cards matching DESIGN.md `card-secondary` (`div.group.flex.flex-col`, #1A1814, rounded 16px, p-5, border #2D261B) */}
          <div className="space-y-12">
            {displayedServiceCategories.map((category) => (
              <div key={category.id}>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 pb-2 border-b border-border">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {category.subtitle}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gold mt-1 sm:mt-0">
                    {category.items.length} opções disponíveis
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((service) => (
                    <div
                      key={service.id}
                      className="group flex flex-col justify-between rounded-[16px] bg-card border border-border p-5 min-h-[148px] hover:border-gold/60 hover:shadow-gold transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-base text-foreground group-hover:text-gold transition-colors">
                            {service.name}
                          </h4>
                          {service.popular && (
                            <span className="px-2 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-[10px] font-bold shrink-0">
                              Destaque
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gold" />
                            {service.durationLabel}
                          </span>
                          <span className="text-base font-extrabold text-gold">
                            {service.priceLabel}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectServiceAndBook(service.id)}
                          className="px-4 py-2 rounded-xl bg-gold/15 border border-gold/40 text-gold group-hover:bg-gradient-gold group-hover:text-primary-foreground text-xs font-bold transition-all"
                        >
                          Agendar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Strip */}
          <div className="mt-12 p-4 rounded-2xl bg-card border border-border flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-foreground/90">
            <span className="font-bold text-gold">Formas de pagamento aceitas:</span>
            <span>💵 Dinheiro</span>
            <span>•</span>
            <span>💳 Crédito (Visa, Mastercard, Elo, Amex)</span>
            <span>•</span>
            <span>🔵 Débito</span>
            <span>•</span>
            <span>⚡ PIX</span>
            <span>•</span>
            <span>🎁 Vale-Presente</span>
          </div>
        </div>
      </section>

      {/* SECTIONS: AGENDE SEU HORÁRIO (`#agendar`) & AGENDA OCUPADA (`#agenda`) */}
      <BookingSection
        selectedBarberId={selectedBarberId}
        setSelectedBarberId={setSelectedBarberId}
        selectedServiceIds={selectedServiceIds}
        setSelectedServiceIds={setSelectedServiceIds}
        bookings={bookings}
        onAddBooking={handleAddBooking}
      />

      {/* SECTION: BAR...BEARIA, SINUCA & LOJA (`section#loja`) */}
      <section
        id="loja"
        className="py-20 md:py-24 bg-background-2/60 border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-gold mb-3">
              BAR...bearia • Espaço Gourmet & Grooming
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
              Bar, Sinuca & <em className="text-gradient-gold italic">Loja Sr. José</em>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mt-3">
              Relaxe com os amigos tomando um chopp gelado, jogando uma sinuca brasileira ou saboreando nosso hambúrguer toda quarta-feira.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PUB_AND_SHOP_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-card border border-border p-6 flex flex-col justify-between hover:border-gold/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-gold">
                      {item.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-[10px] font-bold text-gold-light">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-border flex items-center justify-between">
                  <span className="font-heading text-xl font-extrabold text-gold">
                    {item.price}
                  </span>
                  <a
                    href={`https://wa.me/${BARBERSHOP_INFO.phonePrimaryRaw}?text=${encodeURIComponent(
                      `Olá Barbearia Senhor José! Gostaria de saber mais sobre: ${item.name} (${item.price}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-background-2 border border-border hover:border-gold text-xs font-bold text-foreground hover:text-gold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25d366]" />
                    <span>Pedir / Reservar</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: AVALIAÇÕES REAIS DO GOOGLE MAPS (`section#avaliacoes`) */}
      <section
        id="avaliacoes"
        className="py-20 md:py-24 bg-background border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-gold mb-3">
                Nota Máxima no Google Maps
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                O que Maringá <em className="text-gradient-gold italic">diz de nós</em>
              </h2>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-gold/40 shadow-gold-soft">
              <div className="text-center pr-4 border-r border-border">
                <div className="font-heading text-3xl font-extrabold text-gold">
                  5.0
                </div>
                <div className="flex items-center gap-0.5 text-gold mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">
                  95 Avaliações no Google
                </div>
                <a
                  href={BARBERSHOP_INFO.links.googleMapsShort}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  <span>Ver perfil no Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Mencionado com frequência nos comentários (Google Maps Chips) */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-bold text-muted-foreground mr-1">
              Mencionado com frequência:
            </span>
            {REVIEW_TAGS.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-card border border-border text-xs text-foreground/85"
              >
                {tag.label}{" "}
                <strong className="text-gold ml-1">({tag.count})</strong>
              </span>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GOOGLE_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl bg-card border border-border p-6 flex flex-col justify-between hover:border-gold/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1 text-gold">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-bold">
                      {rev.highlight}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed italic">
                    “{rev.text}”
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {rev.author}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rev.badge}
                    </div>
                  </div>
                  <span className="text-[11px] text-gold font-semibold">
                    Verificada ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: GALERIA (`section#galeria`) */}
      <section
        id="galeria"
        className="py-20 md:py-24 bg-background-2/40 border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-gold mb-3">
                Ambiente • Fotos Reais
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                Nossa <em className="text-gradient-gold italic">Galeria</em>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mt-2">
                Um gostinho da Barbearia Senhor José em Maringá: cadeiras, sinuca, navalha e aquele clima. 📸
              </p>
            </div>

            <a
              href={BARBERSHOP_INFO.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-gold/40 hover:border-gold text-sm font-bold text-foreground hover:text-gold transition-all self-start md:self-auto"
            >
              <Instagram className="w-4 h-4 text-gold" />
              <span>Ver mais em {BARBERSHOP_INFO.links.instagramHandle}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GALLERY_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxItem(item)}
                className="group relative rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3] text-left focus:outline-none hover:border-gold/60 transition-all"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass text-[11px] font-bold text-gold">
                  {item.tag}
                </span>

                <span className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </span>

                <div className="absolute bottom-3.5 left-4 right-4">
                  <h3 className="font-bold text-base text-foreground group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-foreground/80 mt-0.5 line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: HORÁRIOS, PAGAMENTO & LOCALIZAÇÃO (`section#contato`) */}
      <section
        id="contato"
        className="py-20 md:py-24 bg-background border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 space-y-20">
          {/* Sub-block 1: Horários & Pagamento */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-gold mb-3">
                Funcionamento
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                Horários & <em className="text-gradient-gold italic">pagamento</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Opening Hours Card */}
              <div className="rounded-2xl bg-card border border-border p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gold" />
                    <span>Horário de atendimento</span>
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-[#25d366]/15 border border-[#25d366]/40 text-[#5ee29a] text-xs font-bold">
                    Terça a Sábado
                  </span>
                </div>

                <ul className="space-y-3">
                  {OPENING_HOURS.map((item) => {
                    const isToday = item.dayIndex === todayDayIndex;
                    return (
                      <li
                        key={item.day}
                        className={`flex items-center justify-between p-3 rounded-xl border text-sm ${
                          isToday
                            ? "bg-gold/15 border-gold text-foreground font-bold"
                            : "bg-background-2/60 border-border/60 text-foreground/85"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.day}</span>
                          {isToday && (
                            <span className="px-2 py-0.5 rounded-full bg-gold text-primary-foreground text-[10px] font-extrabold uppercase">
                              Hoje
                            </span>
                          )}
                          {item.note && (
                            <span className="text-xs text-gold font-semibold">
                              • {item.note}
                            </span>
                          )}
                        </div>
                        <span
                          className={
                            item.isOpen
                              ? "font-mono font-bold text-gold"
                              : "text-muted-foreground"
                          }
                        >
                          {item.hours}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Payment Methods & Amenities Card */}
              <div className="rounded-2xl bg-card border border-border p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gold" />
                    <span>Formas de pagamento</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3.5">
                    {[
                      {
                        icon: "💵",
                        title: "Dinheiro",
                        desc: "Troco disponível na hora",
                      },
                      {
                        icon: "💳",
                        title: "Cartão de Crédito",
                        desc: "Visa, Mastercard, Elo, Amex",
                      },
                      {
                        icon: "🔵",
                        title: "Cartão de Débito",
                        desc: "Maestro, Visa Electron, Elo",
                      },
                      {
                        icon: "⚡",
                        title: "PIX Instantâneo",
                        desc: "Na hora, rápido e sem taxas",
                      },
                    ].map((pm, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-background-2 border border-border"
                      >
                        <div className="text-2xl mb-1.5">{pm.icon}</div>
                        <div className="font-bold text-sm text-foreground">
                          {pm.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {pm.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-border">
                  <div className="text-xs font-bold uppercase tracking-wider text-gold mb-2.5">
                    Comodidades da Barbearia Senhor José
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="px-3 py-1.5 rounded-lg bg-background-2 border border-border">
                      ♿ Acessível a cadeiras de rodas
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-background-2 border border-border">
                      📶 Wi-Fi Gratuito
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-background-2 border border-border">
                      🎱 Sinuca & Bar
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-background-2 border border-border">
                      👦 Espaço Familiar & Kids
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-block 2: Onde Estamos / Localização */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-gold mb-3">
                Onde Estamos em Maringá
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                Nossa <em className="text-gradient-gold italic">Localização</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 items-stretch">
              {/* Address & Contact Card */}
              <div className="rounded-2xl bg-card border border-border p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Zona 06 • Maringá / Paraná</span>
                  </div>

                  <div>
                    <h3 className="font-heading text-2xl font-bold text-foreground">
                      {BARBERSHOP_INFO.address.street} —{" "}
                      {BARBERSHOP_INFO.address.neighborhood}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {BARBERSHOP_INFO.address.city}/{BARBERSHOP_INFO.address.state} • CEP{" "}
                      {BARBERSHOP_INFO.address.cep} ({BARBERSHOP_INFO.address.reference})
                    </p>
                  </div>

                  {/* Phones & WhatsApp List */}
                  <div className="space-y-2.5 pt-2 border-t border-border">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Telefones & WhatsApp de Agendamento
                    </div>
                    <a
                      href={BARBERSHOP_INFO.links.whatsappPrimary}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-background-2 border border-border hover:border-gold transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#25d366]" />
                        <div>
                          <div className="text-sm font-bold text-foreground">
                            {BARBERSHOP_INFO.phonePrimary}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Telefone Fixo & WhatsApp Principal (Google Maps)
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#5ee29a]">
                        Chamar →
                      </span>
                    </a>

                    <a
                      href={BARBERSHOP_INFO.links.whatsappMobile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-background-2 border border-border hover:border-gold transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-4 h-4 text-gold" />
                        <div>
                          <div className="text-sm font-bold text-foreground">
                            {BARBERSHOP_INFO.phoneMobile} / {BARBERSHOP_INFO.phoneSecondary}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            WhatsApp Celular & Recepção Secundária
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gold">
                        Chamar →
                      </span>
                    </a>
                  </div>

                  <ul className="space-y-2 text-xs sm:text-sm text-foreground/85">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold shrink-0" />
                      <span>Fácil acesso na Zona 06, próximo ao Bosque das Grevíleas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold shrink-0" />
                      <span>Estacionamento tranquilo na Rua Raimundo Corrêa</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold shrink-0" />
                      <span>Plus Code Google: {BARBERSHOP_INFO.address.plusCode}</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={BARBERSHOP_INFO.links.googleMapsShort}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-gold text-primary-foreground text-xs sm:text-sm font-extrabold shadow-gold hover:brightness-110 transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Como chegar (Google Maps)</span>
                  </a>
                  <a
                    href={BARBERSHOP_INFO.links.whatsappPrimary}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-background-2 border border-border hover:border-gold text-foreground text-xs sm:text-sm font-bold transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25d366]" />
                    <span>Tirar dúvidas</span>
                  </a>
                </div>
              </div>

              {/* Embedded Interactive Google Map */}
              <div className="rounded-2xl overflow-hidden border border-border bg-card min-h-[380px] relative">
                <iframe
                  title="Mapa Barbearia Senhor José - R. Raimundo Corrêa, 276, Maringá"
                  src={BARBERSHOP_INFO.links.googleMapsEmbed}
                  className="w-full h-full min-h-[380px] border-0 filter grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-3 left-3 right-3 glass p-3 rounded-xl flex items-center justify-between gap-2 pointer-events-none">
                  <div className="text-xs">
                    <strong className="text-gold">Barbearia Senhor José</strong>{" "}
                    • R. Raimundo Corrêa, 276 - Zona 06
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Maringá/PR
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-block 3: Final CTA Banner ("Pronto para renovar o visual?") */}
          <div className="rounded-3xl bg-gradient-to-r from-card via-background-2 to-card border border-gold/40 p-8 md:p-12 text-center shadow-gold relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-5 relative z-10">
              <img
                src="./images/logo-sr-jose.jpg"
                alt="Logo Barbearia Senhor José"
                className="w-16 h-16 rounded-full mx-auto object-cover border border-gold/60 shadow-gold"
              />
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                Pronto para <em className="text-gradient-gold italic">renovar o visual?</em>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Garanta seu horário em menos de 1 minuto — ou fale direto com nossa equipe no WhatsApp.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <button
                  onClick={scrollToBooking}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-gold text-primary-foreground text-sm md:text-base font-extrabold shadow-gold hover:brightness-110 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Agendar agora</span>
                </button>
                <a
                  href={BARBERSHOP_INFO.links.whatsappPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#25d366] text-[#04240f] text-sm md:text-base font-extrabold shadow-lg hover:brightness-105 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{BARBERSHOP_INFO.phonePrimary}</span>
                </a>
              </div>

              <div className="pt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <a
                  href={BARBERSHOP_INFO.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
                >
                  <Instagram className="w-4 h-4 text-gold" />
                  <span>Instagram</span>
                </a>
                <a
                  href={BARBERSHOP_INFO.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
                >
                  <Facebook className="w-4 h-4 text-gold" />
                  <span>Facebook</span>
                </a>
                <a
                  href={BARBERSHOP_INFO.links.googleMapsShort}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
                >
                  <MapPin className="w-4 h-4 text-gold" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/40 border-t border-border py-12 pb-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <img
              src="./images/logo-sr-jose.jpg"
              alt="Sr. José"
              className="w-9 h-9 rounded-full object-cover border border-gold/50"
            />
            <div>
              <div className="font-bold text-foreground">
                Barbearia Senhor José — Tornando você diferente dos iguais
              </div>
              <div>
                R. Raimundo Corrêa, 276 — Zona 06, Maringá/PR • CEP 87015-400 • Tel/Whats: (44) 3047-2202
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <div>
              © {new Date().getFullYear()} Barbearia Sr. José Ltda • CNPJ{" "}
              {BARBERSHOP_INFO.cnpj}
            </div>
            <div className="text-[11px] text-muted-foreground/70 mt-0.5">
              Design System Base44 • Especialista em Cortes na Tesoura, Infantil & Barber Pub desde 2016
            </div>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX MODAL FOR GALLERY */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full rounded-2xl overflow-hidden bg-card border border-gold/40 shadow-2xl"
          >
            <div className="relative">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="w-full max-h-[75vh] object-contain bg-black"
              />
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 border border-border text-foreground flex items-center justify-center hover:border-gold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gold">
                  {lightboxItem.tag}
                </span>
                <h4 className="text-lg font-bold text-foreground">
                  {lightboxItem.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {lightboxItem.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLightboxItem(null);
                  scrollToBooking();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-xs font-extrabold shrink-0"
              >
                Agendar Horário
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING VIRTUAL ASSISTANT (`button-secondary` from DESIGN.md) */}
      <VirtualAssistantModal onGoToBooking={scrollToBooking} />
    </div>
  );
}
