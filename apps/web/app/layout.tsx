import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoJobOps Dashboard",
  description: "Monitor remote job listings"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="mx-auto min-h-screen max-w-5xl px-6 py-10">
          <header className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight">AutoJobOps</h1>
            <p className="text-slate-600">Remote job intelligence at a glance.</p>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
