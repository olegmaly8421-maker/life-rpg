export function XPBar({ current, total, color = '#7C5CFC', height = 4 }) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0
  return (
    <div style={{ background: '#1E1E2E', borderRadius: 99, height, overflow: 'hidden', width: '100%' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
    </div>
  )
}

export function Card({ children, style, ...props }) {
  return (
    <div style={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: 12, padding: 16, ...style }} {...props}>
      {children}
    </div>
  )
}

export function Btn({ children, variant = 'primary', style, ...props }) {
  const variants = {
    primary: { background: 'linear-gradient(135deg, #7C5CFC, #4F46E5)', color: '#fff', border: 'none' },
    ghost:   { background: '#1E1E2E', color: '#9CA3AF', border: 'none' },
    danger:  { background: '#2E1A1A', color: '#EF4444', border: '1px solid #EF444433' },
    outline: { background: 'none', color: '#9CA3AF', border: '1px solid #1E1E2E' },
  }
  return (
    <button style={{ borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s', ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  )
}

export function Input({ style, ...props }) {
  return (
    <input style={{ background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: 13, outline: 'none', width: '100%', ...style }} {...props} />
  )
}

export function Label({ children }) {
  return <div style={{ color: '#6B7280', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{children}</div>
}
