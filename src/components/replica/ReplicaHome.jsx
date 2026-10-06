import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BOOKING_URL } from "../../constants/config";
import { serviceCategories } from "../../data/services";
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CalendarAdd02Icon,
  ScissorIcon,
  TreatmentIcon,
  WellnessIcon,
  PaintBrush01Icon,
  EyeIcon,
  InjectionIcon,
  QuoteDownIcon,
  SparklesIcon,
  ArrowRight02Icon,
  Leaf01Icon,
  Layers01Icon,
  Calendar04Icon,
  XIcon,
} from "@hugeicons/core-free-icons";

export default function ReplicaHome() {
  const [selectedService, setSelectedService] = useState(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const carouselRef = useRef(null);
  const swipeStartX = useRef(null);
  const [cardWidth, setCardWidth] = useState(380);
  const [containerWidth, setContainerWidth] = useState(0);
  const CARD_GAP = 20;

  // ── Infinite carousel state ──────────────────────────────────────────────
  const CLONE = 2;                         // clones on each side
  const realN = 5;                         // reviewsList.length (static)
  const [idx, setIdx] = useState(CLONE);   // extended index; real cards start at CLONE
  const [snap, setSnap] = useState(false); // when true: instant jump, no spring
  // Derived: which real review is active (used for dots)
  const activeReview = ((idx - CLONE) % realN + realN) % realN;

  const servicesList = [
    {
      id: "hair",
      title: "Hair Services",
      description:
        "Color, repair, smoothing, straightening, and styling rituals using premium care and organic-inspired ingredients.",
      price: "Starts at ₱400",
      btnText: "View Hair Services",
      image: "/images/replica/hair.webp",
      serviceKey: "hair",
      icon: ScissorIcon,
    },
    {
      id: "skin",
      title: "Facial & Skin Therapy",
      description:
        "Advanced skin treatments designed to reveal a clearer, brighter, smoother-looking glow.",
      price: "Starts at ₱1,500",
      btnText: "Start Your Skin Ritual",
      image: "/images/replica/skin.webp",
      serviceKey: "facials",
      icon: TreatmentIcon,
    },
    {
      id: "body",
      title: "Body & Wellness Therapy",
      description:
        "Massage and ancient wellness therapies for deep relaxation, recovery, and total body renewal.",
      price: "Starts at ₱600",
      btnText: "Book a Wellness Ritual",
      image: "/images/replica/body.webp",
      serviceKey: "massage",
      icon: WellnessIcon,
    },
    {
      id: "nails",
      title: "Nail & Hand Care",
      description:
        "Clean, elegant, polished nail rituals for everyday beauty and special moments.",
      price: "Starts at ₱400",
      btnText: "Book Nail Care",
      image: "/images/replica/nails.webp",
      serviceKey: "nails",
      icon: PaintBrush01Icon,
    },
    {
      id: "lashes",
      title: "Lash & Brow Studio",
      description:
        "Soft definition, lifted eyes, and naturally polished beauty.",
      price: "Starts at ₱400",
      btnText: "Book Your Appointment",
      image: "/images/replica/lashes.webp",
      serviceKey: "lashes",
      icon: EyeIcon,
    },
    {
      id: "aesthetic",
      title: "Aesthetic Enhancements",
      description:
        "Advanced aesthetic services designed to refine, enhance, and elevate your natural beauty.",
      price: "Starts at ₱1000",
      btnText: "Consult for Aesthetic Care",
      image: "/images/replica/aesthetic.webp",
      serviceKey: "aesthetics",
      icon: InjectionIcon,
    },
  ];

  const reviewsList = [
    {
      quote:
        "The place feels so premium and relaxing. From booking to service, everything felt organized and high-end.",
      author: "Ashley Dizon",
      initial: "A",
      image: "/images/clients/client-1.jpg",
    },
    {
      quote:
        "I love that Organiks has everything in one place. I came for skin care and ended up booking my next hair appointment too.",
      author: "Ella Santiago",
      initial: "E",
      image: "/images/clients/client-2.jpg",
    },
    {
      quote:
        "The ambiance is beautiful, the staff is professional, and the service feels worth it. Definitely my go-to in Pampanga.",
      author: "Quenie Estanislao",
      initial: "Q",
      image: "/images/clients/client-3.avif",
    },
    {
      quote:
        "Natural ingredients, advanced technology, and caring staff. The 2-floor setup is gorgeous — you feel completely pampered.",
      author: "Marielle Cruz",
      initial: "M",
      image: "/images/clients/client-4.avif",
    },
    {
      quote:
        "Got my lash lift and brow lamination done here and I'm obsessed. The results lasted weeks and the vibe is so relaxing.",
      author: "Diane Reyes",
      initial: "D",
      image: "/images/clients/client-5.avif",
    },
  ];

  // Avatar with image + initial fallback
  const ReviewAvatar = ({ review, size = 'md' }) => {
    const [imgFailed, setImgFailed] = useState(false);
    const dim = size === 'sm' ? 'w-9 h-9 text-sm' : 'w-10 h-10 text-sm';
    if (review.image && !imgFailed) {
      return (
        <img
          src={review.image}
          alt={review.author}
          onError={() => setImgFailed(true)}
          className={`${dim} rounded-full object-cover shrink-0 border-2 border-[#E8DDD2]`}
        />
      );
    }
    return (
      <span className={`${dim} rounded-full bg-[#D9CDB6] flex items-center justify-center font-serif font-bold text-[#5C4B2A] shrink-0`}>
        {review.initial}
      </span>
    );
  };

  // Measure card width responsively
  useEffect(() => {
    const measure = () => {
      if (carouselRef.current) {
        const w = carouselRef.current.offsetWidth;
        setContainerWidth(w);
        if (w < 640) {
          // On mobile, card takes ~82% of width so text is comfortable, legible, and side cards peek gently
          setCardWidth(Math.min(Math.floor(w * 0.82), 360));
        } else {
          setCardWidth(Math.min(Math.floor(w * 0.55), 420));
        }
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Set video loaded if already cached/playing on mount
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true);
    }
  }, []);

  // Infinite loop: after spring settles on a clone, silently snap to real card
  useEffect(() => {
    if (snap) {
      // Re-enable spring after the instant jump is rendered
      const t = setTimeout(() => setSnap(false), 40);
      return () => clearTimeout(t);
    }
    const SETTLE = 420; // ms — spring stiffness 320 / damping 35 settles here
    if (idx < CLONE) {
      const t = setTimeout(() => {
        setSnap(true);
        setIdx(CLONE + realN + (idx - CLONE)); // leading clone → real end
      }, SETTLE);
      return () => clearTimeout(t);
    }
    if (idx >= CLONE + realN) {
      const t = setTimeout(() => {
        setSnap(true);
        setIdx(CLONE + (idx - CLONE - realN)); // trailing clone → real start
      }, SETTLE);
      return () => clearTimeout(t);
    }
  }, [idx, snap]);

  // Track x: shift the strip so card[idx] is centered in the extended array
  // Derived from state (not refs) so it's safe to use during render
  const trackX = containerWidth === 0
    ? 0
    : containerWidth / 2 - cardWidth / 2 - idx * (cardWidth + CARD_GAP);

  const prevReview = () => setIdx((p) => p - 1);
  const nextReview = () => setIdx((p) => p + 1);
  const goToReview = (i) => setIdx(CLONE + i);

  const openCategoryModal = (serviceKey) => {
    const category = serviceCategories.find((c) => c.id === serviceKey);
    if (category) {
      setSelectedService(category);
    }
  };

  return (
    <div className="font-['Poppins',sans-serif] bg-white text-[#222] selection:bg-[#566B3F]/20 selection:text-[#14291F]">
      {/* 1. Hero Section — Full Screen Modern Sanctuary Layout */}
      <section
        id="home"
        className="relative min-h-[100dvh] flex items-center overflow-hidden text-[#FBF4E4] bg-[#14291F]"
      >
        {/* Exact First-Frame Poster (renders immediately while video buffers, zero pop) */}
        <picture>
          <source srcSet="/images/replica/hero-poster.webp" type="image/webp" />
          <img
            src="/images/replica/hero-poster.jpg"
            alt="Organiks Aesthetic Sanctuary"
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none select-none"
            loading="eager"
            fetchPriority="high"
          />
        </picture>

        {/* Fullscreen Background Video with smooth crossfade */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setIsVideoLoaded(true)}
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ease-out ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src="/images/replica/hero.mp4" type="video/mp4" />
        </video>

        {/* Ambient Gradient Overlays: Rich bottom fade on mobile, side-by-side on desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 via-40% to-transparent lg:bg-gradient-to-r lg:from-black/90 lg:via-black/60 lg:to-black/35 pointer-events-none" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

        {/* Content Container: Docked to bottom on mobile, balanced on desktop */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 pt-16 pb-4 sm:pt-28 sm:pb-12 flex flex-col justify-end lg:justify-between min-h-[100dvh]">
          {/* Main Content: Bottom-docked on mobile, vertically centered on desktop */}
          <div className="flex items-end lg:items-center w-full my-0 lg:my-auto pb-1 sm:pb-4 lg:py-8">
            <div className="text-left max-w-2xl w-full">
              {/* Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/40 lg:bg-white/10 backdrop-blur-md text-[#FFF3D6] text-[10px] sm:text-xs font-medium tracking-wider uppercase mb-2.5 sm:mb-5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#8FA86E] animate-pulse" />
                Angeles City&apos;s Premier Sanctuary
              </motion.div>

              {/* Headline with editorial styling */}
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-[clamp(25px,6.8vw,64px)] leading-[1.12] text-white font-normal tracking-tight m-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Natural Luxury <span className="italic text-[#E8DDD2] font-serif font-light">for</span>
                <br />
                Your Total Renewal
              </motion.h1>

              {/* Description: 2 lines on mobile so it stays neatly in the bottom fold */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="max-w-[560px] text-[12px] sm:text-[14.5px] text-[#FBF4E4]/90 leading-relaxed mt-2.5 sm:mt-5 mb-4 sm:mb-8 line-clamp-2 sm:line-clamp-none"
              >
                A 2-floor luxury destination blending organic-inspired rituals with advanced clinical care — designed for master hair styling, medical skin rejuvenation, ancient wellness therapies, and aesthetic renewal.
              </motion.p>

              {/* Dual CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="flex items-center gap-3 sm:gap-6 mb-4 sm:mb-8"
              >
                {/* Primary Pill Button with Arrow */}
                <motion.a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#14291F] hover:bg-[#1E3D2D] text-[#F4EEE3] py-2.5 px-5 sm:py-3 sm:px-6 rounded-full text-[11.5px] sm:text-[12.5px] font-medium transition-all no-underline shadow-xl hover:shadow-2xl border border-white/15"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  Book Appointment
                  <HugeiconsIcon icon={ArrowRight02Icon} size={15} strokeWidth={2.5} />
                </motion.a>

                {/* Secondary Button: View Services */}
                <motion.a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors cursor-pointer group no-underline py-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <div className="text-left">
                    <span className="block text-[11.5px] sm:text-xs font-semibold text-white tracking-wide">
                      View Services
                    </span>
                    <span className="block text-[10px] sm:text-[11px] text-white/70">
                      Explore rituals
                    </span>
                  </div>
                </motion.a>
              </motion.div>

              {/* Bottom Feature Badges */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="grid grid-cols-3 gap-2 sm:gap-6 pt-3 sm:pt-6 border-t border-white/15 max-w-[560px]"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#E8DCC2] shrink-0">
                    <HugeiconsIcon icon={Leaf01Icon} size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-[13px] font-semibold text-white leading-tight m-0 whitespace-nowrap">
                      Organic Care
                    </p>
                    <p className="text-[9.5px] sm:text-[11px] text-white/70 leading-tight m-0 mt-0.5 whitespace-nowrap">
                      Natural rituals
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#E8DCC2] shrink-0">
                    <HugeiconsIcon icon={SparklesIcon} size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-[13px] font-semibold text-white leading-tight m-0 whitespace-nowrap">
                      Advanced Tech
                    </p>
                    <p className="text-[9.5px] sm:text-[11px] text-white/70 leading-tight m-0 mt-0.5 whitespace-nowrap">
                      Clinical precision
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#E8DCC2] shrink-0">
                    <HugeiconsIcon icon={Layers01Icon} size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-[13px] font-semibold text-white leading-tight m-0 whitespace-nowrap">
                      2-Floor Haven
                    </p>
                    <p className="text-[9.5px] sm:text-[11px] text-white/70 leading-tight m-0 mt-0.5 whitespace-nowrap">
                      All-in-one spa
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom subtle indicator */}
          <div className="pt-2 sm:pt-6 flex items-center justify-between text-[10px] sm:text-[11px] text-white/50 border-t border-white/10">
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-[1px] bg-white/40" />
              Friendship Highway, Angeles City • Open Daily
            </span>
          </div>
        </div>
      </section>

      {/* 2. Intro Section */}
      <section id="about" className="py-14 sm:py-20 bg-[#FEFBF7]">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Text Column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-[440px] mx-auto"
            >
              <div className="mb-7 flex justify-center">
                <img
                  src="/images/logo.webp"
                  alt="Organiks Salon and Wellness Spa"
                  className="h-18 w-auto object-contain"
                />
              </div>

              <h2
                className="text-2xl text-[#566B3F] tracking-[0.02em] font-medium"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                A Luxury Destination For Your Glow
              </h2>

              <p className="my-7 text-sm text-[#444] leading-relaxed">
                Organiks is designed for women and men who want premium beauty,
                confidence, wellness, and care in one elegant place. From hair
                color and skin therapy to massage, nails, lashes, aesthetic
                enhancements, and wellness drips, every service is created to
                help you feel renewed, polished, and confident.
              </p>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex gap-2 w-max bg-[#14291F] hover:bg-[#1E3D2D] text-[#F4EEE3] py-3 px-7 rounded-xl text-[14px] font-medium transition-all no-underline shadow-sm"
              >
                <HugeiconsIcon
                  icon={CalendarAdd02Icon}
                  size={20}
                  color="#ffffff"
                  strokeWidth={2}
                />
                Book Your Appointment
              </a>
            </motion.div>

            {/* Photo Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-[430px] mx-auto aspect-[3/4] rounded-lg overflow-hidden shadow-md bg-[#E6D9C2]"
            >
              <img
                src="/images/replica/intro.webp"
                alt="Guests enjoying wellness at Organiks Salon and Wellness Spa"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Pillars Section */}
      <section className="py-14 sm:py-20 text-center bg-[#FEFBF7] border-t border-[#F4EEE3]">
        <div className="max-w-[1140px] mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-[26px] text-[#566B3F] mb-14 font-medium"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Natural Ingredients • Advanced Technology • Expert Care
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { title: "Premium Care", image: "/images/replica/icon1.webp" },
              { title: "Expert Team", image: "/images/replica/icon2.webp" },
              {
                title: "Advanced Technology",
                image: "/images/replica/icon3.webp",
              },
              {
                title: "Luxurious Environment",
                image: "/images/replica/icon4.webp",
              },
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center cursor-default"
              >
                <motion.div
                  className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] mb-4 rounded-full border-2 border-[#B8975A] overflow-hidden bg-white p-1.5"
                  style={{ boxShadow: "0 2px 8px rgba(184, 151, 90, 0.1)" }}
                  whileHover={{
                    scale: 1.08,
                    boxShadow: "0 8px 28px rgba(184, 151, 90, 0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 15 }}
                >
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
                <h3
                  className="text-lg sm:text-xl font-medium text-[#222]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {pillar.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Services Grid */}
      <section
        id="services"
        className="py-16 sm:py-20 bg-[#FEFBF7] text-center border-t border-[#F4EEE3]"
      >
        <div className="max-w-[1140px] mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[clamp(36px,4.5vw,52px)] text-[#566B3F] tracking-[0.03em] font-normal"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Services
          </motion.h2>

          <p className="text-[13px] text-[#555] mt-2.5 mb-14 max-w-lg mx-auto leading-relaxed">
            Every glow goal, under one roof.
            <br />
            Explore our premium salon, spa, skin, body, wellness, and aesthetic
            services.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1080px] mx-auto">
            {servicesList.map((service, i) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.65,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 56px rgba(44,39,35,0.18)",
                  transition: { type: "spring", stiffness: 320, damping: 22 },
                }}
                className="group relative overflow-hidden rounded-[20px] cursor-pointer aspect-[4/5.4] min-h-[430px] sm:min-h-[460px] text-left"
                style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.12)" }}
                onClick={() => openCategoryModal(service.serviceKey)}
              >
                {/* ── Full-bleed image ───────────────────────── */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />

                {/* Scrim: Lowered so top ~76% of the image is completely unobscured */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 via-5% to-transparent pointer-events-none" />

                {/* Category Pill — top-left */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md shadow-sm border border-white/10">
                  <HugeiconsIcon icon={service.icon} size={12} color="#E5C378" strokeWidth={2.2} />
                  <span className="text-[10px] font-medium text-white/90 tracking-wider uppercase">
                    {service.title.split(' ')[0]}
                  </span>
                </div>

                {/* ── Content panel — docked tightly at the bottom ──────── */}
                <div className="absolute bottom-0 inset-x-0 px-4 sm:px-4.5 pt-2 pb-3.5 sm:pb-4 text-left flex flex-col justify-end">
                  {/* Title in Poppins font */}
                  <h3
                    className="text-[15.5px] sm:text-[17px] font-semibold text-white leading-tight mb-1 tracking-[-0.01em]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] sm:text-[11.5px] text-white/80 leading-relaxed line-clamp-2 mb-2 font-light">
                    {service.description}
                  </p>

                  {/* Price Tag with warm gold accent */}
                  <div className="flex items-baseline gap-1.5 mb-2.5 text-left">
                    <span className="text-[13px] sm:text-[13.5px] font-bold text-[#F1DEB4] tracking-tight">
                      {service.price}
                    </span>
                  </div>

                  {/* Primary CTA: High-contrast white button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCategoryModal(service.serviceKey);
                    }}
                    className="w-full py-2 sm:py-2.5 px-4 rounded-xl text-[12px] sm:text-[12.5px] font-semibold bg-white hover:bg-[#F5EFE6] text-[#14291F] transition-all shadow-md text-center cursor-pointer"
                    whileTap={{ scale: 0.98 }}
                  >
                    {service.btnText}
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Banner Section: "Your glow starts with one message" */}
      <section className="py-8 sm:py-10 bg-[#FEFBF7]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E8DDD2]/60 bg-[#FAF3E8] flex flex-col md:flex-row md:items-center min-h-0 md:min-h-[380px]">
            {/* Mobile: Dedicated Image zoomed tightly and focused on the client and consultant */}
            <div className="md:hidden relative w-full h-[240px] sm:h-[280px] overflow-hidden">
              <img
                src="/images/replica/banner.png"
                alt="Organiks Spa Experience"
                className="w-full h-full object-cover object-[94%_32%] scale-[1.45] origin-[92%_32%]"
              />
            </div>

            {/* Desktop: Full-bleed background image with smooth horizontal gradient */}
            <div
              className="hidden md:block absolute inset-0 bg-cover bg-[position:center_right] lg:bg-center"
              style={{ backgroundImage: `url('/images/replica/banner.png')` }}
            />
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#FAF3E8] via-[#FAF3E8]/85 via-40% to-transparent pointer-events-none" />

            {/* Text Content */}
            <div className="relative z-10 p-6 sm:p-8 md:p-12 max-w-[460px] text-left">
              <div className="mb-4 sm:mb-6">
                <img
                  src="/images/logo.webp"
                  alt="Organiks"
                  className="h-14 sm:h-18 w-auto object-contain"
                />
              </div>

              <h2
                className="text-[25px] sm:text-[30px] md:text-[clamp(28px,3.5vw,40px)] text-[#2C3820] leading-[1.18] font-medium m-0 tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Your glow starts with <em className="italic font-normal">one</em> message.
              </h2>

              <p className="text-[13px] sm:text-[13.5px] text-[#4A4E44] my-3.5 sm:my-5 leading-relaxed font-light">
                Tell us your beauty or wellness goal and our team will recommend
                the best Organiks ritual for you.
              </p>

              <motion.a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5B6F43] hover:bg-[#4E6037] text-white rounded-full py-2.5 sm:py-3 px-6 sm:px-7 text-[11px] font-semibold tracking-[0.14em] uppercase no-underline shadow-sm transition-colors cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <HugeiconsIcon
                  icon={SparklesIcon}
                  size={14}
                  color="#ffffff"
                  strokeWidth={2}
                />
                START YOUR JOURNEY
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Client Reviews Carousel — true sliding track */}
      <section className="py-14 sm:py-20 bg-[#FEFBF7]">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 px-4"
          >
            <p className="text-xs tracking-[3px] uppercase text-[#566B3F] font-semibold mb-2">What Clients Say</p>
            <h2 className="text-2xl sm:text-3xl font-light text-[#14291F]" style={{ fontFamily: 'var(--font-heading)' }}>
              Real Experiences
            </h2>
          </motion.div>

          {/* Sliding track container */}
          <div
            ref={carouselRef}
            className="relative overflow-hidden py-6"
            style={{
              maskImage: containerWidth < 640
                ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
                : 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              WebkitMaskImage: containerWidth < 640
                ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
                : 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            }}
            onPointerDown={(e) => { swipeStartX.current = e.clientX; }}
            onPointerUp={(e) => {
              if (swipeStartX.current !== null) {
                const diff = e.clientX - swipeStartX.current;
                if (diff < -50) nextReview();
                else if (diff > 50) prevReview();
                swipeStartX.current = null;
              }
            }}
          >
            {/* The single sliding strip — renders clones + real cards */}
            <motion.div
              className="flex"
              animate={{ x: trackX }}
              transition={snap
                ? { duration: 0 }
                : { type: 'spring', stiffness: 320, damping: 35, mass: 0.8 }
              }
              style={{ gap: CARD_GAP }}
            >
              {[...reviewsList.slice(-CLONE), ...reviewsList, ...reviewsList.slice(0, CLONE)].map((review, i) => {
                const isActive = i === idx;
                return (
                  <motion.article
                    key={i}
                    onClick={() => { if (!isActive) goToReview(((i - CLONE) % realN + realN) % realN); }}
                    animate={{
                      opacity: isActive ? 1 : 0.45,
                      scale: isActive ? 1 : 0.93,
                    }}
                    whileHover={isActive ? { y: -5 } : { opacity: 0.65, scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="shrink-0 bg-white rounded-2xl p-5 sm:p-8 border border-[#E8DDD2]/60 cursor-pointer select-none"
                    style={{
                      width: cardWidth,
                      boxShadow: isActive
                        ? '0 8px 40px rgba(44,39,35,0.13)'
                        : '0 2px 12px rgba(44,39,35,0.06)',
                    }}
                  >
                    <HugeiconsIcon icon={QuoteDownIcon} size={24} color="#B8975A" strokeWidth={1.5} className="mb-2 sm:mb-3 opacity-50" />
                    <div className="text-[#F5B50A] tracking-[3px] text-xs mb-2.5 sm:mb-3" aria-label="5 stars">★★★★★</div>
                    <p
                      className="text-[#333] leading-relaxed font-light mb-5 sm:mb-6"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: isActive
                          ? (containerWidth < 640 ? '0.975rem' : '1.0625rem')
                          : (containerWidth < 640 ? '0.85rem' : '0.9rem'),
                      }}
                    >
                      &ldquo;{review.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 border-t border-[#E8DDD2]/50 pt-3.5 sm:pt-4">
                      <ReviewAvatar review={review} size={isActive ? 'md' : 'sm'} />
                      <div>
                        <p className="text-sm font-semibold text-[#222]">{review.author}</p>
                        <p className="text-xs text-[#999]">Verified Client</p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>

          {/* Navigation row */}
          <div className="flex items-center justify-center gap-4 mt-6 px-4">
            <motion.button
              onClick={prevReview}
              aria-label="Previous review"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-full bg-white border border-[#E8DDD2] flex items-center justify-center text-[#566B3F] hover:bg-[#566B3F] hover:text-white hover:border-[#566B3F] transition-all shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </motion.button>

            <div className="flex items-center gap-2">
              {reviewsList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToReview(i)}
                  aria-label={`Review ${i + 1}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeReview ? '22px' : '8px',
                    height: '8px',
                    background: i === activeReview ? '#566B3F' : '#D9CDB6',
                  }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextReview}
              aria-label="Next review"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-full bg-white border border-[#E8DDD2] flex items-center justify-center text-[#566B3F] hover:bg-[#566B3F] hover:text-white hover:border-[#566B3F] transition-all shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          </div>

        </div>
      </section>


      {/* Enhanced Category Modal: displays full item breakdown and transparent pricing */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#E8DDD2]"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-[#F4EEE3] flex items-center justify-between bg-[#F4EEE3]">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#566B3F] font-bold">
                    Organiks Menu
                  </span>
                  <h3
                    className="text-2xl font-medium text-[#222] m-0"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {selectedService.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#222] hover:bg-[#566B3F] hover:text-white transition-colors cursor-pointer"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="p-6 overflow-y-auto space-y-3 divide-y divide-[#F8F5F1]">
                <p className="text-xs text-[#555] mb-4">
                  {selectedService.tagline}
                </p>

                {selectedService.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.04,
                      ease: "easeOut",
                    }}
                    className="pt-3 first:pt-0 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[#222] text-sm">
                        {item.name}
                      </p>
                      {item.note && <p className="text-[#666]">{item.note}</p>}
                    </div>
                    <span className="font-bold text-[#566B3F] text-sm ml-4 shrink-0">
                      {item.price}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-[#F4EEE3] bg-[#FEFBF7] flex items-center justify-between">
                <span className="text-xs text-[#666]">
                  Friendship Highway, Angeles City
                </span>
                <motion.a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#14291F] text-[#F4EEE3] text-xs font-semibold py-2.5 px-5 rounded hover:bg-[#1E3D2D] transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Calendar04Icon className="w-3.5 h-3.5" />
                  Book Now
                </motion.a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
