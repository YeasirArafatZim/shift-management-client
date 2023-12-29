"use client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import { useRouter } from "next/navigation";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import styles from "./AdminNav.module.css";

function EmployeeNav() {
  const router = useRouter();
  const [profileModal, setProfileModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [upStatus, setUpStatus] = useState(false);
  const [user, setUser] = useState({});
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [passData, setPassData] = useState({
    oldPass: "",
    newPass: "",
    conPass: "",
  });
  const [error, setError] = useState({
    wrong: false,
    notMatch: false,
  });

  const fetchEmployee = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/empdata`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangePass = (e) => {
    const { name, value } = e.target;
    setPassData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError({
      wrong: false,
      notMatch: false,
    });
  };
  const updateProfile = (e) => {
    e.preventDefault();
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employee/${user._id}`,
        profileData,
        { withCredentials: true }
      )
      .then((res) => setUpStatus(true))
      .catch((e) => console.log(e));
  };
  const updatePass = (e) => {
    e.preventDefault();
    if (passData.newPass !== passData.conPass) {
      setError((prev) => ({
        ...prev,
        notMatch: true,
      }));
    } else {
      // Check Old Pass then update
      axios
        .post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/passcheck`,
          { password: passData.oldPass },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          axios
            .patch(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/passupdate/${user._id}`,
              { password: passData.newPass },
              { withCredentials: true }
            )
            .then((res) => {
              closePassModal();
              setPassData({
                oldPass: "",
                newPass: "",
                conPass: "",
              });
            })
            .catch((e) => console.log(e));
        })
        .catch((e) =>
          setError((prev) => ({
            ...prev,
            wrong: true,
          }))
        );
    }
  };

  const openProfileModal = () => {
    setProfileModal(true);
    setProfileData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  };
  const closeProfileModal = () => {
    setProfileModal(false);
    setUpStatus(false);
    fetchEmployee();
  };
  const openPassModal = () => {
    setPassModal(true);
  };
  const closePassModal = () => {
    setPassModal(false);
  };
  const logout = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/logout`, {
        withCredentials: true,
      })
      .then((res) => router.push("/"))
      .catch((e) => console.log(e));
  };
  return (
    <>
      <Navbar
        fixed="top"
        expand="lg"
        className="bg-body-tertiary"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container fluid>
          <Navbar.Brand href="/admin">Employee Panel</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            ></Nav>
            <div className="me-4">
              <NavDropdown
                title="Settings"
                id="navbarScrollingDropdown"
                align={{ lg: "end" }}
                style={{ color: "white" }}
              >
                <NavDropdown.Item href="#" onClick={openProfileModal}>
                  Update Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={openPassModal}>
                  Update Password
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#" onClick={logout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Profile Modal  */}
      <Modal show={profileModal} onHide={closeProfileModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "green", display: upStatus ? "block" : "none" }}>
            update successful
          </p>
          <form className={styles.form}>
            <label htmlFor="name">Name:</label>
            <input
              className={styles.input}
              style={{ width: "100%" }}
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={profileData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email:</label>
            <input
              className={styles.input}
              style={{ width: "100%" }}
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={profileData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="phone">Mobile:</label>
            <input
              className={styles.input}
              style={{ width: "100%" }}
              type="text"
              id="phone"
              name="phone"
              placeholder="Mobile Number"
              value={profileData.phone}
              onChange={handleChange}
              required
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeProfileModal}>
            Close
          </Button>
          <Button variant="primary" onClick={updateProfile}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pass  */}
      <Modal show={passModal} onHide={closePassModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className={styles.form}>
            <p
              style={{
                color: "red",
                display: error.wrong ? "block" : "none",
              }}
            >
              Password not matched
            </p>
            <input
              className={styles.input}
              style={{
                width: "100%",
                border: error.wrong ? "1px solid red" : "",
              }}
              type="password"
              id="oldPass"
              name="oldPass"
              placeholder="Old Password"
              value={passData.oldPass}
              onChange={handleChangePass}
              required
            />
            <p
              style={{
                color: "red",
                display: error.notMatch ? "block" : "none",
              }}
            >
              Password not matched
            </p>
            <input
              className={styles.input}
              style={{
                width: "100%",
                border: error.notMatch ? "1px solid red" : "",
              }}
              type="password"
              id="newPass"
              name="newPass"
              placeholder="New Password"
              value={passData.newPass}
              onChange={handleChangePass}
              required
            />
            <input
              className={styles.input}
              style={{
                width: "100%",
                border: error.notMatch ? "1px solid red" : "",
              }}
              type="password"
              id="conPass"
              name="conPass"
              placeholder="Confirm Password"
              value={passData.conPass}
              onChange={handleChangePass}
              required
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePassModal}>
            Close
          </Button>
          <Button variant="primary" onClick={updatePass}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EmployeeNav;
