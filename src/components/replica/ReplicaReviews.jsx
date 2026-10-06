import { useState, useRef, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuoteDownIcon } from "@hugeicons/core-free-icons";

const EASE = [0.22, 1, 0.36, 1];

const CARD_GAP = 20;
const CLONE = 2; // clones on each side for the infinite loop
const SETTLE = 420; // ms: spring settle time before silently jumping off a clone
const INTRO_MS = 1800; // after this, intro delays are dropped so slide changes stay snappy

const REVIEWS = [
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

const REAL_N = REVIEWS.length;

// Header: one masked rise on the heading, eyebrow just fades.
const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const eyebrowVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};
const headingVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const wordVariants = {
  hidden: { y: "105%" },
  visible: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};

// Defined at module level so it isn't re-created (and its error state reset) on every render.
function ReviewAvatar({ review, size = "md" }) {
  const [imgFailed, setImgFailed] = useState(false);
  const dim = size === "sm" ? "w-9 h-9 text-sm" : "w-10 h-10 text-sm";
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
    <span
      className={`${dim} rounded-full bg-[#D9CDB6] flex items-center justify-center font-serif font-bold text-[#5C4B2A] shrink-0`}
    >
      {review.initial}
    </span>
  );
}

export default function ReplicaReviews() {
  const reduceMotion = useReducedMotion();
  const carouselRef = useRef(null);
  const swipeStartX = useRef(null);

  const [cardWidth, setCardWidth] = useState(380);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [idx, setIdx] = useState(CLONE); // extended index; real cards start at CLONE
  const [snap, setSnap] = useState(false); // true = instant jump, no spring
  const [introDone, setIntroDone] = useState(false);

  const activeReview = (((idx - CLONE) % REAL_N) + REAL_N) % REAL_N;

  // The reveal fires once, when the carousel is mostly on screen.
  const inView = useInView(carouselRef, { once: true, amount: 0.35 });
  const revealed = reduceMotion || inView;

  // Measure card width responsively
  useEffect(() => {
    const measure = () => {
      if (carouselRef.current) {
        const w = carouselRef.current.offsetWidth;
        setContainerWidth(w);
        if (w < 640) {
          // On mobile, card takes ~82% of width so text is comfortable and side cards peek gently
          setCardWidth(Math.min(Math.floor(w * 0.82), 360));
        } else {
          setCardWidth(Math.min(Math.floor(w * 0.55), 420));
        }
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // After the intro, drop the stagger delays so later slide changes are immediate
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setIntroDone(true), reduceMotion ? 0 : INTRO_MS);
    return () => clearTimeout(t);
  }, [revealed, reduceMotion]);

  // Infinite loop: after the spring settles on a clone, silently snap to the real card
  useEffect(() => {
    if (snap) {
      const t = setTimeout(() => setSnap(false), 40);
      return () => clearTimeout(t);
    }
    if (idx < CLONE) {
      const t = setTimeout(() => {
        setSnap(true);
        setIdx(CLONE + REAL_N + (idx - CLONE)); // leading clone → real end
      }, SETTLE);
      return () => clearTimeout(t);
    }
    if (idx >= CLONE + REAL_N) {
      const t = setTimeout(() => {
        setSnap(true);
        setIdx(CLONE + (idx - CLONE - REAL_N)); // trailing clone → real start
      }, SETTLE);
      return () => clearTimeout(t);
    }
  }, [idx, snap]);

  // Autoplay every 4.5s when idle. Doesn't start until the section has been seen.
  useEffect(() => {
    if (isPaused || !inView) return;
    const timer = setInterval(() => setIdx((p) => p + 1), 4500);
    return () => clearInterval(timer);
  }, [isPaused, inView, idx]);

  // Shift the strip so card[idx] is centered
  const trackX =
    containerWidth === 0
      ? 0
      : containerWidth / 2 - cardWidth / 2 - idx * (cardWidth + CARD_GAP);

  const prevReview = () => setIdx((p) => p - 1);
  const nextReview = () => setIdx((p) => p + 1);
  const goToReview = (i) => setIdx(CLONE + i);

  const maskGradient =
    containerWidth < 640
      ? "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)"
      : "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)";

  return (
    <section className="py-14 sm:py-20 bg-[#FEFBF7]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 px-4"
          variants={headerVariants}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
        >
          <motion.p
            className="text-xs tracking-[3px] uppercase text-[#566B3F] font-semibold mb-2"
            variants={eyebrowVariants}
          >
            What Clients Say
          </motion.p>
          <motion.h2
            className="text-2xl sm:text-3xl font-light text-[#14291F]"
            style={{ fontFamily: "var(--font-heading)" }}
            variants={headingVariants}
            aria-label="Real Experiences"
          >
            {["Real", "Experiences"].map((word) => (
              <span
                key={word}
                aria-hidden="true"
                className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.26em] last:mr-0"
              >
                <motion.span className="inline-block" variants={wordVariants}>
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h2>
        </motion.div>

        {/* Sliding track container */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden py-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          style={{ maskImage: maskGradient, WebkitMaskImage: maskGradient }}
          onPointerDown={(e) => {
            setIsPaused(true);
            swipeStartX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            setIsPaused(false);
            if (swipeStartX.current !== null) {
              const diff = e.clientX - swipeStartX.current;
              if (diff < -50) nextReview();
              else if (diff > 50) prevReview();
              swipeStartX.current = null;
            }
          }}
        >
          {/* The single sliding strip: clones + real cards */}
          <motion.div
            className="flex"
            animate={{ x: trackX }}
            transition={
              snap
                ? { duration: 0 }
                : { type: "spring", stiffness: 320, damping: 35, mass: 0.8 }
            }
            style={{ gap: CARD_GAP }}
          >
            {[
              ...REVIEWS.slice(-CLONE),
              ...REVIEWS,
              ...REVIEWS.slice(0, CLONE),
            ].map((review, i) => {
              const isActive = i === idx;
              const distance = Math.abs(i - idx);

              // Intro: before the reveal, every card is stacked behind the active one
              // (88% of the way to the center). On reveal they fan out to their slots,
              // starting from the middle and moving outward.
              const stackX = -(i - idx) * (cardWidth + CARD_GAP) * 0.88;
              const introDelay = introDone ? 0 : 0.2 + distance * 0.07;

              return (
                <motion.article
                  key={i}
                  onClick={() => {
                    if (!isActive)
                      goToReview((((i - CLONE) % REAL_N) + REAL_N) % REAL_N);
                  }}
                  initial={false}
                  animate={{
                    x: revealed ? 0 : stackX,
                    opacity: !revealed ? 0 : isActive ? 1 : 0.45,
                    scale: !revealed ? 0.9 : isActive ? 1 : 0.93,
                  }}
                  whileHover={
                    isActive ? { y: -5 } : { opacity: 0.65, scale: 0.94 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    x: {
                      type: "spring",
                      stiffness: 80,
                      damping: 19,
                      delay: introDelay,
                    },
                    opacity: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: introDelay > 0 ? 0.1 : 0,
                    },
                  }}
                  className="shrink-0 bg-white rounded-2xl p-5 sm:p-8 border border-[#E8DDD2]/60 cursor-pointer select-none"
                  style={{
                    width: cardWidth,
                    zIndex: 10 - distance,
                    boxShadow: isActive
                      ? "0 8px 40px rgba(44,39,35,0.13)"
                      : "0 2px 12px rgba(44,39,35,0.06)",
                  }}
                >
                  <HugeiconsIcon
                    icon={QuoteDownIcon}
                    size={24}
                    color="#B8975A"
                    strokeWidth={1.5}
                    className="mb-2 sm:mb-3 opacity-50"
                  />
                  <div
                    className="text-[#F5B50A] tracking-[3px] text-xs mb-2.5 sm:mb-3"
                    aria-label="5 stars"
                  >
                    ★★★★★
                  </div>
                  <p
                    className="text-[#333] leading-relaxed font-light mb-5 sm:mb-6"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: isActive
                        ? containerWidth < 640
                          ? "0.975rem"
                          : "1.0625rem"
                        : containerWidth < 640
                        ? "0.85rem"
                        : "0.9rem",
                    }}
                  >
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-[#E8DDD2]/50 pt-3.5 sm:pt-4">
                    <ReviewAvatar review={review} size={isActive ? "md" : "sm"} />
                    <div>
                      <p className="text-sm font-semibold text-[#222]">
                        {review.author}
                      </p>
                      <p className="text-xs text-[#999]">Verified Client</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>

        {/* Navigation row: appears once the cards have fanned out */}
        <motion.div
          className="flex items-center justify-center gap-4 mt-6 px-4"
          initial={false}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: reduceMotion ? 0 : 1.0,
          }}
        >
          <motion.button
            onClick={prevReview}
            aria-label="Previous review"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-9 h-9 rounded-full bg-white border border-[#E8DDD2] flex items-center justify-center text-[#566B3F] hover:bg-[#566B3F] hover:text-white hover:border-[#566B3F] transition-all shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </motion.button>

          <div className="flex items-center gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => goToReview(i)}
                aria-label={`Review ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeReview ? "22px" : "8px",
                  height: "8px",
                  background: i === activeReview ? "#566B3F" : "#D9CDB6",
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}