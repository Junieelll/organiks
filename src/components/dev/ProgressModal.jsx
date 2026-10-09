import { useEffect } from "react";
import { motion } from "framer-motion";
import { phases } from "./progressData";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 32,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 26,
      stiffness: 300,
      mass: 0.85,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.93,
    y: 20,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0],
    },
  },
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.18,
    },
  },
};

const phaseItemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 22,
      stiffness: 320,
    },
  },
};

export default function ProgressModal({ onClose }) {
  // Calculate progress from individual tasks
  const totalItems = phases.reduce(
    (total, phase) => total + phase.items.length,
    0
  );

  const completedItems = phases.reduce(
    (total, phase) =>
      total + phase.items.filter((item) => item.done).length,
    0
  );

  const percent = Math.round((completedItems / totalItems) * 100);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      id="progress-modal-overlay"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[9999] flex items-end justify-end p-4 sm:p-6 bg-[rgba(44,39,35,0.55)] backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <motion.div
        id="progress-modal-panel"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden origin-bottom-right"
        style={{
          maxHeight: "min(680px, calc(100vh - 3rem))",
          fontFamily: "var(--font-body)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-brand-primary shrink-0">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.3 }}
              className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-brand-accent m-0"
            >
              Website Development
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16, duration: 0.3 }}
              className="text-white text-[1.4rem] font-medium leading-tight mt-0.5 m-0"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Organiks Progress
            </motion.h3>
          </div>

          <motion.button
            id="progress-modal-close"
            onClick={onClose}
            aria-label="Close progress panel"
            whileHover={{ rotate: 90, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-brand-accent text-lg bg-white/15 hover:bg-white/25 transition-colors cursor-pointer border-0"
          >
            ✕
          </motion.button>
        </div>

        {/* Progress */}
        <div className="px-5 py-4 border-b border-brand-accent shrink-0">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[0.72rem] font-semibold text-brand-muted">
              Overall Progress
            </span>

            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 350 }}
              className="text-[0.82rem] font-bold text-brand-primary"
            >
              {percent}%
            </motion.span>
          </div>

          <div className="h-[7px] rounded-full bg-brand-accent overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{
                duration: 0.95,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                background:
                  "linear-gradient(90deg, #8B5E3C, #C9A98A)",
              }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-[0.68rem] font-semibold text-brand-secondary mt-1"
          >
            {completedItems} of {totalItems} tasks complete
          </motion.p>
        </div>

        {/* Phases */}
        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 min-h-0 flex flex-col gap-3 p-4 overflow-y-auto"
        >
          {phases.map((phase, i) => {
            const phaseCompleted = phase.items.every(
              (item) => item.done
            );

            const phaseCompletedCount = phase.items.filter(
              (item) => item.done
            ).length;

            const phaseInProgress =
              phaseCompletedCount > 0 && !phaseCompleted;

            return (
              <motion.div
                key={i}
                variants={phaseItemVariants}
                whileHover={{
                  y: -2,
                  transition: { duration: 0.15 },
                }}
                className={`rounded-xl border transition-shadow hover:shadow-sm ${
                  phaseCompleted
                    ? "border-brand-secondary bg-[#FDF9F6]"
                    : phaseInProgress
                    ? "border-[#B8975A] bg-[#FFFDF8]"
                    : "border-brand-accent bg-[#FAFAF9]"
                }`}
              >
                {/* Phase header */}
                <div className="flex items-center gap-3 px-3.5 py-3">
                  <motion.span
                    initial={
                      phaseCompleted
                        ? { scale: 0.6, rotate: -20 }
                        : { scale: 0.8 }
                    }
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.25 + i * 0.07,
                      type: "spring",
                      stiffness: 420,
                      damping: 20,
                    }}
                    className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.58rem] font-bold shrink-0 ${
                      phaseCompleted
                        ? "bg-brand-primary text-white"
                        : phaseInProgress
                        ? "bg-[#B8975A] text-white"
                        : "bg-brand-accent text-brand-muted"
                    }`}
                  >
                    {phaseCompleted ? "✓" : i + 1}
                  </motion.span>

                  <span
                    className={`text-[0.8rem] font-semibold flex-1 ${
                      phaseCompleted
                        ? "text-brand-primary"
                        : "text-brand-dark"
                    }`}
                  >
                    {phase.label}
                  </span>

                  {phaseCompleted ? (
                    <span className="text-[0.6rem] font-bold bg-[#566B3F] text-white rounded-full px-2.5 py-0.5 tracking-wide shrink-0">
                      Done
                    </span>
                  ) : phaseInProgress ? (
                    <span className="text-[0.6rem] font-semibold bg-[#B8975A]/20 text-[#8B6E32] rounded-full px-2.5 py-0.5 tracking-wide shrink-0">
                      In Progress
                    </span>
                  ) : (
                    <span className="text-[0.6rem] font-medium text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5 tracking-wide shrink-0">
                      Upcoming
                    </span>
                  )}
                </div>

                {/* Items */}
                <ul className="flex flex-col gap-1.5 px-3.5 pb-3 pl-[3.25rem] list-none m-0">
                  {phase.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2"
                    >
                      <span
                        className={`w-[14px] h-[14px] rounded-full shrink-0 flex items-center justify-center text-[8px] ${
                          item.done
                            ? "bg-[#566B3F] text-white"
                            : "bg-brand-accent text-transparent"
                        }`}
                      >
                        {item.done ? "✓" : ""}
                      </span>

                      <span
                        className={`text-[0.72rem] leading-snug ${
                          item.done
                            ? "text-brand-primary"
                            : "text-brand-muted"
                        }`}
                      >
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}