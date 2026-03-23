import type { Metadata } from "next";
import { PublicMedialistPage } from "./_components/public-medialist-page";

export const metadata: Metadata = {
  title: "Medialist",
  description: "Anime and series tracking for the portfolio.",
};

export default function MedialistPage() {
  return <PublicMedialistPage />;
}
