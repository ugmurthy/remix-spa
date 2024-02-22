import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

// TailwindCSS - vite overrides remix's approach to css (brcoktho 02/05/24 on Discord)
/*import tailwindCSS from './css/index.css';
import { LinksFunction } from "@remix-run/node";
export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindCSS }];
*/
// instead do a side effect import.
import './css/index.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
