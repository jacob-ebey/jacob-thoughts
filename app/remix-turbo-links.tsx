export function initializeTurboLinks() {
  let doPrefetch = (href: string) => {
    let link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.body.appendChild(link);
  };

  let initPrefetch = () => {
    let done = false;
    let timeout: any;
    return {
      start: (delay: number) => (event: Event) => {
        if (done) return;
        let href =
          (event.target && (event.target as HTMLAnchorElement).href) ||
          (event.currentTarget &&
            (event.currentTarget as HTMLAnchorElement).href) ||
          null;
        if (href) {
          timeout = setTimeout(() => {
            if (href && !done) {
              done = true;
              doPrefetch(href);
            }
          }, delay);
        }
      },
      stop: () => clearTimeout(timeout),
    };
  };

  const links = document.querySelectorAll(
    "a[href^='/'][data-prefetch='intent']"
  );

  for (let link of links) {
    let prefetch = initPrefetch();
    link.addEventListener("focus", prefetch.start(400));
    link.addEventListener("blur", prefetch.stop);
    link.addEventListener("mouseenter", prefetch.start(100));
    link.addEventListener("mouseleave", prefetch.stop);
    link.addEventListener("touchstart", prefetch.start(0));
  }
}
