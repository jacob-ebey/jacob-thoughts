import { redirect, useSearchParams } from "remix";
import type { ActionFunction } from "remix";

import { setLoggedIn } from "~/session.server";

import imgHref from "~/media/phuket-pool.jpg";
import stylesHref from "~/styles/login.css";

export let links = () => [
  {
    rel: "stylesheet",
    href: stylesHref,
  },
];

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let password = formData.get("password") as null | string;

  if (!process.env.LOGIN_PASSWORD || password !== process.env.LOGIN_PASSWORD) {
    return redirect("/login?error=invalid login");
  }

  return redirect("/new", {
    headers: {
      "Set-Cookie": await setLoggedIn(request),
    },
  });
};

export default function Login() {
  let [searchParams] = useSearchParams();
  let error = searchParams.get("error");

  return (
    <main className="container">
      <article className="grid">
        <div>
          <hgroup>
            <h1>Sign in</h1>
            <h2>Get outta here if you're not Jacob...</h2>
          </hgroup>
          <form method="post">
            <input
              name="username"
              type="text"
              autoComplete="current-username"
              hidden
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              autoComplete="current-password"
              aria-invalid={!!error ? true : undefined}
              aria-describedby={!!error ? "error" : undefined}
              required
            />
            {!!error && <p id="error">{error}</p>}
            <button type="submit" className="contrast">
              Login
            </button>
          </form>
        </div>
        <div
          style={{ backgroundImage: `url(${JSON.stringify(imgHref)})` }}
        ></div>
      </article>
    </main>
  );
}
