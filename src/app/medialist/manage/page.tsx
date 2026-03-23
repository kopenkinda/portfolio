import type { Metadata } from "next";
import { ManageMedialistPage } from "../_components/manage-medialist-page";

export const metadata: Metadata = {
  title: "Manage Medialist",
  description: "Edit anime and series entries.",
};

export default function MedialistManagePage() {
  return <ManageMedialistPage />;
}
