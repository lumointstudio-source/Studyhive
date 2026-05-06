export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="font-heading font-semibold text-slate-300 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-4">{message}</p>
      {action}
    </div>
  )
}
