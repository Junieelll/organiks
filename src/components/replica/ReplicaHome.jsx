import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { BOOKING_URL } from "../../constants/config";
import { serviceCategories } from "../../data/services";
import ReplicaBanner from "./ReplicaBanner";
import ReplicaReviews from "./ReplicaReviews";
import { usePageTransition, usePageEnterDelay } from "./PageTransition";
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CalendarAdd02Icon,
  ScissorIcon,
  TreatmentIcon,
  WellnessIcon,
  PaintBrush01Icon,
  EyeIcon,
  InjectionIcon,
  Activity01Icon,
  SparklesIcon,
  ArrowRight02Icon,
  Leaf01Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";

/* ------------------------------------------------------------------ */
/* Scroll-reveal motion for the Intro, Pillars and Services sections.  */
/* Each section gets one idea instead of a shared fade-and-slide-up:   */
/*   Intro    – photo unveiled like a curtain, copy follows            */
/*   Pillars  – gold ring draws itself, icon settles inside             */
/*   Services – cards lift like a curtain, staggered by column          */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1];

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

// Headings rise word by word out of a mask (same treatment as the banner and reviews)
const headingVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const wordVariants = {
  hidden: { y: "105%" },
  visible: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};

function RevealWords({ text }) {
  return text.split(" ").map((word, i) => (
    <span
      key={i}
      aria-hidden="true"
      className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.26em] last:mr-0"
    >
      <motion.span className="inline-block" variants={wordVariants}>
        {word}
      </motion.span>
    </span>
  ));
}

// Intro
const introFrameVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};
const curtainVariants = {
  hidden: { clipPath: "inset(100% 0% 0% 0% round 8px)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0% round 8px)",
    transition: { duration: 1.2, ease: EASE },
  },
};
const settleVariants = {
  hidden: { scale: 1.18 },
  visible: { scale: 1, transition: { duration: 1.8, ease: EASE } },
};
const introTextVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.6, staggerChildren: 0.14 } },
};

// Pillars
const pillarGridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16 } },
};
const pillarVariants = { hidden: {}, visible: {} };
const ringVariants = {
  hidden: { pathLength: 0 },
  visible: { pathLength: 1, transition: { duration: 1.1, ease: EASE } },
};
const pillarImageVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: 0.4, ease: EASE },
  },
};
const pillarTitleVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, delay: 0.7, ease: "easeOut" } },
};

// Services
const servicesHeaderVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
// `custom` is the column (0-2): a row's cards ripple left to right, but a new row never waits on the one above
const serviceCardVariants = {
  hidden: { opacity: 0 },
  visible: (col) => ({
    opacity: 1,
    transition: { duration: 0.4, delay: col * 0.12, ease: "easeOut" },
  }),
};
const serviceClipVariants = {
  hidden: { clipPath: "inset(14% 0% 0% 0% round 20px)" },
  visible: (col) => ({
    clipPath: "inset(0% 0% 0% 0% round 20px)",
    transition: { duration: 0.95, delay: col * 0.12, ease: EASE },
  }),
};
const serviceSettleVariants = {
  hidden: { scale: 1.15 },
  visible: (col) => ({
    scale: 1,
    transition: { duration: 1.6, delay: col * 0.12, ease: EASE },
  }),
};
const serviceContentVariants = {
  hidden: { opacity: 0 },
  visible: (col) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: 0.45 + col * 0.12, ease: "easeOut" },
  }),
};

