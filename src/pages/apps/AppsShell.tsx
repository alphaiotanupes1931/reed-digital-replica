import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

export default function AppsShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-apps">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <header className="border-b border-foreground/10 px-6 md:px-10 py-5 flex items-center justify-between">
        <Link to="/apps/dashboard" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">RDG Apps</span>
      </header>
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}