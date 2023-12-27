"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AdminAuth = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/adminauth`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsAuth(true);
      })
      .catch((e) => {
        setIsAuth(false);
        router.push("/");
      });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return isAuth ? <>{children}</> : null;
};
export default AdminAuth;