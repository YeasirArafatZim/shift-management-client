"use client";
import Auth from "@/components/Auth/Auth";
import Schedule from "@/components/Schedule/Schedule";

export default function Home() {
  return (
    <Auth>
      <main>
        <Schedule />
      </main>
    </Auth>
  );
}
