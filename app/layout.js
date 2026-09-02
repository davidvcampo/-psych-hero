import { Source_Serif_4, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-source-serif",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-public-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

export const metadata = {
  title: "Psych Hero | PSYMS Digital Resource Library",
  description:
    "A subject-catalogued library of notes, reviewers, and modules for MSU-GSC Psychology majors, built by students, for students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${publicSans.variable} ${plexMono.variable}`}>
      <body className="flex min-h-screen flex-col font-body text-charcoal">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