export default function ReplicaHome() {
  const { goReveal } = usePageTransition();
  const enterDelay = usePageEnterDelay(); // hero waits for the page curtain when arriving via nav
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Intro photo drifts slightly slower than the page while it scrolls past
  const introPhotoRef = useRef(null);
  const { scrollYProgress: introProgress } = useScroll({
    target: introPhotoRef,
    offset: ["start end", "end start"],
  });
  const introPhotoY = useTransform(
    introProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-6%", "6%"]
  );

  const categoryMeta = {
    hair: {
      icon: ScissorIcon,
      price: "Starts at ₱400",
      btnText: "Find Your Look",
    },
    facials: {
      icon: TreatmentIcon,
      price: "Starts at ₱1,000",
      btnText: "Discover Your Glow",
    },
    massage: {
      icon: WellnessIcon,
      price: "Starts at ₱600",
      btnText: "Find Your Calm",
    },
    nails: {
      icon: PaintBrush01Icon,
      price: "Starts at ₱400",
      btnText: "Pick Your Polish",
    },
    lashes: {
      icon: EyeIcon,
      price: "Starts at ₱300",
      btnText: "Explore Lash & Brow Care",
    },
    aesthetics: {
      icon: InjectionIcon,
      price: "Starts at ₱800",
      btnText: "Explore Treatments",
    },
    body: {
      icon: Activity01Icon,
      price: "Starts at ₱1,500",
    },
  };

  // Friendly, but honest: these open the category page (services + prices), not the booking form,
  // so the wording invites browsing ("find", "discover", "explore") instead of promising a booking.
  const HOME_SERVICE_IDS = ["hair", "facials", "massage", "nails", "lashes", "aesthetics"];

  const servicesList = HOME_SERVICE_IDS.map((id) => {
    const cat = serviceCategories.find((c) => c.id === id);
    if (!cat) return null;
    const meta = categoryMeta[id] || {
      icon: SparklesIcon,
      price: "Starts at ₱500",
      btnText: `Explore ${cat.title}`,
    };
    return {
      id: cat.id,
      title: cat.title,
      description: cat.tagline,
      price: meta.price,
      btnText: meta.btnText,
      image: cat.image,
      serviceKey: cat.id,
      icon: meta.icon,
    };
  }).filter(Boolean);

  // Set video loaded if already cached/playing on mount
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true);
    }
  }, []);

  // Card click: a green circle grows from where you clicked, names the category,
  // then reveals the Services page with that category already selected.
  const openCategoryPage = (e, service) => {
    let x = e.clientX;
    let y = e.clientY;
    if (!x && !y) {
      // keyboard activation has no pointer position: use the element's center
      const r = e.currentTarget.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    }
    goReveal("/services", {
      x,
      y,
      label: service.title,
      anchor: "#services-anchor",
      state: { category: service.serviceKey },
    });
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
                transition={{ duration: 0.6, delay: enterDelay }}
                className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/40 lg:bg-white/10 backdrop-blur-md text-[#FFF3D6] text-[10px] sm:text-xs font-medium tracking-wider uppercase mb-2.5 sm:mb-5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#8FA86E] animate-pulse" />
                Angeles City&apos;s Premier Sanctuary
              </motion.div>

              {/* Headline with editorial styling */}
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + enterDelay }}
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
                transition={{ duration: 0.7, delay: 0.3 + enterDelay }}
                className="max-w-[560px] text-[12px] sm:text-[14.5px] text-[#FBF4E4]/90 leading-relaxed mt-2.5 sm:mt-5 mb-4 sm:mb-8 line-clamp-2 sm:line-clamp-none"
              >
                A 2-floor luxury destination blending organic-inspired rituals with advanced clinical care — designed for master hair styling, medical skin rejuvenation, ancient wellness therapies, and aesthetic renewal.
              </motion.p>

              {/* Dual CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 + enterDelay }}
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
                transition={{ duration: 0.7, delay: 0.6 + enterDelay }}
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

      {/* 2. Intro Section — the photo is unveiled first, then the copy follows */}
      <section id="about" className="py-14 sm:py-20 bg-[#FEFBF7]">
        <div className="max-w-[1140px] mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Text Column */}
            <motion.div
              variants={introTextVariants}
              className="text-center max-w-[440px] mx-auto"
            >
              <motion.div variants={fadeVariants} className="mb-7 flex justify-center">
                <img
                  src="/images/logo.webp"
                  alt="Organiks Salon and Wellness Spa"
                  className="h-18 w-auto object-contain"
                />
              </motion.div>

              <motion.h2
                variants={headingVariants}
                aria-label="A Luxury Destination For Your Glow"
                className="text-2xl text-[#566B3F] tracking-[0.02em] font-medium"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <RevealWords text="A Luxury Destination For Your Glow" />
              </motion.h2>

              <motion.p variants={fadeVariants} className="my-7 text-sm text-[#444] leading-relaxed">
                Organiks is designed for women and men who want premium beauty,
                confidence, wellness, and care in one elegant place. From hair
                color and skin therapy to massage, nails, lashes, aesthetic
                enhancements, and wellness drips, every service is created to
                help you feel renewed, polished, and confident.
              </motion.p>

              <motion.div variants={fadeVariants}>
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
            </motion.div>

            {/* Photo Column: frame (keeps the shadow) > curtain clip > parallax drift > settle zoom */}
            <motion.div
              ref={introPhotoRef}
              variants={introFrameVariants}
              className="relative w-full max-w-[430px] mx-auto aspect-[3/4] rounded-lg shadow-md bg-[#E6D9C2]"
            >
              <motion.div
                variants={curtainVariants}
                className="absolute inset-0 overflow-hidden rounded-lg"
              >
                <motion.div
                  className="absolute inset-x-0 -top-[8%] -bottom-[8%]"
                  style={{ y: introPhotoY }}
                >
                  <motion.div className="w-full h-full" variants={settleVariants}>
                    <img
                      src="/images/replica/intro.webp"
                      alt="Guests enjoying wellness at Organiks Salon and Wellness Spa"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. Pillars Section — each gold ring draws itself, then the icon settles inside */}
      <section className="py-14 sm:py-20 text-center bg-[#FEFBF7] border-t border-[#F4EEE3]">
        <div className="max-w-[1140px] mx-auto px-6">
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl sm:text-[26px] text-[#566B3F] mb-14 font-medium"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Natural Ingredients • Advanced Technology • Expert Care
          </motion.h2>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
            variants={pillarGridVariants}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
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
                variants={pillarVariants}
                className="flex flex-col items-center cursor-default"
              >
                <motion.div
                  className="relative w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] mb-4 rounded-full overflow-hidden bg-white p-1.5"
                  style={{ boxShadow: "0 2px 8px rgba(184, 151, 90, 0.1)" }}
                  whileHover={{
                    scale: 1.08,
                    boxShadow: "0 8px 28px rgba(184, 151, 90, 0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 15 }}
                >
                  <motion.img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-contain"
                    variants={pillarImageVariants}
                  />
                  {/* Gold ring: replaces the CSS border so it can be drawn */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                    aria-hidden="true"
                  >
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="49"
                      fill="none"
                      stroke="#B8975A"
                      strokeWidth="1.4"
                      variants={ringVariants}
                    />
                  </svg>
                </motion.div>
                <motion.h3
                  variants={pillarTitleVariants}
                  className="text-lg sm:text-xl font-medium text-[#222]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {pillar.title}
                </motion.h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Services Grid — each card is unveiled like a curtain lifting; columns stagger, rows don't wait */}
      <section
        id="services"
        className="py-16 sm:py-20 bg-[#FEFBF7] text-center border-t border-[#F4EEE3]"
      >
        <div className="max-w-[1140px] mx-auto px-6">
          <motion.div
            variants={servicesHeaderVariants}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            <motion.h2
              variants={headingVariants}
              aria-label="Our Services"
              className="text-[clamp(36px,4.5vw,52px)] text-[#566B3F] tracking-[0.03em] font-normal"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RevealWords text="Our Services" />
            </motion.h2>

            <motion.p
              variants={fadeVariants}
              className="text-[13px] text-[#555] mt-2.5 mb-14 max-w-lg mx-auto leading-relaxed"
            >
              Every glow goal, under one roof.
              <br />
              Explore our premium salon, spa, skin, body, wellness, and aesthetic
              services.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1080px] mx-auto">
            {servicesList.map((service, i) => (
              <motion.article
                key={service.id}
                custom={i % 3}
                variants={serviceCardVariants}
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 56px rgba(44,39,35,0.18)",
                  transition: { type: "spring", stiffness: 320, damping: 22 },
                }}
                className="group relative overflow-hidden rounded-[20px] cursor-pointer aspect-[4/5.4] min-h-[430px] sm:min-h-[460px] text-left"
                style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.12)" }}
                onClick={(e) => openCategoryPage(e, service)}
              >
                {/* Clip lives on an inner layer so the card's own hover shadow is never cut off */}
                <motion.div
                  custom={i % 3}
                  variants={serviceClipVariants}
                  className="absolute inset-0"
                >
                  {/* ── Full-bleed image ───────────────────────── */}
                  <motion.div
                    custom={i % 3}
                    variants={serviceSettleVariants}
                    className="absolute inset-0"
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      loading="lazy"
                    />
                  </motion.div>

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
                  <motion.div
                    custom={i % 3}
                    variants={serviceContentVariants}
                    className="absolute bottom-0 inset-x-0 px-4 sm:px-4.5 pt-2 pb-3.5 sm:pb-4 text-left flex flex-col justify-end"
                  >
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
                      aria-label={`${service.btnText}: view ${service.title} and prices`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openCategoryPage(e, service);
                      }}
                      className="w-full py-2 sm:py-2.5 px-4 rounded-xl text-[12px] sm:text-[12.5px] font-semibold bg-white hover:bg-[#F5EFE6] text-[#14291F] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      whileTap={{ scale: 0.98 }}
                    >
                      {service.btnText}
                      <HugeiconsIcon icon={ArrowRight02Icon} size={14} strokeWidth={2.5} />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Banner Section */}
      <ReplicaBanner />

      {/* 6. Client Reviews */}
      <ReplicaReviews />

    </div>
  );
}