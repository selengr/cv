import type { Metadata } from "next";
import ProjectShowcase from "@/components/test/projectShowcase";

export const metadata: Metadata = {
  title: "تست اجزا | Shopy",
};

export default function TestPage() {
  return <ProjectShowcase />;
}
