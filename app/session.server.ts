import { createCookieSessionStorage, redirect } from "remix";

if (!process.env.COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET environment variable is not set");
}

let sessionStorage = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.COOKIE_SECRET!],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function isLoggedIn(
  request: Request,
  required: false
): Promise<boolean>;
export async function isLoggedIn(
  request: Request,
  required: true
): Promise<true>;
export async function isLoggedIn(request: Request, required: boolean = true) {
  let session = await sessionStorage.getSession(request.headers.get("Cookie"));
  let loggedIn = session.get("loggedIn") === true;

  if (!loggedIn && required) throw redirect("/login");

  return loggedIn;
}

export async function setLoggedIn(request: Request) {
  let session = await sessionStorage.getSession(request.headers.get("Cookie"));
  session.set("loggedIn", true);
  return await sessionStorage.commitSession(session);
}

export async function destroySession(request: Request) {
  let session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return await sessionStorage.destroySession(session);
}
