export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-border/40 bg-slate-950 p-1 animate-pulse">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Resunio Logo" className="w-full h-full object-cover rounded-xl" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading Resunio...</p>
      </div>
    </div>
  )
}
