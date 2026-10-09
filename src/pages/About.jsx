import { useState, useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarAdd02Icon } from "@hugeicons/core-free-icons";
import { BOOKING_URL } from "../constants/config";
import { usePageEnterDelay } from "../components/common/PageTransition";

/* ------------------------------------------------------------------ */
/* Images: the exact files used on organikssalonandwellnessspa.com.    */
/* They're hot-linked so this works immediately; download them into    */
/* /public/images/about/ and swap these paths to host them yourself.   */
/* ------------------------------------------------------------------ */
const IMAGES = {
  backdrop: `/images/logo.webp`, // page-top background on the original
  intro: `/images/about/image-1.webp`, // beside the "About Organiks" copy
  commitment: `/images/about/image-2.webp`, // beside "Our Commitment"
};

/* ------------------------------------------------------------------ */
/* Motion: same vocabulary as the Home page                            */
/*   photos   – unveiled like a curtain, settle from a zoom, parallax  */
/*   headings – rise word by word out of a mask                        */
/*   dividers – the gold hairline draws itself before the copy appears */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1];

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};
const headingVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const wordVariants = {
  hidden: { y: "105%" },
  visible: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};
const textGroupVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.5, staggerChildren: 0.14 } },
};

const frameVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};
const curtainVariants = {
  bottom: {
    hidden: { clipPath: "inset(100% 0% 0% 0% round 8px)" },
    visible: {
      clipPath: "inset(0% 0% 0% 0% round 8px)",
      transition: { duration: 1.2, ease: EASE },
    },
  },
  left: {
    hidden: { clipPath: "inset(0% 100% 0% 0% round 8px)" },
    visible: {
      clipPath: "inset(0% 0% 0% 0% round 8px)",
      transition: { duration: 1.2, ease: EASE },
    },
  },
};
const settleVariants = {
  hidden: { scale: 1.18 },
  visible: { scale: 1, transition: { duration: 1.8, ease: EASE } },
};

const lineYVariants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 1, ease: EASE } },
};
const lineXVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1, ease: EASE } },
};
const missionVisionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.35 } },
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

