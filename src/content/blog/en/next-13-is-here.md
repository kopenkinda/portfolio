---
title: Next 13 is out, here's what you need to know
description: "Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed."
thumbnail: next-13-preview.png
draft: false
date: 10-28-2022
keywords:
  - NextJS
  - Release
---

For almost year now, the Next.js team has been working on the next major release of Next.js, version 13. This release is packed with new features and improvements, and I can't wait to share them with you.

Some features are still in early stages (alpha or beta), some are already stable and ready to use. I'll go in order, starting with the most stable features and ending with the ones that are still in early stages.

- <a href="#nextimage">The new and improved version of `next/image`</a>
- <a href="#nextlink">Improvements of `next/link`</a>
- <a href="#nextfont">`next/font`(beta) - Automatic self-hosted fonts with zero layout shift.</a>
- <a href="#app-folder">A reimagining of their router with the `app/` folder (beta).</a>
- <a href="#turbopack">`Turbopack`(alpha) - A new bundler that is **_700x_** (allegedly) faster than webpack.</a>

## Core components

### next/image

With the introduction of Next.js 13, we've got an updated version of `next/image`.
The new Image component:

- Easier to style (!!!) and configure
- Ships less client-side JavaScript
- More accessible requiring alt tags by default
- Aligns with the Web platform
- Faster because native lazy loading doesn't require hydration

The new Image component is will be used automatically in your project once you upgrade to Next 13, but you'll still be able to access the legacy version by updating your import to `next/legacy/image`.

Here's a quick example of how to use the new Image component:

```tsx
// Avatar.tsx
import Image from "next/image";

export type AvatarProps = { user: User };
export const Avatar = ({ user }: AvatarProps) => {
  return (
    <Image
      className="h-6 w-6 rounded-full"
      alt={`${user.name}'s avatar`}
      src={user.profilePic}
      placeholder="blur"
    />
  );
};
```

### next/link

Starting with Next.js 13, <a href="https://nextjs.org/docs/api-reference/next/link">`next/link`</a> does not require the `<a>` tag to be passed as a child manually anymore.

This was added as an experimental option in 12.2 and is now the default. In Next.js 13, `<Link>` always renders an `<a>` and allows you to forward props to the underlying tag. For example:

```tsx
import Link from 'next/link'

// Next.js 12: `<a>` has to be nested otherwise it's excluded
<Link href="/about">
  <a>About</a>
</Link>

// Next.js 13: `<Link>` always renders `<a>`
<Link href="/about">
  About
</Link>
```

### next/font

<a href="https://nextjs.org/docs/basic-features/font-optimization">`@next/font`</a> includes built-in automatic self-hosting for any font file. This means you can optimally load web fonts with zero layout shift, thanks to the underlying CSS size-adjust property used.

This new font system also allows you to conveniently use all Google Fonts with performance and privacy in mind. CSS and font files are downloaded at build time and self-hosted with the rest of your static assets. **No requests are sent to Google by the browser.**

```tsx
import { Lato } from '@next/font/google';

const lato = Lato();

<html className={lato.className}>
  {...}
</html>
```

Here's how you would use with custom fonts:

```tsx
import localFont from '@next/font/local';

const myFont = localFont({ src: './my-font.woff2' });

<html className={myFont.className}>
  {...}
</html>
```

## `app/` folder

### Layouts

Up until now Next.js has been using a single `pages/` folder to handle routing. This has worked well for a long time, but it has some limitations.

The `app/` folder is a drop-in replacement for `pages/` that allows you to be more specific about what you render. _(Note: `pages/` folder is still supported and maintained, so you can incrementally upgrade your Next application to the latest version)_.

<img src="https://nextjs.org/_next/image?url=%2Fstatic%2Fblog%2Flayouts-rfc%2Fapp-folder.png&w=3840&q=75" />

Each route inside the app folder is now defined by creating a folder with the route's name and putting a `page.{jsx,tsx}` file inside. By doing this you'll get exactly the same behavior as you would with the `pages/` folder. However routes are now defined as folders, Next 13 introduces new ways to automatically handle state in your application.

<img src="/assets/next-13/new-layouts.png" />

Next will now automatically render a loading state if you create a `loading.{jsx,tsx}` file inside the folder. Same for the error state (`error.{jsx,tsx}`).

Another benefit of this new approach is that you can now colocate your page related components and assets directly inside of the page's folder. This makes it easier to find and manage your code.

One more file that you can add to the folder is `layout.{jsx,tsx}`. This file will be used to wrap the route's content. Layouts share UI between multiple pages. On navigation, layouts preserve state, remain interactive, and do not re-render.

```tsx
// app/blog/layout.tsx
import { PropsWithChildren } from "react";
import { Sidebar } from "./sidebar";

