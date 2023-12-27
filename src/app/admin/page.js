"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/Dashboard/AdminDashboard";

export default function Home() {
  const router = useRouter();
  const logout = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/logout`, {
        withCredentials: true,
      })
      .then((res) => router.push("/"))
      .catch((e) => console.log(e));
  };
  return (
    <main>
      <AdminDashboard />
    </main>
  );
}
