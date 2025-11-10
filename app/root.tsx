import { useEffect } from 'react';
import type { LinksFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import Footer from '~/components/layout/footer';
import Header from '~/components/layout/header';
import { Toaster } from '~/components/ui/toaster';
import { AuthProvider } from '~/contexts/AuthContext';

import './app.css';

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/assets/app-icon.png', type: 'image/png' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
  },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Clean up any browser extension attributes that cause hydration mismatches
    const cleanupExtensionAttributes = () => {
      const { body } = document;
      // Remove common browser extension attributes
      const extensionAttributes = [
        'cz-shortcut-listen', // ColorZilla
        'data-new-gr-c-s-check-loaded', // Grammarly
        'data-gr-ext-installed', // Grammarly
        'spellcheck', // Various extensions
      ];

      extensionAttributes.forEach(attr => {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr);
        }
      });
    };

    // Clean up immediately after hydration
    cleanupExtensionAttributes();

    // Also clean up periodically in case extensions add attributes later
    const interval = setInterval(cleanupExtensionAttributes, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default function Root() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <main className='flex-1 pt-16'>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
