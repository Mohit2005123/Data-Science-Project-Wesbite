export default function FeatureCard({ title, desc, icon }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.06]">
      <div className="text-2xl">{icon}</div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-white/70 text-sm">{desc}</p>
    </div>
  );
}

