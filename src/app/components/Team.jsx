import { developers } from "../data/team";

export default function Team() {
  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold">Meet the Developers</h2>
      <p className="mt-1 text-white/70 text-sm">A Data Science group project by passionate builders.</p>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {developers.map((dev) => (
          <li key={dev.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="font-semibold leading-tight">{dev.name}</p>
            {dev.links?.length ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/70">
                {dev.links.map((l, i) => (
                  <a key={i} href={l.href} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10 hover:text-white">
                    {l.label}
                  </a>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}


