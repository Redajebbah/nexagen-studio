import "./globals.css";

export const metadata = {
  title: "Nexagen Studio — AI-Powered Digital Agency",
  description:
    "We design systems that think. Premium digital studio specializing in AI-powered web development, automation, and intelligent digital solutions.",
  openGraph: {
    title: "Nexagen Studio — AI-Powered Digital Agency",
    description: "We design systems that think.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash: apply saved theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('nexagen-theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){}})();` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
