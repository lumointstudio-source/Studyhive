import Card from './Card'

export default function StatCard({ icon, label, value, sub, color = '#00E5FF', className = '' }) {
  return (
    <Card className={`animate-slide-up ${className}`}>
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${color}18` }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-heading font-bold mt-0.5" style={{ color }}>
            {value}
          </p>
          {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
        </div>
      </div>
    </Card>
  )
}
