import { Fragment } from "react";
import { json, useLoaderData } from "remix";
import type { HeadersFunction, LoaderFunction } from "remix";
import linkifyUrls from "linkify-urls";

import type { Post } from "@prisma/client";
import prisma from "~/prisma.server";

import { isLoggedIn } from "~/session.server";
import { getMetricsKey } from "~/metrics.server";
import { PageViews } from "~/components/page-views";
import linkIconSvg from "~/media/link-icon.svg";

export const headers: HeadersFunction = ({ actionHeaders }) => {
  return actionHeaders;
};

type LoaderData = {
  posts: Post[];
  metricsKey?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  let [posts, loggedIn] = await Promise.all([
    prisma.post.findMany({
      orderBy: {
        id: "desc",
      },
    }),
    isLoggedIn(request, false),
  ]);

  return json<LoaderData>({
    posts,
    metricsKey: loggedIn ? await getMetricsKey(request) : undefined,
  });
};

export default function Index() {
  let { posts, metricsKey } = useLoaderData<LoaderData>();
  let metricsKeyBase = metricsKey?.split("/", 1)[0];

  return (
    <main className="container">
      {!!metricsKey && <PageViews metricsKey={metricsKey} />}
      {posts.length === 0 && (
        <hgroup>
          <h1>Nothing posted yet...</h1>
          <h2>Come back in a bit for the contents...</h2>
        </hgroup>
      )}
      {posts.map((post, index) => (
        <Fragment key={post.id}>
          {index > 0 && (
            <>
              <hr />
              <br />
            </>
          )}
          <section>
            {post.subtitle ? (
              <hgroup>
                <h1>
                  {post.title}{" "}
                  <a
                    data-prefetch="intent"
                    href={`/post/${post.id}`}
                    aria-label="permalink"
                  >
                    <svg height={36} width={36} fill="currentColor">
                      <use href={`${linkIconSvg}#link-icon`} />
                    </svg>
                  </a>
                </h1>
                <h2>{post.subtitle}</h2>
              </hgroup>
            ) : (
              <h1>
                {post.title}{" "}
                <a
                  data-prefetch="intent"
                  href={`/post/${post.id}`}
                  aria-label="permalink"
                >
                  <svg height={36} width={36} fill="currentColor">
                    <use href={`${linkIconSvg}#link-icon`} />
                  </svg>
                </a>
              </h1>
            )}
            {!!metricsKey && (
              <PageViews metricsKey={`${metricsKeyBase}/post-${post.id}`} />
            )}
            {post.body.split("\n").map((line, index) => (
              <p
                key={line + index}
                dangerouslySetInnerHTML={{ __html: linkifyUrls(line) }}
              />
            ))}
          </section>
        </Fragment>
      ))}
    </main>
  );
}
