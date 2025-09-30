export default function HowItWorks() {
  return (
    <section className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 sm:p-10">
      <h2 className="text-xl font-semibold">How it works</h2>
      <ol className="mt-4 grid gap-3 text-white/80 sm:grid-cols-3">
        <li className="rounded-xl border border-white/10 bg-white/5 p-4">Press speak and ask your question in Hindi</li>
        <li className="rounded-xl border border-white/10 bg-white/5 p-4">Our model understands and finds the right answer</li>
        <li className="rounded-xl border border-white/10 bg-white/5 p-4">Hear it back instantly, clearly, and safely</li>
      </ol>
    </section>
  );
}


