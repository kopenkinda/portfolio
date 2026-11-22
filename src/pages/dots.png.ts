// Serves the data behind the dots graphic (src/components/dots/grid.ts) as a small PNG.
import type { APIRoute } from "astro";
import { grid } from "../components/dots/grid";

export const GET: APIRoute = () => new Response(new Uint8Array(grid), { headers: { "Content-Type": "image/png" } });
