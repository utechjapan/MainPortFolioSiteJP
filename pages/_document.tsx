// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVpOaEUAB+CXzKavmELwJ8C41/HjxQyoQjqELDMNk/LrRJmFZfhIljMCjUPj8DPU5/22NBbvQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Preload fonts to reduce layout shift */}
        <link
          rel="preload"
          as="font"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          crossOrigin=""
        />

        {/* Meta tags for SEO and social media */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="author" content="Chikara Inohara" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UTechLab" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@_utechlab" />
        <link rel="icon" href="/favicon.ico" />

        {/* Script for applying theme early to avoid theme flashing */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Check for saved theme in localStorage
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  // Fallback to dark theme if localStorage is not available
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </Head>
      <body className="bg-light-bg dark:bg-dark-bg text-gray-900 dark:text-gray-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
