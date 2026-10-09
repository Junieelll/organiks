import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ScissorIcon,
  TreatmentIcon,
  WellnessIcon,
  PaintBrush01Icon,
  EyeIcon,
  InjectionIcon,
  Activity01Icon,
  ArrowRight02Icon,
  Search01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { serviceCategories } from "../data/services";
import { BOOKING_URL } from "../constants/config";
import Banner from "../components/sections/Banner";
import { useLocation } from "react-router-dom";
import { usePageEnterDelay } from "../components/common/PageTransition";

// Map category IDs to icons
const categoryIcons = {
  hair: ScissorIcon,
  facials: TreatmentIcon,
  massage: WellnessIcon,
  nails: PaintBrush01Icon,
  lashes: EyeIcon,
  aesthetics: InjectionIcon,
  body: Activity01Icon,
};

// Map category IDs to accent colours
const categoryColors = {
  hair:       { bg: "bg-[#F5EFE6]", iconColor: "#7A5C34" },
  facials:    { bg: "bg-[#EDF5F0]", iconColor: "#2D6A4F" },
  massage:    { bg: "bg-[#EEF0F8]", iconColor: "#3D4A8A" },
  nails:      { bg: "bg-[#FDF0F8]", iconColor: "#8A3D6A" },
  lashes:     { bg: "bg-[#FFF8ED]", iconColor: "#8A6500" },
  aesthetics: { bg: "bg-[#F0F5FF]", iconColor: "#2A4A8A" },
  body:       { bg: "bg-[#EFF6F0]", iconColor: "#386641" },
};

