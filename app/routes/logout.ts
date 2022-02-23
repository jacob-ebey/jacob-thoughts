import { redirect } from "remix";
import type { ActionFunction } from "remix";

import { destroySession } from "~/session.server";

export let action: ActionFunction = async ({ request }) => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(request),
    },
  });
};

export let loader = () => redirect("/");

export default () => null;
