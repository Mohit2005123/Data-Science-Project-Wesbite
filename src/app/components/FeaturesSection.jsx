import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  return (
    <section id="learn-more" className="mt-0 grid grid-cols-1 gap-6 sm:grid-cols-3">
      <FeatureCard title="Private & Safe" desc="On-device processing options and anonymized telemetry keep you in control." icon="🔒" />
      <FeatureCard title="Hindi First" desc="Optimized for Hindi speech, accents, and dialects for better accuracy." icon="🎙️" />
      <FeatureCard title="For Women" desc="Designed with accessibility, clarity, and trust at its core." icon="💜" />
    </section>
  );
}