export const BlogLayout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <>
      <Sidebar />
      <section>{children}</section>
    </>
  );
};
```

### Server Components

The app/ directory introduces support for React's new Server Components architecture. Server and Client Components use the server and the client each for what they're best at - allowing you to build fast, highly-interactive apps with a single programming model that provides a great developer experience.

With Server Components, they're laying the foundations to build complex interfaces while reducing the amount of JavaScript sent to the client -> enabling faster initial page loads.

<a href="https://beta.nextjs.org/docs/rendering/server-and-client-components">Learn more about Server components</a>

### Streaming

The introduction of the `app/` folder with it's new layout system and support for Server Components also allows for support for streaming. This means that you can now stream the HTML to the client as it's being generated. This is especially useful for large pages that take a long time to render. With this approach, the user does not have to wait for the entire page to load before they can start interacting with it.

<img src="https://nextjs.org/_next/image?url=%2Fstatic%2Fblog%2Fnext-13%2Fstreaming.png&w=3840&q=75" />

<a href="https://beta.nextjs.org/docs/data-fetching/fundamentals">Learn more about how next does data streaming</a>

### Data Fetching

> This is something I personally am not sure about. They are messing with the native `fetch` api, and I'm not sure if I like that. I'll have to look into this more.

React's recent <a href="https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md">Support for Promises RFC</a> introduces a powerful new way to fetch data and handle promises inside components:

```tsx
// app/page.tsx
async function getData() {
  const res = await fetch("https://api.example.com/...");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  return res.json() as { name?: string };
}

// This is an async Server Component
export default async function Page() {
  const data = await getData();

  return <main>data?.name</main>;
}
```

> The native fetch Web API has also been extended in React and Next.js. It automatically dedupes fetch requests and provides one flexible way to fetch, cache, and revalidate data at the component level. This means all the benefits of Static Site Generation (SSG), Server-Side Rendering (SSR), and Incremental Static Regeneration (ISR) are now available through one API:

```tsx
// This request should be cached until manually invalidated.
// Similar to `getStaticProps`.
// `force-cache` is the default and can be omitted.
fetch(URL, { cache: "force-cache" });

// This request should be refetched on every request.
// Similar to `getServerSideProps`.
fetch(URL, { cache: "no-store" });

// This request should be cached with a lifetime of 10 seconds.
// Similar to `getStaticProps` with the `revalidate` option.
fetch(URL, { next: { revalidate: 10 } });
```

## Turbopack

Next.js 13 includes <a href="https://vercel.com/blog/turbopack">Turbopack</a>, the new Rust-based successor to Webpack. The Vercel team hired <a href="https://twitter.com/wsokra">Tobias Koppers</a>, the creator of Webpack, to help them build Turbopack.

Here are some perfomance metrics made by the Vercel team:
<img src="https://nextjs.org/_next/image?url=%2Fstatic%2Fblog%2Fnext-13%2Fturbopack.png&w=3840&q=75" />

Turbopack has out-of-the-box support for Server Components, TypeScript, JSX, CSS, and more. During the alpha, many <a href="https://turbo.build/pack/docs/features">features</a> are not yet supported

> Note: Turbopack in Next.js currently only supports next dev. View the supported features. The Next.js team are also working to add support for next build through Turbopack.

## Final Thoughts

Next.js 13 is a huge release. It's a major step forward for the framework and it's community. I'm excited to see what the future holds for Next.js and I'm looking forward to seeing what the community does with it.

\- DK
