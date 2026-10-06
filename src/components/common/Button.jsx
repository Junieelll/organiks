import { BOOKING_URL } from '../../constants/config'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  onClick,
  isBooking = false,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 rounded-full cursor-pointer select-none text-center'

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-sm px-6 py-3 gap-2',
    lg: 'text-base px-8 py-3.5 gap-2.5',
  }[size] || 'text-sm px-6 py-3 gap-2'

  const variantStyles = {
    primary:
      'bg-[#8B5E3C] text-white hover:bg-[#724b2f] hover:shadow-lg hover:shadow-[#8B5E3C]/25 active:scale-[0.98]',
    secondary:
      'bg-[#C9A98A] text-[#2C2723] hover:bg-[#bfa07e] hover:shadow-md active:scale-[0.98]',
    outline:
      'border border-[#8B5E3C] text-[#8B5E3C] bg-transparent hover:bg-[#8B5E3C] hover:text-white active:scale-[0.98]',
    outlineLight:
      'border border-white/60 text-white bg-transparent hover:bg-white hover:text-[#2C2723] active:scale-[0.98]',
    white:
      'bg-white text-[#2C2723] hover:bg-[#F8F5F1] hover:shadow-lg hover:shadow-black/10 active:scale-[0.98]',
    ghost:
      'text-[#8B5E3C] hover:text-[#724b2f] hover:bg-[#8B5E3C]/10 p-0',
  }[variant] || 'bg-[#8B5E3C] text-white'

  const targetUrl = isBooking ? BOOKING_URL : href

  if (targetUrl) {
    return (
      <a
        href={targetUrl}
        target={targetUrl.startsWith('http') ? '_blank' : undefined}
        rel={targetUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        style={{ fontFamily: 'var(--font-body)' }}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      style={{ fontFamily: 'var(--font-body)' }}
      {...props}
    >
      {children}
    </button>
  )
}
