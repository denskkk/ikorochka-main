export default function VideoHero() {
  return (
    <div className="absolute inset-0 -z-10">
      <video
        className="w-full h-full object-cover object-center opacity-80"
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        poster="https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=60"
      >
        <source src="/videos/hero-caviar-loop.mp4" type="video/mp4" />
      </video>
  <div className="absolute inset-0 bg-gradient-to-b from-[#140607]/90 via-[#1a0a0c]/85 to-[#0c0d10]/95 mix-blend-normal" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_42%,rgba(229,61,24,0.55),rgba(229,61,24,0.15)_55%,transparent_75%)]" />
  <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_35%,rgba(255,255,255,0)_65%,rgba(255,255,255,0.06)_100%)] pointer-events-none" />
    </div>
  )
}
