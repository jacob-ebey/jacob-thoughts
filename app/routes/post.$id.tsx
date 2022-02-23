import { json, redirect, useLoaderData, useSearchParams } from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import linkifyUrls from "linkify-urls";

import { Post } from "@prisma/client";
import prisma from "~/prisma.server";
import { isLoggedIn } from "~/session.server";

type LoaderData = {
  loggedIn: boolean;
  post: Post;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  let id = params.id ? parseInt(params.id, 10) : undefined;

  if (!Number.isSafeInteger(id)) throw json(null, { status: 400 });

  let post = await prisma.post.findUnique({
    where: { id },
    rejectOnNotFound: false,
  });

  if (!post) throw json(null, { status: 404 });

  let loggedIn = await isLoggedIn(request, false);

  return json<LoaderData>({
    loggedIn,
    post,
  });
};

export let action: ActionFunction = async ({ request, params }) => {
  await isLoggedIn(request, true);

  // get the form data
  let formData = await request.formData();
  let title = formData.get("title") as undefined | null | string;
  let subtitle = formData.get("subtitle") as undefined | null | string;
  let body = formData.get("body") as undefined | null | string;

  // clean up the form data
  title = title?.trim();
  subtitle = subtitle?.trim();
  body = body?.trim();

  // validate the form data
  let errors = new URLSearchParams();
  if (!title) {
    errors.append("title-error", "required");
  }
  if (!body) {
    errors.append("body-error", "required");
  }

  if (Array.from(errors.entries()).length > 0) {
    // if there are errors, redirect back to the form with the errors and values
    title && errors.set("title", title);
    subtitle && errors.set("subtitle", subtitle);
    body && errors.set("body", body);

    return redirect(`/post/${params.id}?${errors.toString()}`);
  }

  let id = params.id ? parseInt(params.id, 10) : undefined;

  let post = await prisma.post.update({
    where: {
      id,
    },
    data: {
      title: title!,
      subtitle,
      body: body!,
    },
  });

  return redirect(`/post/${post.id}`);
};

export function CatchBoundary() {
  return (
    <main className="container">
      <hgroup>
        <h1>Post not available</h1>
        <h2>
          <a href="/">Back to all</a>
        </h2>
      </hgroup>
    </main>
  );
}

export default function Post() {
  let { loggedIn, post } = useLoaderData<LoaderData>();
  let [searchParams] = useSearchParams();

  return (
    <main className="container">
      <p>
        <a href="/">Back to all</a>
      </p>

      {loggedIn ? (
        <section>
          <form method="post">
            <h1>New Post</h1>
            <label htmlFor="title">Title*</label>
            {searchParams.has("title-error") && (
              <output id="title-error" className="error">
                {searchParams.get("title-error")}
              </output>
            )}
            <input
              name="title"
              id="title"
              type="text"
              autoComplete="off"
              required
              defaultValue={searchParams.get("title")?.trim() ?? post.title}
              aria-labelledby={
                searchParams.has("title-error") ? "title-error" : undefined
              }
            />
            <label htmlFor="subtitle">Subtitle</label>
            <input
              name="subtitle"
              id="subtitle"
              type="text"
              autoComplete="off"
              defaultValue={
                searchParams.get("subtitle")?.trim() ??
                (post.subtitle || undefined)
              }
            />
            <label htmlFor="body">Body*</label>
            {searchParams.has("body-error") && (
              <output id="body-error" className="error">
                {searchParams.get("body-error")}
              </output>
            )}
            <textarea
              name="body"
              id="body"
              autoComplete="off"
              required
              rows={8}
              defaultValue={searchParams.get("body")?.trim() ?? post.body}
              aria-labelledby={
                searchParams.has("body-error") ? "body-error" : undefined
              }
            />
            <button type="submit">Save</button>
          </form>
        </section>
      ) : (
        <section>
          {post.subtitle ? (
            <hgroup>
              <h1>{post.title}</h1>
              <h2>{post.subtitle}</h2>
            </hgroup>
          ) : (
            <h1>{post.title}</h1>
          )}
          {post.body.split("\n").map((line, index) => (
            <p
              key={line + index}
              dangerouslySetInnerHTML={{ __html: linkifyUrls(line) }}
            />
          ))}
        </section>
      )}
    </main>
  );
}
