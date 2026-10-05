export default function FloatingProgressButton({ onClick }) {
  return (
    <>
      <style>{`
        @keyframes organiks-pulse {
          0%   { transform: scale(1);   opacity: 0.75; }
          80%  { transform: scale(2.5); opacity: 0; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      <button
        id="floating-progress-btn"
        onClick={onClick}
        aria-label="View development progress"
        title="View development progress"
        className="fixed bottom-7 right-7 z-[9000] flex items-center gap-2.5 px-5 py-3 rounded-full text-white text-[0.8rem] font-semibold tracking-wide border-0 cursor-pointer select-none transition-all duration-200 hover:-translate-y-1 hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #8B5E3C 0%, #C9A98A 100%)',
          boxShadow: '0 6px 24px rgba(139,94,60,0.4)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {/* Animated pulse dot */}
        <span className="relative w-2.5 h-2.5 shrink-0">
          <span
            className="absolute inset-0 rounded-full bg-white"
            style={{ animation: 'organiks-pulse 1.8s ease-out infinite' }}
          />
          <span className="relative block w-2.5 h-2.5 rounded-full bg-white" />
        </span>
        View Progress
      </button>
    </>
  )
}
