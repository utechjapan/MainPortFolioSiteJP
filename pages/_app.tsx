// pages/_app.tsx
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Head from "next/head";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use this to prevent theme flash on load
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Head>
        {/* Add viewport and other meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
      </Head>

      {!mounted ? (
        // Display a minimal UI while client-side JS loads
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg" />
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}
