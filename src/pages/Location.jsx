import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  CalendarAdd02Icon,
  Home09Icon,
  PhoneIcon,
} from "@hugeicons/core-free-icons";
import { BOOKING_URL, SITE_INFO } from "../../constants/config";
import { usePageEnterDelay } from "./PageTransition";

/* ------------------------------------------------------------------ */
/* Content: taken as-is from organikssalonandwellnessspa.com/thank-you */
/* ------------------------------------------------------------------ */
const MAPS_URL =
  "https://www.google.com/maps/place/Organiks+Salon+and+Wellness+Spa/@15.1375716,120.5612187,17z/data=!3m1!4b1!4m6!3m5!1s0x3396f3006a2d40f7:0x31a2b5974038f75f!8m2!3d15.1375716!4d120.5637936!16s%2Fg%2F11z9vbjflx?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D";
const ADDRESS =
  "2nd Floor and 3rd Floor Organiks Salon and Wellness Spa Friendship Highway Cutcut Angeles City, Pampanga";

// Searching the place by name (centered on its exact coordinates) makes Google drop the
// pin on Organiks and open its place card, instead of marking a bare coordinate.
const MAP_QUERY =
  "Organiks Salon and Wellness Spa, Friendship Highway, Cutcut, Angeles, Pampanga";
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  MAP_QUERY
)}&ll=15.1375716,120.5637936&z=17&hl=en&output=embed`;

/* ------------------------------------------------------------------ */
/* Opening hours: "open daily from 9:00 AM to 12:00 AM", Manila time   */
/* ------------------------------------------------------------------ */
const OPEN_MIN = 9 * 60; // 9:00 AM
const DAY_MIN = 24 * 60; // closes at 12:00 AM

function getStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour").value) % 24;
  const m = Number(parts.find((p) => p.type === "minute").value);
  const minutes = h * 60 + m;
  const isOpen = minutes >= OPEN_MIN;
  const untilChange = isOpen ? DAY_MIN - minutes : OPEN_MIN - minutes;
  return { minutes, isOpen, untilChange, pct: (minutes / DAY_MIN) * 100 };
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/* ------------------------------------------------------------------ */
/* Motion: one orchestrated moment on load                             */
/*   heading rises → the day is drawn (open window fills, a marker      */
/*   sweeps from midnight to "now") → the map opens like a curtain      */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1];
const OPEN_FILL_LEFT = (OPEN_MIN / DAY_MIN) * 100; // 37.5%

const textGroupVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.2, staggerChildren: 0.12 } },
};
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};
const headingVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const wordVariants = {
  hidden: { y: "105%" },
  visible: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};
const fillVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.4, delay: 0.3, ease: EASE } },
};
const tickVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, delay: 0.9 } },
};
const mapFrameVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};
const curtainVariants = {
  hidden: { clipPath: "inset(0% 0% 0% 100% round 16px)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0% round 16px)",
    transition: { duration: 1.2, delay: 0.25, ease: EASE },
  },
};
const settleVariants = {
  hidden: { scale: 1.12 },
  visible: { scale: 1, transition: { duration: 1.8, delay: 0.25, ease: EASE } },
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

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

// Live open / closed chip: answers the first question every visitor has
function StatusChip({ status }) {
  const { isOpen, untilChange } = status;
  return (
    <div
      role="status"
      className={`inline-flex items-center gap-2.5 rounded-full pl-3 pr-4 py-1.5 text-[12.5px] font-medium border ${
        isOpen
          ? "bg-[#566B3F]/10 border-[#566B3F]/25 text-[#3E4F2C]"
          : "bg-[#B8975A]/10 border-[#B8975A]/30 text-[#7A5F2E]"
      }`}
    >
      <span className="relative flex w-2 h-2">
        {isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#566B3F] opacity-60 animate-ping" />
        )}
        <span
          className={`relative w-2 h-2 rounded-full ${
            isOpen ? "bg-[#566B3F]" : "bg-[#B8975A]"
          }`}
        />
      </span>
      <span>
        {isOpen ? "Open now" : "Closed now"}
        <span className="font-normal opacity-80">
          {" · "}
          {isOpen
            ? `closes in ${formatDuration(untilChange)}`
            : `opens in ${formatDuration(untilChange)}`}
        </span>
      </span>
    </div>
  );
}

// A 24-hour bar: the open window fills in and a marker sweeps from midnight to now
function DayTimeline({ status, ready, introDone, reduceMotion }) {
  const ticks = [
    { label: "12AM", at: 0 },
    { label: "6AM", at: 25 },
    { label: "12PM", at: 50 },
    { label: "6PM", at: 75 },
    { label: "12AM", at: 100 },
  ];

  return (
    <div className="px-3 pt-6" aria-hidden="true">
      <div className="relative h-2 rounded-full bg-[#E8DDD2]">
        <motion.div
          variants={fillVariants}
          className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-r from-[#566B3F] to-[#7C9360] origin-left"
          style={{ left: `${OPEN_FILL_LEFT}%` }}
        />

        <motion.div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={reduceMotion ? false : { left: "0%", opacity: 0 }}
          animate={
            ready
              ? { left: `${status.pct}%`, opacity: 1 }
              : { left: "0%", opacity: 0 }
          }
          transition={{
            left: {
              duration: introDone ? 0.6 : 1.8,
              delay: introDone ? 0 : 0.5,
              ease: EASE,
            },
            opacity: { duration: 0.3, delay: introDone ? 0 : 0.5 },
          }}
        >
          <span className="absolute left-1/2 -translate-x-1/2 -top-7 text-[10px] font-semibold text-[#14291F] bg-white border border-[#E8DDD2] rounded px-1.5 py-0.5 shadow-sm whitespace-nowrap">
            Now
          </span>
          <span
            className={`block w-4 h-4 rounded-full bg-white border-[3px] shadow ${
              status.isOpen ? "border-[#566B3F]" : "border-[#B8975A]"
            }`}
          />
        </motion.div>
      </div>

      <motion.div variants={tickVariants} className="relative h-5 mt-2.5">
        {ticks.map((t, i) => (
          <span
            key={i}
            className={`absolute text-[10px] text-[#8A8A80] ${
              i === 0 ? "" : i === ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2"
            }`}
            style={{ left: `${t.at}%` }}
          >
            {t.label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function CopyAddress() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the address is still visible and selectable */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#E8DDD2] bg-white hover:bg-[#F4EEE3] text-[11.5px] font-medium text-[#14291F] px-3 py-1.5 transition-colors cursor-pointer"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {copied ? (
          <polyline points="20 6 9 17 4 12" />
        ) : (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </>
        )}
      </svg>
      <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
    </button>
  );
}

// The live map loads straight away with Organiks pinned. On touch screens a one-tap
// cover keeps the map from swallowing the swipe that is meant to scroll the page.
function MapCard() {
  const [loaded, setLoaded] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [touch] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(pointer: coarse)").matches
  );
  const locked = touch && !unlocked;

  return (
    <motion.div
      variants={mapFrameVariants}
      className="relative rounded-2xl bg-white shadow-md border border-[#E8DDD2]/60"
    >
      <motion.div
        variants={curtainVariants}
        className="overflow-hidden rounded-2xl"
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3.4] bg-[#E6D9C2]">
          <motion.div className="absolute inset-0" variants={settleVariants}>
            <iframe
              title="Organiks Salon and Wellness Spa on Google Maps"
              src={MAP_EMBED_URL}
              onLoad={() => setLoaded(true)}
              className={`w-full h-full border-0 transition-opacity duration-700 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ pointerEvents: locked ? "none" : "auto" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {locked && (
              <button
                type="button"
                onClick={() => setUnlocked(true)}
                aria-label="Tap to explore the map"
                className="absolute inset-0 w-full h-full p-0 border-0 bg-transparent cursor-pointer"
              >
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur px-3.5 py-2 text-[12px] font-semibold text-[#14291F] shadow-md">
                  Tap to explore the map
                </span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Address bar */}
        <div className="flex items-start gap-3 bg-white px-4 sm:px-5 py-4 border-t border-[#E8DDD2]/60">
          <HugeiconsIcon
            icon={Home09Icon}
            size={20}
            color="#566B3F"
            strokeWidth={2}
            className="shrink-0 mt-0.5"
          />
          <p className="flex-1 m-0 text-[12.5px] sm:text-[13px] text-[#333] leading-relaxed">
            {ADDRESS}
          </p>
          <CopyAddress />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ReplicaLocation() {
  const reduceMotion = useReducedMotion();
  const enterDelay = usePageEnterDelay(); // wait for the page curtain when arriving via nav

  // On screen at load, so this plays on mount (after the page curtain), not on scroll
  const [ready, setReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), (enterDelay || 0) * 1000);
    const t2 = setTimeout(() => setIntroDone(true), (enterDelay || 0) * 1000 + 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [enterDelay]);

  // Live status: refreshed every 30s so "closes in 12m" stays honest
  const [status, setStatus] = useState(() => getStatus());
  useEffect(() => {
    const id = setInterval(() => setStatus(getStatus()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="font-['Poppins',sans-serif] bg-[#FEFBF7] text-[#222] selection:bg-[#566B3F]/20 selection:text-[#14291F]">
      <section className="max-w-[1140px] mx-auto px-6 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center"
          initial={reduceMotion ? false : "hidden"}
          animate={ready ? "visible" : "hidden"}
        >
          {/* Left: the answers, in the order people ask them */}
          <motion.div variants={textGroupVariants} className="max-w-[460px]">
            <motion.h1
              variants={headingVariants}
              aria-label="Visit us today!"
              className="text-[clamp(34px,5vw,56px)] leading-[1.08] text-[#2C3820] font-medium tracking-tight m-0"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RevealWords text="Visit us today!" />
            </motion.h1>

            <motion.div variants={fadeVariants} className="mt-6">
              <StatusChip status={status} />
            </motion.div>

            <motion.div variants={fadeVariants} className="mt-8">
              <p className="m-0 text-[13px] text-[#555]">We are open daily from:</p>
              <p
                className="mt-1 mb-0 text-[22px] sm:text-[26px] text-[#14291F] font-medium tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                9:00 AM TO 12:00 AM
              </p>
            </motion.div>

            <DayTimeline
              status={status}
              ready={ready}
              introDone={introDone}
              reduceMotion={reduceMotion}
            />

            <motion.div
              variants={fadeVariants}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#14291F] hover:bg-[#1E3D2D] text-[#F4EEE3] py-3 px-6 rounded-xl text-[14px] font-medium transition-colors no-underline shadow-sm"
              >
                Open in Google Maps
                <HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2.5} />
              </a>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#F4EEE3] text-[#14291F] border border-[#14291F]/25 py-3 px-6 rounded-xl text-[14px] font-medium transition-colors no-underline"
              >
                <HugeiconsIcon
                  icon={CalendarAdd02Icon}
                  size={18}
                  strokeWidth={2}
                />
                Book Your Appointment
              </a>
            </motion.div>

            <motion.p variants={fadeVariants} className="mt-5 mb-0 text-[12.5px]">
              <a
                href={`tel:${SITE_INFO.phone}`}
                className="inline-flex items-center gap-2 text-[#222] hover:text-[#566B3F] transition-colors no-underline"
              >
                <HugeiconsIcon icon={PhoneIcon} size={16} strokeWidth={2} />
                0969 248 7007
              </a>
            </motion.p>
          </motion.div>

          {/* Right: the map */}
          <MapCard />
        </motion.div>
      </section>
    </div>
  );
}