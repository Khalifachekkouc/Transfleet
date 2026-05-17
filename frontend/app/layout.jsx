import "./globals.css";

export const metadata = {
  title: "TransFleet — Gestion de Flotte",
  description: "Plateforme de gestion de flotte automobile moderne",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200..900;1,200..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-[#050505]">
        {children}
      </body>
    </html>
  );
}
