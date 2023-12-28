"use client";
import Auth from "@/components/Auth/Auth";
import SupEmp from "@/components/SupEmp/SupEmp";

export default function Home() {
  return (
    <Auth>
      <main className="mt-5">
        <SupEmp />
      </main>
    </Auth>
  );
}
