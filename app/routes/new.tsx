import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { isLoggedIn } from "~/session.server";

import prisma from "~/prisma.server";

export let loader: LoaderFunction = async ({ request }) => {
  await isLoggedIn(request, true);
  return null;
};

export let action: ActionFunction = async ({ request }) => {
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

    return redirect(`/new?${errors.toString()}`);
  }

  let post = await prisma.post.create({
    data: {
      title: title!,
      subtitle,
      body: body!,
    },
  });

  return redirect(`/post/${post.id}`);
};

export default function Admin() {
  let [searchParams] = useSearchParams();

  return (
    <main className="container">
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
            defaultValue={searchParams.get("title")?.trim()}
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
            defaultValue={searchParams.get("subtitle")?.trim()}
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
            defaultValue={searchParams.get("body")?.trim()}
            aria-labelledby={
              searchParams.has("body-error") ? "body-error" : undefined
            }
          />
          <button type="submit">Create</button>
        </form>
      </section>
    </main>
  );
}
