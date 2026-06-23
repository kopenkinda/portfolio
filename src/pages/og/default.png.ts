import type { APIRoute } from "astro";
import { renderSiteOgImagePng } from "../../lib/og";

export const prerender = true;

export const GET: APIRoute = async () => {
  const png = await renderSiteOgImagePng();
  return new Response(png as BodyInit, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};
