"use client";

import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function SportRedirect() {
  const pathname = usePathname();
  const currentRoute = pathname.split("/")[1];

  redirect(`/${currentRoute}/${getTodayDate()}`);
}
