"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const initialState = {
    name: "",
    email: "",
    phone: "",
    gender: "male",
    password: "",
    confirmPassword: "",
  };
  const router = useRouter();
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState({
    email: false,
    pass: false,
    phone: false,
  });

  const isStrongPassword = (password) => {
    const minLength = 8;
    if (password.length < minLength) {
      return "Minimum Length 8 character";
    }
    const hasUppercase = /[A-Z]/.test(password);
    if (!hasUppercase) {
      return "Atleast 1 Uppercase required";
    }
    const hasLowercase = /[a-z]/.test(password);
    if (!hasLowercase) {
      return "Atleast 1 lowercase required";
    }
    const hasDigit = /\d/.test(password);
    if (!hasDigit) {
      return "Atleast 1 Digit required";
    }
    const hasSpecialChar = /[!@#$%^&*(),.?"_:{}|<>]/.test(password);
    if (!hasSpecialChar) {
      return "Atleast 1 Special Character required";
    }
    return true;
  };

  const handleChange = (e) => {
    setError({ email: false, pass: false, phone: false });
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError((prev) => ({ ...prev, pass: "Password doesn't matched" }));
      return;
    }
    const passChk = isStrongPassword(formData.password);
    if (passChk === true) {
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/register`, formData)
        .then((res) => {
          setFormData(initialState);
          router.push("/");
        })
        .catch((e) => {
          if (e.response.data == "Email Already exists") {
            setError((prev) => ({ ...prev, email: true }));
          } else if (e.response.data == "Phone Number Already exists") {
            setError((prev) => ({ ...prev, phone: true }));
          } else {
            console.log(e);
          }
        });
    } else {
      setError((prev) => ({ ...prev, pass: passChk }));
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h2 className={styles.title}>Create employee account</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            style={{ width: "100%" }}
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <p
            className={styles.error}
            style={{ display: error.email ? "block" : "none" }}
          >
            Email Already Exists
          </p>

          <input
            className={styles.input}
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            style={{ border: error.email ? "1px solid red" : "" }}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <p
            className={styles.error}
            style={{ display: error.phone ? "block" : "none" }}
          >
            Phone Number Already Exists
          </p>
          <input
            className={styles.input}
            type="text"
            id="phone"
            name="phone"
            placeholder="Mobile Number"
            style={{ border: error.phone ? "1px solid red" : "" }}
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <div className={styles.radioBtn}>
            <label className={styles.label} htmlFor="gender">
              Gender:
            </label>
            <input
              type="radio"
              name="gender"
              value="male"
              id="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
            />
            <label htmlFor="male" style={{ cursor: "pointer" }}>
              Male
            </label>
            <input
              type="radio"
              name="gender"
              value="female"
              id="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
            />
            <label htmlFor="female" style={{ cursor: "pointer" }}>
              Female
            </label>
          </div>

          <p
            className={styles.error}
            style={{ display: error.pass ? "block" : "none" }}
          >
            {error.pass}
          </p>
          <input
            className={styles.input}
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{ border: error.pass ? "1px solid red" : "" }}
          />

          <input
            className={styles.input}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={() => {
              const passCheck = isStrongPassword(formData.password);
              if (passCheck != true) {
                setError((prev) => ({ ...prev, pass: passCheck }));
              }
            }}
            style={{ border: error.pass ? "1px solid red" : "" }}
          />
          <p className={styles.subBtn} onClick={() => router.push("/login")}>
            Already have a account?
          </p>
          <button className={styles.button} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
