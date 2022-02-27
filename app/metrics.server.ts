export function getMetricsKey(request: Request) {
  let url = new URL(request.url);
  let key = url.pathname.replace(/\//g, "-").replace(/^\-/, "") || "index";
  return `${url.hostname}/${key}`;
}

export async function pageView(request: Request) {
  let url = new URL(request.url);
  await fetch(`https://api.countapi.xyz/hit/${getMetricsKey(request)}`);
}
