import type { Metadata } from "next";
import { MedialistLoginForm } from "../_components/login-form";

export const metadata: Metadata = {
  title: "Medialist Login",
  description: "Sign in to edit the medialist.",
};

export default function MedialistLoginPage() {
  return (
    <main className="mx-auto flex w-container flex-1 items-center justify-center border px-6 py-10">
      <MedialistLoginForm />
    </main>
  );
}
