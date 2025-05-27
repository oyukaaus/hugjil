// app/page.tsx or pages/index.tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
