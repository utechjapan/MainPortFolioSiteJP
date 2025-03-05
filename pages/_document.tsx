// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
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
        />

        {/* Script for applying theme early to avoid theme flashing */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check for saved theme in localStorage
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add(theme);
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