// All categories at once, as a grid of tiles. Used inline on mobile and inside the category sheet.
// The highlight slides between tiles (layoutId); each instance needs its own idPrefix.
function CategoryGrid({ activeId, onSelect, idPrefix, reduce }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {serviceCategories.map((cat) => {
        const isActive = cat.id === activeId;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            aria-pressed={isActive}
            aria-label={cat.title}
            className={`relative flex flex-col items-center gap-1.5 rounded-xl border px-1 py-3 transition-colors cursor-pointer ${
              isActive ? "border-transparent" : "bg-white border-[#E8DDD2] active:bg-[#F4EEE3]"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={`${idPrefix}-active`}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-xl bg-[#EDF1E6] border border-[#566B3F]"
              />
            )}
            <span className="relative flex flex-col items-center gap-1.5">
              <HugeiconsIcon
                icon={categoryIcons[cat.id] || ScissorIcon}
                size={20}
                color={isActive ? "#566B3F" : "#8A8F88"}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span className={`text-[11px] font-medium leading-none ${isActive ? "text-[#566B3F]" : "text-[#666]"}`}>
                {cat.title.split(" ")[0]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function Services() {
  // A card on Home can open this page with its category already selected
  const location = useLocation();
  const startCategory = serviceCategories.find((c) => c.id === location.state?.category)?.id;
  const [activeTab, setActiveTab] = useState(startCategory ?? serviceCategories[0].id);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  // Mobile category navigation: the full grid sits inline; once it scrolls out of view a slim
  // bar takes over (current category + "All categories") so switching is always one tap away.
  const gridRef = useRef(null);
  const [pastGrid, setPastGrid] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const el = gridRef.current;
      // offsetHeight is 0 on desktop, where the grid is hidden and the tab bar is used instead
      if (!el || el.offsetHeight === 0) return setPastGrid(false);
      // Mobile header is 64px tall: the moment the grid's top slips under it, the slim bar takes over
      setPastGrid(el.getBoundingClientRect().top < 64);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Close the sheet when the inline grid is back on screen (adjusting state during render,
  // so there's no extra effect-triggered render), or on Escape
  if (!pastGrid && sheetOpen) setSheetOpen(false);
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  // ── Bento entrance: one orchestrated sequence ──────────────────────────
  // cards rise in reading order → photos settle from a slight zoom → text follows.
  // Reduced-motion users get a plain fade with no movement.
  const reduce = useReducedMotion();
  const enterDelay = usePageEnterDelay(); // waits for the page curtain when arriving via nav
  const ease = [0.22, 1, 0.36, 1];
  const bentoContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.1 + enterDelay } },
  };
  const bentoCard = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: 30, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
      };
  const bentoImage = reduce
    ? { hidden: {}, visible: {} }
    : { hidden: { scale: 1.14 }, visible: { scale: 1, transition: { duration: 1.3, ease } } };
  const bentoText = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease } },
      };
  // ── Scroll reveals for everything below the bento ─────────────────────
  // List rows reveal as they enter the viewport (first few stagger, the rest
  // appear as you scroll to them); the CTA and banner reveal once.
  const rowReveal = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: (i = 0) => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0.25, delay: i < 6 ? i * 0.025 : 0, ease },
        }),
      };
  const blockReveal = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduce ? 0.3 : 0.8, ease },
  };

  const hoverLift = reduce ? undefined : { y: -3, transition: { duration: 0.25 } };

  const activeCategory = serviceCategories.find((c) => c.id === activeTab);
  const filteredItems = activeCategory?.items.filter((item) =>
    item.name.toLowerCase().includes(search.trim().toLowerCase())
  ) ?? [];

  const clearSearch = () => {
    setSearch("");
    searchInputRef.current?.focus();
  };

  // Switching category always lands on the start of the new list, just below whichever
  // sticky bar is showing (slim bar on mobile, tab bar on larger screens).
  //
  // Swapping lists changes the page height. If the new list is shorter, the browser clamps the
  // scroll position mid-animation and the smooth scroll gets cut off. So: hold the panel at its
  // current height while the swap plays, scroll, then re-check the landing spot once things settle.
  const handleSelectCategory = (categoryId) => {
    const panel = document.getElementById("services-panel");
    if (panel) panel.style.minHeight = `${panel.offsetHeight}px`;

    setActiveTab(categoryId);
    setSearch("");
    setSheetOpen(false);
    if (!panel) return;

    const landingY = () =>
      Math.max(
        0,
        panel.getBoundingClientRect().top + window.scrollY - (window.innerWidth >= 640 ? 90 : 84)
      );
    window.scrollTo({ top: landingY(), behavior: "smooth" });

    // Correct any drift after the swap, then release the height hold
    setTimeout(() => {
      if (Math.abs(window.scrollY - landingY()) > 6) {
        window.scrollTo({ top: landingY(), behavior: "smooth" });
      }
    }, 325);
    setTimeout(() => {
      panel.style.minHeight = "";
    }, 500);
  };

  return (
    <div className="font-['Poppins',sans-serif] bg-[#FEFBF7] min-h-screen">

      {/* ── Minimalist Hero & Bento Showcase ──────────────────────── */}
      <section className="relative pt-24 pb-8 sm:pt-28 sm:pb-12 text-center">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Clean Minimalist Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: enterDelay }}
            className="mb-6 sm:mb-8"
          >
            <p className="text-[10.5px] tracking-[3px] uppercase text-[#7A6439] font-medium mb-2">
              Organiks Salon &amp; Wellness Spa
            </p>
            <h1
              className="text-[clamp(26px,4.5vw,44px)] text-[#1C2621] leading-[1.15] font-normal tracking-tight mb-2.5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Beauty. Wellness. <em className="italic font-light text-[#566B3F]">Confidence.</em>
            </h1>
            <p className="text-[#6B726D] text-[13px] sm:text-[14.5px] font-light max-w-xl mx-auto">
              Explore our full range of curated treatments designed to help you renew and radiate.
            </p>
          </motion.div>

          {/* Bento showcase: tall hero card + two small cards + wide card (fixed row heights so images never stretch the grid) */}
          <motion.div
            variants={bentoContainer}
            initial="hidden"
            animate="visible"
            className="mt-4 sm:mt-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_1fr_1fr] md:auto-rows-[160px] lg:auto-rows-[170px] gap-2.5 sm:gap-3 text-left"
          >
            {/* 1 · Tall card (Hair): framed image, text, button */}
            <motion.div variants={bentoCard} className="md:row-span-2 flex flex-col overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#F3EDE3] p-3 sm:p-4">
              <div className="relative rounded-[14px] sm:rounded-[18px] bg-white overflow-hidden h-[170px] md:h-auto md:flex-1 md:min-h-0">
                <motion.span variants={bentoImage} className="absolute inset-0 block">
                  <img src="/images/media/service-gallery-1.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
                </motion.span>
              </div>
              <motion.div variants={bentoText} className="pt-3">
                <h3
                  className="text-sm sm:text-[17px] lg:text-[19px] font-medium tracking-tight leading-snug mb-1 text-[#14291F]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Hair Services
                </h3>
                <p className="text-[11.5px] sm:text-[11.5px] lg:text-[12px] leading-relaxed font-light text-[#4A524C] mb-3 line-clamp-3">
                  Luxury hair rituals, color artistry and treatment care designed
                  to enhance shine, softness and confidence.
                </p>
                <button
                  type="button"
                  onClick={() => handleSelectCategory("hair")}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#14291F] hover:bg-[#1f3d2b] text-[#EFE0BC] pl-4 pr-1 py-1 text-[10.5px] sm:text-[11px] font-medium tracking-wide transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#566B3F]"
                >
                  Explore Hair Services
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                    <HugeiconsIcon icon={ArrowRight02Icon} size={13} color="#14291F" strokeWidth={2.2} />
                  </span>
                </button>
              </motion.div>
            </motion.div>

            {/* 2 · Top-middle card (Nails): full image with text over a soft gradient */}
            <motion.button
              type="button"
              variants={bentoCard}
              whileHover={hoverLift}
              onClick={() => handleSelectCategory("nails")}
              className="group relative block overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#F3EDE3] h-[190px] md:h-auto text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#566B3F]"
            >
              <motion.span variants={bentoImage} className="absolute inset-0 block">
                  <img src="/images/media/service-gallery-2.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                </motion.span>
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <motion.span variants={bentoText} className="absolute inset-x-0 bottom-0 block p-3 sm:p-4">
                <span
                  className="block text-[13px] sm:text-[17px] lg:text-[19px] font-medium tracking-tight leading-snug mb-0.5 text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Nail Services
                </span>
                <span className="block text-[11.5px] sm:text-[11.5px] lg:text-[12px] leading-relaxed font-light text-white/85 line-clamp-2">
                  Clean, elegant, polished nail rituals for everyday beauty and special moments.
                </span>
              </motion.span>
            </motion.button>

            {/* 3 · Top-right card (Facials): text left, image right */}
            <motion.button
              type="button"
              variants={bentoCard}
              whileHover={hoverLift}
              onClick={() => handleSelectCategory("facials")}
              className="group flex overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#F3EDE3] h-[140px] md:h-auto text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#566B3F]"
            >
              <motion.span variants={bentoText} className="flex flex-col justify-end w-[58%] p-3 sm:p-4">
                <span
                  className="block text-[13px] sm:text-[17px] lg:text-[19px] font-medium tracking-tight leading-snug mb-1 text-[#14291F]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Facial Services
                </span>
                <span className="block text-[11.5px] sm:text-[11.5px] lg:text-[12px] leading-relaxed font-light text-[#4A524C]">
                  Nourish, reveal, reveal your natural glow.
                </span>
              </motion.span>
              <span className="relative block w-[42%] overflow-hidden">
                <motion.span variants={bentoImage} className="absolute inset-0 block">
                  <img src="/images/media/service-gallery-3.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                </motion.span>
              </span>
            </motion.button>

            {/* 4 · Wide bottom card (Massage): text left, image right */}
            <motion.button
              type="button"
              variants={bentoCard}
              whileHover={hoverLift}
              onClick={() => handleSelectCategory("massage")}
              className="group flex overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#F3EDE3] h-[140px] md:h-auto md:col-span-2 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#566B3F]"
            >
              <motion.span variants={bentoText} className="flex flex-col justify-end w-[58%] p-3 sm:p-4">
                <span
                  className="block text-[13px] sm:text-[17px] lg:text-[19px] font-medium tracking-tight leading-snug mb-1 text-[#14291F]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Massage Services
                </span>
                <span className="block text-[11.5px] sm:text-[11.5px] lg:text-[12px] leading-relaxed font-light text-[#4A524C] max-w-sm">
                  Restore balance, relieve tension and rejuvenate your body and mind.
                </span>
              </motion.span>
              <span className="relative block w-[42%] overflow-hidden">
                <motion.span variants={bentoImage} className="absolute inset-0 block">
                  <img src="/images/media/body.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Scroll Anchor for Category Bar ── */}
      <div id="services-anchor" className="scroll-mt-20 sm:scroll-mt-24" />

      {/* ── Mobile: every category visible at once (the tab bar hid most of them off-screen) ── */}
      <div ref={gridRef} className="sm:hidden px-4 pt-2 pb-1">
        <p className="m-0 mb-3 text-[11px] tracking-[0.14em] uppercase text-[#6B726D] font-semibold">
          Browse by category
        </p>
        <CategoryGrid
          activeId={activeTab}
          onSelect={(id) => handleSelectCategory(id)}
          idPrefix="inline"
          reduce={reduce}
        />
      </div>

      {/* ── Mobile: slim bar appears once the grid has scrolled away ── */}
      <AnimatePresence>
        {pastGrid && sheetOpen && (
          <motion.div
            key="scrim"
            className="sm:hidden fixed inset-0 z-20 bg-black/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSheetOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {pastGrid && (
          <motion.div
            key="mini"
            className="sm:hidden fixed top-16 inset-x-0 z-30 bg-[#FEFBF7]/95 backdrop-blur-md border-b border-[#E8DDD2]/60 shadow-sm"
            initial={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.4, ease }}
          >
            <button
              type="button"
              onClick={() => setSheetOpen((o) => !o)}
              aria-expanded={sheetOpen}
              aria-controls="category-sheet"
              className="w-full flex items-center justify-between gap-3 px-4 py-3 cursor-pointer bg-transparent border-0"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <HugeiconsIcon
                  icon={categoryIcons[activeTab] || ScissorIcon}
                  size={18}
                  color="#566B3F"
                  strokeWidth={2.2}
                />
                <span className="text-[13px] font-semibold text-[#14291F] truncate">
                  {activeCategory?.title}
                </span>
              </span>
              <span className="flex items-center gap-1.5 shrink-0 text-[12px] font-medium text-[#566B3F]">
                All categories ({serviceCategories.length})
                <motion.svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ rotate: sheetOpen ? 180 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.25, ease }}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </motion.svg>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {sheetOpen && (
                <motion.div
                  id="category-sheet"
                  key="sheet"
                  className="overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: reduce ? 0.15 : 0.35, ease }}
                >
                  <div className="px-4 pt-1 pb-4">
                    <CategoryGrid
                      activeId={activeTab}
                      onSelect={(id) => handleSelectCategory(id)}
                      idPrefix="sheet"
                      reduce={reduce}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Category Tab Bar ─────────────────────────────────────────── */}
      <div id="services-menu" className="hidden sm:block sticky top-[64px] sm:top-[80px] z-30 bg-[#FEFBF7]/95 backdrop-blur-md border-b border-[#E8DDD2]/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-none">
            {serviceCategories.map((cat) => {
              const isActive = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 sm:px-5 py-4 text-[12px] sm:text-[12.5px] font-medium tracking-wide transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "border-[#566B3F] text-[#566B3F]"
                      : "border-transparent text-[#777] hover:text-[#444] hover:border-[#ccc]"
                  }`}
                >
                  <HugeiconsIcon
                    icon={categoryIcons[cat.id] || ScissorIcon}
                    size={15}
                    color={isActive ? "#566B3F" : "#999"}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className="hidden sm:inline">{cat.title}</span>
                  <span className="sm:hidden">{cat.title.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Service Panel ─────────────────────────────────────────────── */}
      <div id="services-panel" className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 ">
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        categoryColors[activeCategory.id]?.bg ?? "bg-[#F5EFE6]"
                      }`}
                    >
                      <HugeiconsIcon
                        icon={categoryIcons[activeCategory.id] || ScissorIcon}
                        size={18}
                        color={categoryColors[activeCategory.id]?.iconColor ?? "#7A5C34"}
                        strokeWidth={2}
                      />
                    </div>
                    <h2
                      className="text-xl sm:text-2xl font-medium text-[#14291F]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {activeCategory.title}
                    </h2>
                  </div>
                  <p className="text-[13px] text-[#4A524C] max-w-lg leading-relaxed">
                    {activeCategory.tagline}
                  </p>
                </div>

                {/* Search */}
                <div className="relative shrink-0 w-full sm:w-60">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={15}
                      color="#6B726D"
                      strokeWidth={2}
                    />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    aria-label="Search services"
                    placeholder="Search services…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 text-[13px] bg-white border border-[#D9CFC2] rounded-xl focus:outline-none focus:border-[#566B3F] transition-colors placeholder-[#6B726D]"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center bg-[#F0EAE0] hover:bg-[#E5DCCD] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#566B3F]"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={12}
                        color="#4A524C"
                        strokeWidth={2.5}
                      />
                    </button>
                  )}
                </div>
              </div>

              {/* Service Cards */}
              {filteredItems.length === 0 ? (
                <div
                  role="status"
                  className="flex flex-col items-center text-center py-14 sm:py-16 px-4 border-t border-[#E8DDD2]"
                >
                  <div className="w-14 h-14 rounded-full bg-[#F5EFE6] flex items-center justify-center mb-4">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={24}
                      color="#7A5C34"
                      strokeWidth={1.8}
                    />
                  </div>
                  <p
                    className="text-[17px] sm:text-[19px] font-medium text-[#14291F] mb-1.5"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    We couldn&rsquo;t find &ldquo;{search.trim()}&rdquo;
                  </p>
                  <p className="text-[13px] text-[#4A524C] max-w-sm leading-relaxed mb-5">
                    Try a different word or check the spelling. You can also clear
                    your search to see all {activeCategory.title.toLowerCase()}.
                  </p>
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="inline-flex items-center gap-2 border border-[#566B3F] text-[#566B3F] hover:bg-[#566B3F] hover:text-white rounded-full py-2 px-5 text-[13px] font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#566B3F]"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                /* Menu-style list: name left, price right, note underneath */
                <ul className="list-none m-0 p-0 border-t border-[#E8DDD2]">
                  {filteredItems.map((item, i) => (
                    <motion.li
                      key={item.name}
                      custom={i}
                      variants={rowReveal}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.4 }}
                      className="py-3 sm:py-3.5 border-b border-[#E8DDD2]"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="text-[13.5px] sm:text-[14px] font-semibold text-[#1A2E18] leading-snug">
                          {item.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className="flex-1 min-w-4 border-b-2 border-dotted border-[#D9CFC2] -translate-y-1"
                        />
                        <span className="shrink-0 text-[13px] font-bold text-[#566B3F] whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                      {item.note && (
                        <p className="mt-1.5 text-[11.5px] text-[#4A524C] leading-relaxed font-light max-w-xl">
                          {item.note}
                        </p>
                      )}
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* Per-category Book CTA */}
              <motion.div
                {...blockReveal}
                className="flex justify-center mt-10"
              >
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#14291F] hover:bg-[#1f3d2b] text-[#EFE0BC] rounded-full py-3 px-8 text-[12px] font-semibold tracking-[0.12em] uppercase no-underline shadow-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#566B3F]"
                >
                  Book {activeCategory.title}
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={15}
                    color="#EFE0BC"
                    strokeWidth={2.2}
                  />
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Reuse the shared Banner at the bottom ─────────────────────── */}
      <motion.div {...blockReveal}>
        <Banner />
      </motion.div>
    </div>
  );
}