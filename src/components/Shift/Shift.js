"use client";
import styles from "./Shift.module.css";
import { Dropdown, FormGroup } from "react-bootstrap";
import { CgMoreVerticalO } from "react-icons/cg";
import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Shift() {
  const [shifts, setShifts] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [upModal, setUpModal] = useState(false);
  const [overlap, setOverlap] = useState(false);
  const [upId, setUpId] = useState("");
  const [form, setForm] = useState({
    name: "",
    start: "09:00",
    end: "17:00",
  });

  const fetchShift = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/shift`, {
        withCredentials: true,
      })
      .then((res) => {
        setShifts(res.data);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    fetchShift();
  }, []);
  const delShift = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/shift/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        fetchShift();
      })
      .catch((e) => console.log(e));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setOverlap(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = new Date("2024-01-28T" + form.start + ":00");
    const end = new Date("2024-01-28T" + form.end + ":00");

    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/shift`,
        {
          name: form.name,
          start: start,
          end: end,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        closeAddModal();
      })
      .catch((e) => setOverlap(true));
  };
  const handleUpSubmit = (e) => {
    e.preventDefault();
    const start = new Date("2024-01-28T" + form.start + ":00");
    const end = new Date("2024-01-28T" + form.end + ":00");
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/shift/${upId}`,
        {
          name: form.name,
          start: start,
          end: end,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        closeUpModal();
      })
      .catch((e) => setOverlap(true));
  };

  const openAddModal = () => {
    setAddModal(true);
  };
  const closeAddModal = () => {
    setOverlap(false);
    setAddModal(false);
    setForm({
      name: "",
      start: "09:00",
      end: "17:00",
    });
    fetchShift();
  };
  const openUpModal = (data) => {
    setForm({
      name: data.name,
      start: strTo24Time(data.start),
      end: strTo24Time(data.end),
    });
    setUpId(data._id);
    setUpModal(true);
  };
  const closeUpModal = () => {
    setUpModal(false);
    setOverlap(false);
    setForm({
      name: "",
      start: "09:00",
      end: "17:00",
    });
    fetchShift();
  };

  const strToTime = (date) => {
    const d = new Date(date);
    const formattedTime = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedTime;
  };
  const strTo24Time = (date) => {
    const d = new Date(date);
    const formattedTime = d.toLocaleTimeString("en-GB");
    return formattedTime;
  };

  return (
    <div className="container pt-3">
      {/* Add Shift */}
      <div className="mt-2" style={{ textAlign: "right" }}>
        <input
          type="button"
          className={`btn ${styles.btn_custom}`}
          onClick={openAddModal}
          value="Add New Shift"
          style={{ width: "300px" }}
        />
      </div>

      <div className="table-responsive">
        <table
          className="table mb-0"
          style={{
            border: "1px solid #E5E4E2",
            marginTop: "25px",
            backgroundColor: "white",
            minHeight: "200px",
          }}
        >
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Shift Name</th>
              <th scope="col" className={styles.table_header}>
                {" "}
                Start Time
              </th>
              <th scope="col" className={styles.table_header}>
                {" "}
                End Time
              </th>
              <th scope="col" className={styles.table_header}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((x, i) => (
              <tr key={x._id}>
                <th scope="row">{i + 1}</th>
                <td
                  style={{
                    color: "#1B7FA6",
                    fontSize: "16px",
                  }}
                >
                  {x.name}
                  <br />
                </td>
                <td align="center">
                  <div>{strToTime(x.start)}</div>
                </td>
                <td align="center">{strToTime(x.end)}</td>

                <td align="center">
                  <Dropdown className="mr-3">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      variant="link"
                      bsPrefix="p-0"
                    >
                      <CgMoreVerticalO className={styles.action} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="m-0">
                      <Dropdown.Item
                        href="#"
                        className={styles.drop}
                        onClick={() => openUpModal(x)}
                      >
                        Update Shift
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        className={styles.drop}
                        onClick={() => delShift(x._id)}
                      >
                        Delete Shift
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal  */}
      <Modal show={addModal} onHide={closeAddModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add shift</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className={styles.form} method="post" onSubmit={handleSubmit}>
            <p style={{ color: "red", display: overlap ? "block" : "none" }}>
              Shift Overlaps
            </p>
            <input
              className={styles.input}
              style={{
                width: "100%",
                // border: error.wrong ? "1px solid red" : "",
              }}
              type="text"
              id="name"
              name="name"
              placeholder="Shift Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label>Start Time</label>
            <input
              className={styles.input}
              style={{
                width: "100%",
                border: overlap ? "1px solid red" : "",
              }}
              type="time"
              id="start"
              name="start"
              placeholder="Start Time"
              value={form.start}
              onChange={handleChange}
              required
            />
            <label>End Time</label>
            <input
              className={styles.input}
              style={{
                width: "100%",
                border: overlap ? "1px solid red" : "",
              }}
              type="time"
              id="end"
              name="end"
              placeholder="End Time"
              value={form.end}
              onChange={handleChange}
              required
            />
            <Button variant="primary" type="submit" style={{ float: "right" }}>
              Add
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal  */}
      <Modal show={upModal} onHide={closeUpModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add shift</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className={styles.form} method="post" onSubmit={handleUpSubmit}>
            <p style={{ color: "red", display: overlap ? "block" : "none" }}>
              Shift Overlaps
            </p>
            <input
              className={styles.input}
              style={{
                width: "100%",
              }}
              type="text"
              id="name"
              name="name"
              placeholder="Shift Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label>Start Time</label>
            <input
              className={styles.input}
              style={{
                width: "100%",
                border: overlap ? "1px solid red" : "",
              }}
              type="time"
              id="start"
              name="start"
              placeholder="Start Time"
              value={form.start}
              onChange={handleChange}
              required
            />
            <label>End Time</label>
            <input
              className={styles.input}
              style={{
                width: "100%",
                border: overlap ? "1px solid red" : "",
              }}
              type="time"
              id="end"
              name="end"
              placeholder="End Time"
              value={form.end}
              onChange={handleChange}
              required
            />
            <Button variant="primary" type="submit" style={{ float: "right" }}>
              Update
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
