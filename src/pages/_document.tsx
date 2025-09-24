import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          {/* Meta Tags Básicos */}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          
          {/* Meta Tags SEO */}
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta name="author" content="Ariel Atariki Lobos Haoa" />
          <meta name="keywords" content="desarrollador full stack, React, Node.js, TypeScript, Python, portfolio, desarrollador web, Chile" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Ariel Atariki Lobos Haoa" />
          <meta property="og:locale" content="es_ES" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content="@atariki_haoa" />
          
          {/* Preconnect para optimización */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Fuentes optimizadas */}
          <link
            href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          
          {/* DNS Prefetch para recursos externos */}
          <link rel="dns-prefetch" href="//github.com" />
          <link rel="dns-prefetch" href="//linkedin.com" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
