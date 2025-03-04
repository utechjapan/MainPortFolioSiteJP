import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent theme flash on load
    return <div style={{ visibility: 'hidden' }} />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}