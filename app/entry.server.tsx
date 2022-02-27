import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";

import { pageView } from "~/metrics.server";
import { isLoggedIn } from "~/session.server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  isLoggedIn(request, false).then<false | void>(
    (loggedIn) => !loggedIn && pageView(request)
  );

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");
  if (process.env.FLY_REGION) {
    responseHeaders.set("X-Fly-Region", process.env.FLY_REGION);
  }

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
