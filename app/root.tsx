import {
  useRouteError,
  Link,
  useLocation,
  Outlet,
} from "react-router-dom";
import { Helmet } from 'react-helmet';

import stylesheet from "./app.css?url";

interface ErrorBoundaryProps {
  error: any;
}

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Helmet>
          {links().map((link, index) => (
          <link key={index} {...link} />
          ))}
        </Helmet>
      </head>
      <body>
        {children}


      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  const routeError = useRouteError();
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (routeError && typeof routeError === 'object' && 'status' in routeError) {
    message = (routeError as any).status === 404 ? "404" : "Error";
    details =
      (routeError as any).status === 404
        ? "The requested page could not be found."
        : ((routeError as any).statusText as string) || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
