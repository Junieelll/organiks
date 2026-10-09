import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { BOOKING_URL } from "../../constants/config";

// Slow-out curve: fast start, long soft landing. Feels like a treatment
// room door opening rather than a UI element popping in.
const EASE = [0.22, 1, 0.36, 1];

const HEADLINE = [
  { text: "Your" },
  { text: "glow" },
  { text: "starts" },
  { text: "with" },
  { text: "one", em: true },
  { text: "message." },
];

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* One orchestrated moment: the card opens, the photo settles, then    */
/* the headline lifts into place. Everything else just fades in.       */
/* ------------------------------------------------------------------ */

// The card "opens" from a smaller window to its full size.
const cardVariants = {
  hidden: {
    clipPath: "inset(7% 5% 7% 5% round 28px)",
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0% 0% 0% 0% round 16px)",
    opacity: 1,
    transition: {
      clipPath: { duration: 1.15, ease: EASE },
      opacity: { duration: 0.5, ease: "easeOut" },
    },
  },
};

// Photo starts slightly zoomed and settles back as the card opens.
const photoVariants = {
  hidden: { scale: 1.12 },
  visible: { scale: 1, transition: { duration: 1.8, ease: EASE } },
};

// Gradient wipes in from the left so the text side "clears" last.
const veilVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, delay: 0.3 } },
};

const textGroupVariants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.55, staggerChildren: 0.14 },
  },
};

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const headlineVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// Each word rises out of an invisible mask (see the overflow-hidden wrapper).
const wordVariants = {
  hidden: { y: "105%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

export default function ReplicaBanner() {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);

  // Scroll-linked parallax: the photo drifts slower than the page, so it
  // feels like it sits behind the card instead of printed on it.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-7%", "7%"]
  );

  return (
    <section className="py-8 sm:py-10 bg-[#FEFBF7]">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        <motion.div
          ref={cardRef}
          className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E8DDD2]/60 bg-[#FAF3E8] flex flex-col md:flex-row md:items-center min-h-0 md:min-h-[380px]"
          variants={cardVariants}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Mobile: Dedicated Image zoomed tightly and focused on the client and consultant */}
          <div className="md:hidden relative w-full h-[240px] sm:h-[280px] overflow-hidden">
            <motion.div className="w-full h-full" style={{ y: photoY }}>
              <motion.div className="w-full h-full" variants={photoVariants}>
                <img
                  src="/images/replica/banner.png"
                  alt="Organiks Spa Experience"
                  className="w-full h-full object-cover object-[94%_32%] scale-[1.45] origin-[92%_32%]"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Desktop: Full-bleed background image, oversized vertically so the parallax never exposes an edge */}
          <motion.div
            className="hidden md:block absolute inset-x-0 -top-[8%] -bottom-[8%]"
            style={{ y: photoY }}
            aria-hidden="true"
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-[position:center_right] lg:bg-center"
              style={{ backgroundImage: `url('/images/replica/banner.png')` }}
              variants={photoVariants}
            />
          </motion.div>
          <motion.div
            className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#FAF3E8] via-[#FAF3E8]/85 via-40% to-transparent pointer-events-none"
            variants={veilVariants}
          />

          {/* Text Content */}
          <motion.div
            className="relative z-10 p-6 sm:p-8 md:p-12 max-w-[460px] text-left"
            variants={textGroupVariants}
          >
            <motion.div className="mb-4 sm:mb-6" variants={fadeVariants}>
              <img
                src="/images/logo.webp"
                alt="Organiks"
                className="h-14 sm:h-18 w-auto object-contain"
              />
            </motion.div>

            <motion.h2
              className="text-[25px] sm:text-[30px] md:text-[clamp(28px,3.5vw,40px)] text-[#2C3820] leading-[1.18] font-medium m-0 tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
              variants={headlineVariants}
              aria-label="Your glow starts with one message."
            >
              {HEADLINE.map(({ text, em }, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  // Mask: words are clipped until they rise into place.
                  // Padding/negative margin keeps descenders and italics from being cut.
                  className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.26em] last:mr-0"
                >
                  <motion.span className="inline-block" variants={wordVariants}>
                    {em ? (
                      <em className="italic font-normal">{text}</em>
                    ) : (
                      text
                    )}
                  </motion.span>
                </span>
              ))}
            </motion.h2>

            <motion.p
              className="text-[13px] sm:text-[13.5px] text-[#4A4E44] my-3.5 sm:my-5 leading-relaxed font-light"
              variants={fadeVariants}
            >
              Tell us your beauty or wellness goal and our team will recommend
              the best Organiks ritual for you.
            </motion.p>

            {/* Wrapper handles the entrance so the button's own hover/tap springs stay untouched */}
            <motion.div variants={fadeVariants} className="inline-block">
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
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}