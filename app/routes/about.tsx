import type { HeadersFunction, MetaFunction } from "@remix-run/node";

import imgHref from "~/media/phuket-pool.jpg";

export const meta: MetaFunction = () => {
  return { title: "Jacob Thoughts", description: "Obligatory about page." };
};

export const headers: HeadersFunction = () => {
  let headers = new Headers();
  headers.set("Cache-Control", "public, max-age=60");
  return headers;
};

export default function About() {
  return (
    <main className="container">
      <section>
        <h1>Obligatory about page</h1>

        <p>
          Bla bla bla engineer, bla bla bla make the world a better place 😂
        </p>

        <p>
          Sarcasm is my middle name, but since it doesn't come off well over the
          internet you probably think I'm a big asshole, and that's allright.
          You do you boo boo.
        </p>

        <figure>
          <img src={imgHref} alt="Minimal landscape" />
          <figcaption>
            Chilling in Phuket, Thailand with my beautiful wife 😍
          </figcaption>
        </figure>
      </section>
    </main>
  );
}
