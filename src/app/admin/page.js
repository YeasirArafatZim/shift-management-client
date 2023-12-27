"use client";

import { Container } from "react-bootstrap";
import axios from "axios";
import { useRouter } from "next/navigation";

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
      <Container>
        <h1>Administrator</h1>
        <button onClick={logout}>Logout</button>
      </Container>
    </main>
  );
}
