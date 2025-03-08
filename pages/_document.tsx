// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // Use the NEXT_PUBLIC_SITE_LANG environment variable; default to Japanese ("ja")
  const lang = process.env.NEXT_PUBLIC_SITE_LANG || "ja";
  return (
    <Html lang={lang}>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
