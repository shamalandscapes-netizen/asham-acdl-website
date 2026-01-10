import { Montserrat } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";

// Components
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer"; 
import ClientWrapper from "@/components/layout/ClientWrapper";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-montserrat',
});

// ✅ SEO Metadata (Only possible in Server Components)
export const metadata: Metadata = {
  title: "Asham ACDL | Architectural Design & Updates",
  description: "Modern architectural plans and insights into premium residential design in Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${montserrat.variable} ${montserrat.className} bg-[#FDFDFD] text-[#06392F] antialiased selection:bg-[#06392F] selection:text-white`}>
        
        <div className="relative flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow">
            {children}
          </main>

          <Footer />

          {/* ✅ Handles all client-side UI layers, state, and global events */}
          <ClientWrapper />
        </div>
      </body>
    </html>
  );
}