let js = String.raw;
let script = js`
  let createPrefetchHandler = (href, setDone) => () => {
    setDone();
    let link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.body.appendChild(link);
  };

  let initPrefetch = () => {
    let done = false;
    let timeout;
    return {
      start: (delay) => (event) => {
        if (done) return;
        let href = (event.target || event.currentTarget).href;
        timeout = setTimeout(createPrefetchHandler(href, () => { done = true; }), delay);
      },
      stop: () => clearTimeout(timeout),
    };
  };

  document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("a[href^='/'][data-prefetch='intent']");
    for (let link of links) {
      let prefetch = initPrefetch();
      link.addEventListener("focus", prefetch.start(400));
      link.addEventListener("blur", prefetch.stop);
      link.addEventListener("mouseenter", prefetch.start(100));
      link.addEventListener("mouseleave", prefetch.stop);
      link.addEventListener("touchstart", prefetch.start(0));
    }
  });
`;

export let Turbolinks = () => {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
};