// Photo: frame (keeps the shadow) > curtain clip > parallax drift > settle zoom.
// Must sit inside a parent that drives "hidden" / "visible".
function RevealPhoto({ src, alt, className = "", from = "bottom" }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-6%", "6%"]
  );

  return (
    <motion.div
      ref={ref}
      variants={frameVariants}
      className={`relative rounded-lg shadow-md bg-[#E6D9C2] ${className}`}
    >
      <motion.div
        variants={curtainVariants[from]}
        className="absolute inset-0 overflow-hidden rounded-lg"
      >
        <motion.div
          className="absolute inset-x-0 -top-[8%] -bottom-[8%]"
          style={{ y }}
        >
          <motion.div className="w-full h-full" variants={settleVariants}>
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function BookButton() {
  return (
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
  );
}

const EYEBROW =
  "text-xs tracking-[3px] uppercase font-semibold mb-3";

export default function About() {
  const reduceMotion = useReducedMotion();
  const enterDelay = usePageEnterDelay(); // wait for the page curtain when arriving via nav

  // The hero is on screen at load, so it plays on mount (after the page curtain) instead of on scroll
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), (enterDelay || 0) * 1000);
    return () => clearTimeout(t);
  }, [enterDelay]);

  const inView = {
    initial: reduceMotion ? false : "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.3 },
  };

  return (
    <div className="font-['Poppins',sans-serif] bg-white text-[#222] selection:bg-[#566B3F]/20 selection:text-[#14291F]">
      {/* 1. About Organiks */}
      <section className="relative overflow-hidden bg-[#FEFBF7]">
        <img
          src={IMAGES.backdrop}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FEFBF7] via-[#FEFBF7]/90 to-[#FEFBF7]/60 pointer-events-none" />

        <motion.div
          className="relative max-w-[1140px] mx-auto px-6 pt-28 pb-16 sm:pt-36 sm:pb-24 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center"
          initial={reduceMotion ? false : "hidden"}
          animate={heroReady ? "visible" : "hidden"}
        >
          <motion.div variants={textGroupVariants} className="max-w-[500px]">
            <motion.p
              variants={fadeVariants}
              className={`${EYEBROW} text-[#566B3F]`}
            >
              About Organiks
            </motion.p>

            <motion.h1
              variants={headingVariants}
              aria-label="A Destination Created for Beauty, Wellness, and Confidence"
              className="text-[clamp(28px,3.8vw,44px)] leading-[1.15] text-[#2C3820] font-medium tracking-tight m-0"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RevealWords text="A Destination Created for Beauty, Wellness, and Confidence" />
            </motion.h1>

            <motion.p
              variants={fadeVariants}
              className="mt-7 text-[15px] text-[#2C3820] leading-relaxed"
            >
              At Organiks Salon &amp; Wellness Spa, we believe that self-care
              should be more than just a routine. It should be an experience
              that helps you look your best, feel your best, and become the
              most confident version of yourself.
            </motion.p>

            <motion.p
              variants={fadeVariants}
              className="mt-4 text-sm text-[#444] leading-relaxed"
            >
              Located in the heart of Angeles City, Pampanga, Organiks was
              established with a simple vision: to create a complete beauty and
              wellness destination where clients can enjoy premium salon
              services, relaxing spa treatments, advanced aesthetic procedures,
              and wellness solutions under one roof.
            </motion.p>

            <motion.p
              variants={fadeVariants}
              className="mt-4 mb-8 text-sm text-[#444] leading-relaxed"
            >
              Instead of traveling to multiple locations for hair, skin, body,
              and wellness needs, our clients can experience everything in one
              elegant, convenient, and professionally managed space.
            </motion.p>

            <motion.div variants={fadeVariants}>
              <BookButton />
            </motion.div>
          </motion.div>

          <RevealPhoto
            src={IMAGES.intro}
            alt="Organiks Salon & Wellness Spa"
            from="bottom"
            className="w-full max-w-[430px] mx-auto aspect-[3/4]"
          />
        </motion.div>
      </section>

      {/* 2. Mission & Vision: two statements divided by a hairline that draws first */}
      <section className="py-16 sm:py-24 bg-[#FEFBF7] border-t border-[#F4EEE3]">
        <motion.div
          className="relative max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0"
          variants={missionVisionVariants}
          {...inView}
        >
          <motion.div variants={fadeVariants} className="md:pr-16">
            <p className={`${EYEBROW} text-[#B8975A]`}>Our Mission</p>
            <p
              className="text-[19px] sm:text-[22px] leading-snug text-[#14291F] font-light m-0"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              To provide exceptional beauty, wellness, and aesthetic
              experiences that empower our clients to feel confident,
              refreshed, and cared for through professional expertise,
              innovative treatments, and personalized service.
            </p>
          </motion.div>

          {/* Vertical on desktop, horizontal on mobile */}
          <motion.span
            variants={lineYVariants}
            aria-hidden="true"
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#B8975A]/60 origin-top"
          />
          <motion.span
            variants={lineXVariants}
            aria-hidden="true"
            className="md:hidden block h-px bg-[#B8975A]/60 origin-left"
          />

          <motion.div variants={fadeVariants} className="md:pl-16">
            <p className={`${EYEBROW} text-[#B8975A]`}>Our Vision</p>
            <p
              className="text-[19px] sm:text-[22px] leading-snug text-[#14291F] font-light m-0"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              To become the leading all-in-one beauty, wellness, and aesthetic
              destination in Pampanga by setting the standard for quality,
              innovation, client care, and results-driven treatments.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. What makes Organiks different */}
      <section className="py-20 sm:py-28 bg-[#14291F] text-center">
        <motion.div
          className="max-w-[760px] mx-auto px-6"
          variants={textGroupVariants}
          {...inView}
        >
          <motion.p
            variants={fadeVariants}
            className={`${EYEBROW} text-[#E5C378]`}
          >
            What Makes Organiks Different
          </motion.p>

          <motion.h2
            variants={headingVariants}
            aria-label="Everything You Need. All In One Destination."
            className="text-[clamp(28px,4.2vw,48px)] leading-[1.15] text-[#FBF4E4] font-medium tracking-tight m-0"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <RevealWords text="Everything You Need. All In One Destination." />
          </motion.h2>

          <motion.p
            variants={fadeVariants}
            className="mt-7 text-[15px] text-[#FBF4E4]/80 leading-relaxed max-w-[560px] mx-auto"
          >
            Unlike traditional salons or standalone spas, Organiks brings
            together multiple beauty and wellness specialties in one location.
          </motion.p>
        </motion.div>
      </section>

      {/* 4. Our commitment */}
      <section className="py-16 sm:py-24 bg-[#FEFBF7]">
        <motion.div
          className="max-w-[1140px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center"
          {...inView}
        >
          <RevealPhoto
            src={IMAGES.commitment}
            alt="Organiks Salon & Wellness Spa"
            from="left"
            className="w-full max-w-[460px] mx-auto aspect-[4/5] md:order-first"
          />

          <motion.div variants={textGroupVariants} className="max-w-[480px]">
            <motion.p
              variants={fadeVariants}
              className={`${EYEBROW} text-[#B8975A]`}
            >
              Our Commitment
            </motion.p>

            <motion.h2
              variants={headingVariants}
              aria-label="At Organiks Salon & Wellness Spa, our commitment goes beyond beauty."
              className="text-[clamp(24px,3vw,34px)] leading-[1.2] text-[#566B3F] font-medium tracking-tight m-0"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RevealWords text="At Organiks Salon & Wellness Spa, our commitment goes beyond beauty." />
            </motion.h2>

            <motion.p
              variants={fadeVariants}
              className="mt-7 text-[15px] text-[#2C3820] leading-relaxed"
            >
              We are dedicated to helping every client feel more confident,
              refreshed, empowered, and cared for through services that nurture
              both appearance and well-being.
            </motion.p>

            <motion.p
              variants={fadeVariants}
              className="mt-4 mb-8 text-sm text-[#444] leading-relaxed"
            >
              Whether you&apos;re visiting for a quick beauty appointment, a
              relaxing massage, a skin treatment, or a complete self-care day,
              our goal is to ensure that every visit leaves you feeling
              renewed, confident, and inspired.
            </motion.p>

            <motion.div variants={fadeVariants}>
              <BookButton />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}