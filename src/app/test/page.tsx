import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectShowcase from "@/components/test/projectShowcase";

export const metadata: Metadata = {
  title: "تست اجزا",
  robots: { index: false, follow: false },
};

export default function TestPage() {
  if (process.env.NEXT_PUBLIC_SHOW_TEST !== "true") {
    notFound();
  }
  return <ProjectShowcase />;
}
