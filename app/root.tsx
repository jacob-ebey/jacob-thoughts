import { json, Links, LiveReload, Meta, Outlet, useLoaderData } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";

import { isLoggedIn } from "~/session.server";
import { getSeoLinks, getSeoMeta } from "~/seo";
import { Turbolinks } from "~/remix-turbo-links";
import globalStylesHref from "~/styles/global.css";

export const meta: MetaFunction = () => {
  return getSeoMeta();
};

export let links = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/@picocss/pico@1.4.4/css/pico.min.css",
  },
  {
    rel: "stylesheet",
    href: globalStylesHref,
  },
  ...getSeoLinks(),
];

type LoaderData = {
  loggedIn: boolean;
};

export let loader: LoaderFunction = async ({ request }) => {
  let loggedIn = await isLoggedIn(request, false);

  return json<LoaderData>({ loggedIn });
};

export default function App() {
  let { loggedIn } = useLoaderData<LoaderData>();

  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="container">
          <ul>
            <li>
              <a href="/" className="contrast">
                <strong>Jacob Ebey</strong>
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a data-prefetch="intent" href="/" className="contrast">
                Posts
              </a>
            </li>
            <li>
              <a data-prefetch="intent" href="/about" className="contrast">
                About
              </a>
            </li>
            <li>
              <a
                href="https://github.com/jacob-ebey"
                className="contrast"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            {loggedIn && (
              <li>
                <a data-prefetch="intent" href="/new" className="contrast">
                  New
                </a>
              </li>
            )}
            {loggedIn && (
              <li>
                <form className="contents" method="post" action="/logout">
                  <button type="submit" className="contrast" role="link">
                    Logout
                  </button>
                </form>
              </li>
            )}
          </ul>
        </nav>
        <Outlet />
        <footer className="container">
          <small>
            Built with{" "}
            <a
              href="https://remix.run"
              className="secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Remix
            </a>{" "}
            •{" "}
            <a
              href="https://picocss.com"
              className="secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pico
            </a>{" "}
            •{" "}
            <a
              href="https://litestream.io"
              className="secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Litestream
            </a>{" "}
            •{" "}
            <a
              href="https://github.com/jacob-ebey/jacob-thoughts"
              className="secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Source
            </a>
          </small>
        </footer>
        <Turbolinks />
        <LiveReload />
      </body>
    </html>
  );
}
