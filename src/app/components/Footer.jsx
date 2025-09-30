export default function Footer() {
  return (
    <footer className="mt-24 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-6 text-sm text-white/60">
      <span>© {new Date().getFullYear()} Hindi Spoken Query System</span>
      <div className="flex items-center gap-4">
        <a className="hover:text-white" href="#privacy">Privacy</a>
        <a className="hover:text-white" href="#accessibility">Accessibility</a>
      </div>
    </footer>
  );
}


