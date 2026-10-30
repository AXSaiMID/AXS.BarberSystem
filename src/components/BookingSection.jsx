import React, { useState, useMemo } from "react";
import {
  Check,
  Calendar,
  Clock,
  User,
  Scissors,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  BARBERS,
  SERVICE_CATEGORIES,
  SCHEDULE_DAYS,
  TIME_SLOTS_WEEKDAY,
  TIME_SLOTS_SATURDAY,
  BARBERSHOP_INFO,
} from "../data/barbershopData";

const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, categoryTitle: cat.title }))
);

export default function BookingSection({
  selectedBarberId,
  setSelectedBarberId,
  selectedServiceIds,
  setSelectedServiceIds,
  bookings,
  onAddBooking,
}) {
  const [step, setStep] = useState(1);
  const [selectedDateId, setSelectedDateId] = useState(SCHEDULE_DAYS[0].id);
  const [selectedTime, setSelectedTime] = useState("15:15");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [whatsappTarget, setWhatsappTarget] = useState("primary"); // primary: 3047-2202, mobile: 99881-2871
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // State for "Agenda Ocupada" transparency section
  const [agendaDateId, setAgendaDateId] = useState(SCHEDULE_DAYS[0].id);
  const [agendaBarberFilter, setAgendaBarberFilter] = useState("all");

  const selectedBarber = useMemo(
    () => BARBERS.find((b) => b.id === selectedBarberId) || BARBERS[0],
    [selectedBarberId]
  );

  const selectedServices = useMemo(
    () => ALL_SERVICES.filter((s) => selectedServiceIds.includes(s.id)),
    [selectedServiceIds]
  );

  const selectedDayObj = useMemo(
    () => SCHEDULE_DAYS.find((d) => d.id === selectedDateId) || SCHEDULE_DAYS[0],
    [selectedDateId]
  );

  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, s) => sum + (s.duration || 30), 0),
    [selectedServices]
  );

  const totalPrice = useMemo(() => {
    const hasConsult = selectedServices.some((s) => s.price === null);
    const sum = selectedServices.reduce((acc, s) => acc + (s.price || 0), 0);
    if (hasConsult && sum === 0) return "Sob consulta";
    if (hasConsult) return `R$ ${sum} + Sob consulta`;
    return `R$ ${sum}`;
  }, [selectedServices]);

  const availableTimeSlots = useMemo(() => {
    return selectedDayObj.isSaturday ? TIME_SLOTS_SATURDAY : TIME_SLOTS_WEEKDAY;
  }, [selectedDayObj]);

  const occupiedTimesForSelection = useMemo(() => {
    return bookings
      .filter(
        (b) => b.dateId === selectedDateId && b.barberId === selectedBarber.id
      )
      .map((b) => b.time);
  }, [bookings, selectedDateId, selectedBarber]);

  const toggleService = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.length > 1
          ? prev.filter((id) => id !== serviceId)
          : prev
        : [...prev, serviceId]
    );
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    const nameClean = clientName.trim() || "Cliente Sr. José";
    const initials = nameClean
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => `${n[0].toUpperCase()}.`)
      .join(" ");

    const serviceNames = selectedServices.map((s) => s.name).join(" + ");

    const newBooking = {
      id: `bk-${Date.now()}`,
      dateId: selectedDateId,
      time: selectedTime,
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      serviceName: serviceNames,
      duration: `${totalDuration} min`,
      clientInitials: initials || "C. S.",
      status: "Confirmado",
    };

    onAddBooking(newBooking);
    setAgendaDateId(selectedDateId);

    const targetPhone =
      whatsappTarget === "primary"
        ? BARBERSHOP_INFO.phonePrimaryRaw
        : BARBERSHOP_INFO.phoneMobileRaw;

    const msgLines = [
      `Olá, *Barbearia Senhor José*! 🎩💈`,
      `Gostaria de confirmar meu agendamento pelo site:`,
      ``,
      `👤 *Cliente:* ${nameClean}`,
      clientPhone ? `📱 *Telefone:* ${clientPhone}` : null,
      `✂️ *Profissional:* ${selectedBarber.fullName} (${selectedBarber.role})`,
      `💈 *Serviço(s):* ${serviceNames}`,
      `📅 *Data:* ${selectedDayObj.label}`,
      `⏰ *Horário:* ${selectedTime} (${totalDuration} min)`,
      `💰 *Valor estimado:* ${totalPrice}`,
      clientNotes ? `📝 *Obs:* ${clientNotes}` : null,
      ``,
      `📍 Endereço: R. Raimundo Corrêa, 276 - Zona 06, Maringá/PR`,
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
      msgLines.join("\n")
    )}`;

    setBookingConfirmed({
      ...newBooking,
      clientName: nameClean,
      dateLabel: selectedDayObj.label,
      totalPrice,
      whatsappUrl,
    });

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const filteredAgendaBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        const sameDate = b.dateId === agendaDateId;
        const matchBarber =
          agendaBarberFilter === "all" || b.barberId === agendaBarberFilter;
        return sameDate && matchBarber;
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [bookings, agendaDateId, agendaBarberFilter]);

  return (
    <>
      {/* SECTION: AGENDE SEU HORÁRIO (4-STEP WIZARD) */}
      <section id="agendar" className="py-20 md:py-24 bg-background-2/50 border-y border-border">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-gold mb-3">
              Online • Sem Fila
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
              Agende seu <em className="text-gradient-gold italic">horário</em>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mt-3">
              4 passos: escolha o barbeiro, o serviço, a data/horário e confirme direto pelo WhatsApp da Barbearia Senhor José.
            </p>
          </div>

          {/* 4-Step Progress Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
            {[
              { num: 1, label: "Barbeiro" },
              { num: 2, label: "Serviços" },
              { num: 3, label: "Data & Hora" },
              { num: 4, label: "Confirmar" },
            ].map((item) => {
              const active = step === item.num;
              const done = step > item.num;
              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => {
                    setBookingConfirmed(null);
                    setStep(item.num);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    active
                      ? "bg-gold/15 border-gold text-foreground shadow-gold-soft"
                      : done
                      ? "bg-card border-gold/40 text-foreground"
                      : "bg-card/60 border-border text-muted-foreground hover:border-border/80"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      active
                        ? "bg-gradient-gold text-primary-foreground"
                        : done
                        ? "bg-gold/25 text-gold"
                        : "bg-background-2 text-muted-foreground border border-border"
                    }`}
                  >
                    {done ? <Check className="w-3.5 h-3.5" /> : item.num}
                  </span>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wider truncate">
                      {item.label}
                    </span>
                    <span className="block text-[11px] text-muted-foreground truncate">
                      {item.num === 1 && selectedBarber.name}
                      {item.num === 2 && `${selectedServices.length} selecionado(s)`}
                      {item.num === 3 && `${selectedDayObj.shortDay} ${selectedDayObj.dayNum} • ${selectedTime}`}
                      {item.num === 4 && totalPrice}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Wizard Card */}
          <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-2xl">
            {/* STEP 1: CHOOSE BARBER */}
            {step === 1 && (
              <div className="animate-fade-up">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground">
                      1. Escolha o barbeiro
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Equipe liderada por Guilherme Brisce na R. Raimundo Corrêa, 276
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full">
                    {selectedBarber.fullName}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
                  {BARBERS.map((barber) => {
                    const isSelected = barber.id === selectedBarber.id;
                    return (
                      <button
                        key={barber.id}
                        type="button"
                        onClick={() => setSelectedBarberId(barber.id)}
                        className={`group relative text-center rounded-2xl p-5 border transition-all flex flex-col items-center justify-between ${
                          isSelected
                            ? "bg-gold/15 border-gold shadow-gold"
                            : "bg-background-2/70 border-border hover:border-gold/50 hover:-translate-y-0.5"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gradient-gold text-primary-foreground flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center font-heading text-lg font-extrabold mb-3 border transition-colors ${
                            isSelected
                              ? "bg-gradient-gold text-primary-foreground border-gold-light"
                              : "bg-card text-gold border-gold/30 group-hover:border-gold"
                          }`}
                        >
                          {barber.initials}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-foreground">
                            {barber.name}
                          </div>
                          <div className="text-[11px] text-gold font-medium mt-0.5">
                            {barber.role}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-2 line-clamp-2">
                            {barber.specialty}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-bold shadow-gold hover:brightness-110 transition-all"
                  >
                    <span>Continuar para Serviços</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CHOOSE SERVICES */}
            {step === 2 && (
              <div className="animate-fade-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground">
                      2. Escolha o(s) serviço(s)
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Você pode selecionar 1 ou mais serviços para o mesmo atendimento
                    </p>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-background-2 border border-gold/40 text-xs font-bold text-foreground">
                    Total: <span className="text-gold">{totalPrice}</span> •{" "}
                    <span>{totalDuration} min</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                  {ALL_SERVICES.map((service) => {
                    const isChecked = selectedServiceIds.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                          isChecked
                            ? "bg-gold/15 border-gold shadow-gold-soft"
                            : "bg-background-2/70 border-border hover:border-gold/40"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground truncate">
                              {service.name}
                            </span>
                            {service.popular && (
                              <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-bold shrink-0">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <span>{service.durationLabel}</span>
                            <span>•</span>
                            <span>{service.categoryTitle}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-extrabold text-gold">
                            {service.priceLabel}
                          </span>
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                              isChecked
                                ? "bg-gradient-gold text-primary-foreground border-gold"
                                : "border-border bg-card"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background-2 text-sm font-semibold text-foreground hover:border-gold/50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-bold shadow-gold hover:brightness-110 transition-all"
                  >
                    <span>Escolher Data & Hora</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CHOOSE DATE & TIME */}
            {step === 3 && (
              <div className="animate-fade-up">
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                  3. Escolha a data e o horário
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                  Atendimento Terça a Sexta (10h às 20h) e Sábado (09h às 17h)
                </p>

                {/* Date Buttons matching DESIGN.md `button-primary` (68x64px, rounded 12px, border #C49F5F) */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Selecione o dia
                  </label>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
                    {SCHEDULE_DAYS.map((day) => {
                      const active = day.id === selectedDateId;
                      return (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => setSelectedDateId(day.id)}
                          className={`flex-shrink-0 min-w-[68px] h-[64px] p-2.5 rounded-[12px] border text-center transition-all flex flex-col items-center justify-center ${
                            active
                              ? "bg-gold/10 border-gold text-foreground shadow-gold-soft"
                              : "bg-[#15120F] border-[#2D261B] text-foreground/80 hover:border-gold/40"
                          }`}
                        >
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider ${
                              active ? "text-gold" : "text-muted-foreground"
                            }`}
                          >
                            {day.shortDay}
                          </span>
                          <span className="text-lg font-extrabold leading-tight">
                            {day.dayNum}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots Grid */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Horários para {selectedBarber.name} em {selectedDayObj.label}
                    </label>
                    <span className="text-xs text-muted-foreground">
                      Duração: {totalDuration} min
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2.5">
                    {availableTimeSlots.map((slot) => {
                      const isOccupied = occupiedTimesForSelection.includes(slot);
                      const isSelected = selectedTime === slot && !isOccupied;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-3 px-2 rounded-xl border text-sm font-bold tabular-nums transition-all ${
                            isOccupied
                              ? "bg-background-2/40 border-border/40 text-muted-foreground/40 line-through cursor-not-allowed"
                              : isSelected
                              ? "bg-gradient-gold text-primary-foreground border-gold shadow-gold"
                              : "bg-[#15120F] border-[#2D261B] text-foreground hover:border-gold/50"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background-2 text-sm font-semibold text-foreground hover:border-gold/50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-bold shadow-gold hover:brightness-110 transition-all"
                  >
                    <span>Revisar & Confirmar</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMATION & WHATSAPP */}
            {step === 4 && (
              <form onSubmit={handleConfirmBooking} className="animate-fade-up">
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                  4. Confirme seu agendamento
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                  Seu horário será registrado na agenda abaixo e enviado direto para o WhatsApp da Barbearia Senhor José.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Client Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Seu Nome *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ex: João Silva"
                        className="w-full rounded-xl bg-background-2 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Seu WhatsApp / Telefone
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="(44) 99999-9999"
                        className="w-full rounded-xl bg-background-2 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Canal de confirmação WhatsApp
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setWhatsappTarget("primary")}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                            whatsappTarget === "primary"
                              ? "bg-gold/15 border-gold text-foreground"
                              : "bg-background-2 border-border text-muted-foreground"
                          }`}
                        >
                          <div className="text-gold">WhatsApp Principal</div>
                          <div>(44) 3047-2202</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setWhatsappTarget("mobile")}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                            whatsappTarget === "mobile"
                              ? "bg-gold/15 border-gold text-foreground"
                              : "bg-background-2 border-border text-muted-foreground"
                          }`}
                        >
                          <div className="text-gold">WhatsApp Celular</div>
                          <div>(44) 99881-2871</div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Observações (Opcional)
                      </label>
                      <input
                        type="text"
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        placeholder="Ex: Corte infantil, quero tomar um chopp antes..."
                        className="w-full rounded-xl bg-background-2 border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  {/* Right: Summary Box */}
                  <div className="rounded-2xl bg-background-2 border border-gold/30 p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gradient-gold text-primary-foreground font-heading font-extrabold flex items-center justify-center">
                            {selectedBarber.initials}
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Profissional escolhido
                            </div>
                            <div className="font-bold text-foreground">
                              {selectedBarber.fullName}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gold font-semibold">
                          {selectedBarber.role}
                        </span>
                      </div>

                      <div className="py-1 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data:</span>
                          <span className="font-semibold text-foreground">
                            {selectedDayObj.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horário:</span>
                          <span className="font-bold text-gold">
                            {selectedTime} ({totalDuration} min)
                          </span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-muted-foreground shrink-0">
                            Serviço(s):
                          </span>
                          <span className="font-semibold text-foreground text-right">
                            {selectedServices.map((s) => s.name).join(" + ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Local:</span>
                          <span className="text-xs text-foreground/90 text-right">
                            R. Raimundo Corrêa, 276 — Zona 06, Maringá
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                        Total Estimado
                      </span>
                      <span className="font-heading text-2xl font-extrabold text-gold">
                        {totalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {bookingConfirmed && (
                  <div className="mt-6 p-4 rounded-xl bg-[#25d366]/15 border border-[#25d366]/40 text-sm text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#25d366] shrink-0" />
                      <div>
                        <div className="font-bold text-[#5ee29a]">
                          Horário registrado na Agenda Ocupada!
                        </div>
                        <div className="text-xs text-foreground/80">
                          Caso o WhatsApp não tenha aberto automaticamente, clique no botão ao lado para enviar a confirmação.
                        </div>
                      </div>
                    </div>
                    <a
                      href={bookingConfirmed.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#25d366] text-[#04240f] font-bold text-xs shrink-0 text-center"
                    >
                      Enviar no WhatsApp
                    </a>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background-2 text-sm font-semibold text-foreground hover:border-gold/50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Alterar Data/Hora</span>
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#2fe374] to-[#25d366] text-[#04240f] text-sm font-extrabold shadow-lg hover:brightness-105 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirmar Horário pelo WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION: AGENDA OCUPADA (TRANSPARÊNCIA) */}
      <section id="agenda" className="py-20 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-gold mb-3">
              Transparência
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
              Agenda <em className="text-gradient-gold italic">ocupada</em>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mt-3">
              Veja os horários já reservados por barbeiro na Barbearia Senhor José e escolha o melhor horário para você.
            </p>
          </div>

          {/* Date Selector Strip (Exact `button-primary` & `button-variant-3` from DESIGN.md) */}
          <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-3 mb-6">
            {SCHEDULE_DAYS.map((day) => {
              const active = day.id === agendaDateId;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setAgendaDateId(day.id)}
                  className={`flex-shrink-0 min-w-[68px] h-[64px] p-2.5 rounded-[12px] border text-center transition-all flex flex-col items-center justify-center ${
                    active
                      ? "bg-gold/10 border-gold text-foreground shadow-gold-soft"
                      : "bg-[#15120F] border-[#2D261B] text-foreground/80 hover:border-gold/40"
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold uppercase ${
                      active ? "text-gold" : "text-muted-foreground"
                    }`}
                  >
                    {day.shortDay}
                  </span>
                  <span className="text-lg font-extrabold leading-tight">
                    {day.dayNum}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Barber Filter Pills */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8">
            <button
              type="button"
              onClick={() => setAgendaBarberFilter("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shrink-0 ${
                agendaBarberFilter === "all"
                  ? "bg-gradient-gold text-primary-foreground border-gold shadow-gold"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-gold/40"
              }`}
            >
              Todos
            </button>
            {BARBERS.map((barber) => (
              <button
                key={barber.id}
                type="button"
                onClick={() => setAgendaBarberFilter(barber.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shrink-0 ${
                  agendaBarberFilter === barber.id
                    ? "bg-gradient-gold text-primary-foreground border-gold shadow-gold"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-gold/40"
                }`}
              >
                {barber.name}
              </button>
            ))}
          </div>

          {/* Occupied List Card */}
          <div className="rounded-2xl bg-card border border-border p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-gold" />
                <span className="font-bold text-foreground text-sm sm:text-base">
                  {SCHEDULE_DAYS.find((d) => d.id === agendaDateId)?.label}
                </span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold">
                {filteredAgendaBookings.length} horário(s) reservado(s)
              </span>
            </div>

            {filteredAgendaBookings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-base font-semibold text-foreground">
                  Nenhum horário reservado para este filtro neste dia. Agenda livre! 🎉
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Aproveite para garantir seu corte ou barba agora mesmo sem espera.
                </p>
                <a
                  href="#agendar"
                  onClick={() => setSelectedDateId(agendaDateId)}
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-bold hover:bg-gold/25 transition-colors"
                >
                  Reservar horário neste dia
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredAgendaBookings.map((bk) => (
                  <div
                    key={bk.id}
                    className="p-4 rounded-xl bg-background-2 border border-border flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="px-3 py-2 rounded-lg bg-gold/15 border border-gold/40 text-gold font-mono font-extrabold text-sm tabular-nums shrink-0">
                        {bk.time}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-foreground truncate">
                          {bk.barberName}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            • Cliente {bk.clientInitials}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {bk.serviceName} ({bk.duration})
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#d1664f]/15 border border-[#d1664f]/40 text-[#f0987f] text-[11px] font-bold shrink-0">
                      Ocupado
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center mt-6 pt-4 border-t border-border/60">
              💡 Horários marcados pelo site, WhatsApp ou pelo atendente virtual aparecem aqui automaticamente.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
