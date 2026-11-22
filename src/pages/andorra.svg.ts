// Serves the home page scene's painting (src/components/andorra/painting.ts) as a static image.
import type { APIRoute } from "astro";
import { painting } from "../components/andorra/painting";

export const GET: APIRoute = () => new Response(painting, { headers: { "Content-Type": "image/svg+xml" } });
