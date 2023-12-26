"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setError(false);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "Administrator") {
          router.push("/admin");
        } else if (res.data === "Supervisor") {
          router.push("supervisor");
        } else if (res.data == "Employee") {
          router.push("/employee");
        }
      })
      .catch((e) => setError(true));
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h2 className={styles.title}>Login</h2>
        <form className={styles.form} onSubmit={handleLogin}>
          <p
            className={styles.error}
            style={{ display: error ? "block" : "none" }}
          >
            Invalid Email/Password
          </p>

          <label className={styles.label} htmlFor="email">
            Email/Phone Number:
          </label>
          <input
            className={styles.input}
            id="email"
            name="email"
            style={{ border: error ? "1px solid red" : "" }}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className={styles.label} htmlFor="password">
            Password:
          </label>
          <input
            className={styles.input}
            type="password"
            id="password"
            name="password"
            style={{ border: error ? "1px solid red" : "" }}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <p className={styles.subBtn} onClick={() => router.push("/signup")}>
            Create new account
          </p>
          <button className={styles.button} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
