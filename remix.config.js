/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  server: "./server.ts",
  ignoredRouteFiles: [".*"],
  devServerBroadcastDelay: 1000,
  serverDependenciesToBundle: [
    "create-html-element",
    "linkify-urls",
    "stringify-attributes",
  ],
};
