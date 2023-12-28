"use client";
import styles from "./SupEmp.module.css";
import { Dropdown } from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";
import { CgMoreVerticalO } from "react-icons/cg";
import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function SupEmp() {
  const [employees, setEmployees] = useState([]);
  const [filterEmp, setFilterEmp] = useState(employees);
  const [updateModal, setUpdateModal] = useState(false);
  const [shiftModal, setShiftModal] = useState(false);
  const [upShiftModal, setUpShiftModal] = useState(false);
  const [upEmp, setUpEmp] = useState({});
  const [userStatus, setUserStatus] = useState("");
  const [shifts, setShifts] = useState([]);
  const status = ["Active", "Pending"];
  const [selShift, setSelShift] = useState("");
  const [date, setDate] = useState("");
  const [dpErr, setDpErr] = useState(false);
  const [empShift, setEmpShift] = useState({});

  const fetchEmployee = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/allemp`, {
        withCredentials: true,
      })
      .then((res) => {
        setEmployees(res.data);
        setFilterEmp(res.data);
      })
      .catch((e) => console.log(e));
  };
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
    fetchEmployee();
    fetchShift();
  }, []);

  const searchByName = (e) => {
    let searchValue = e.target.value;
    if (searchValue.length > 0) {
      const filEmp = employees.filter((emp) =>
        emp?.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilterEmp(filEmp);
    } else {
      setFilterEmp(employees);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    if (e.target.value != "") {
      const filEmp = employees.filter((emp) => emp.status == e.target.value);
      setFilterEmp(filEmp);
    } else {
      setFilterEmp(employees);
    }
  };

  const openUpdateModal = (id) => {
    setUpdateModal(true);
    const result = filterEmp.find((item) => item._id === id);
    setUpEmp(result);
  };
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpEmp({});
    setUserStatus("");
    fetchEmployee();
  };
  const openShiftModal = (id) => {
    setShiftModal(true);
    const result = filterEmp.find((item) => item._id === id);
    setUpEmp(result);
  };
  const closeShiftModal = () => {
    setShiftModal(false);
    setUpEmp({});
    setDate("");
    setSelShift("");
    fetchEmployee();
    setDpErr(false);
  };

  const openUpShiftModal = (id) => {
    setUpShiftModal(true);
    const result = filterEmp.find((item) => item._id === id);
    setUpEmp(result);
  };
  const closeUpShiftModal = () => {
    setUpShiftModal(false);
    setUpEmp({});
    setDate("");
    setSelShift("");
    fetchEmployee();
    setDpErr(false);
    setEmpShift({});
  };

  const handleStatus = (e) => {
    e.preventDefault();
    setUserStatus(e.target.value);
  };
  const handleShift = (e) => {
    e.preventDefault();
    setSelShift(e.target.value);
    setDpErr(false);
  };
  const handleDate = (e) => {
    e.preventDefault();
    setDate(e.target.value);
    setDpErr(false);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/getEmpShift`,
        {
          empId: upEmp._id,
          date: new Date(e.target.value),
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setEmpShift(res.data.shiftId);
      })
      .catch((e) => console.log(e));
  };

  const handleSubmit = () => {
    if (userStatus != "") {
      axios
        .patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/${upEmp._id}`, {
          status: userStatus,
        })
        .then((res) => closeUpdateModal())
        .catch((e) => console.log(e));
    }
  };

  const handleShiftSubmit = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/assignshift`,
        {
          empId: upEmp._id,
          shiftId: selShift,
          date: new Date(date),
        },
        { withCredentials: true }
      )
      .then((res) => closeShiftModal())
      .catch((e) => setDpErr(true));
  };
  const handleShiftUpdate = () => {
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/updateEmpShift`,
        {
          empId: upEmp._id,
          shiftId: selShift,
          date: new Date(date),
        },
        { withCredentials: true }
      )
      .then((res) => closeUpShiftModal())
      .catch((e) => setDpErr(true));
  };

  const renderStatus = (status) => {
    if (status == "Active") {
      return (
        <td
          align="center"
          style={{
            color: "#1B8219",
            fontWeight: "bold",
          }}
        >{`Active`}</td>
      );
    } else {
      return (
        <td
          align="center"
          style={{
            color: "#EB2929",
            fontWeight: "bold",
          }}
        >{`Pending`}</td>
      );
    }
  };

  return (
    <div className="container pt-3">
      {/* Filtering  */}
      <div className="row mt-2 mr-1">
        <div className="col mx-2">
          <p
            style={{
              fontSize: "16px",
              margin: 0,
              color: "black",
            }}
          >
            Status
          </p>
          <select
            name="status"
            id="status"
            className={styles.drop_down}
            onChange={handleFilter}
          >
            <option value="">All</option>
            {status.map((x, i) => (
              <option key={i} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Search  */}
      <div className="row mr-2">
        <div className="col-md-12 pt-3">
          <input
            className={styles.search_bar}
            type="text"
            placeholder="Employee name"
            onChange={searchByName}
          />
          <IoSearchOutline />
        </div>
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
              <th scope="col">Name</th>
              <th scope="col" className={styles.table_header}>
                {" "}
                Email
              </th>
              <th scope="col" className={styles.table_header}>
                {" "}
                Mobile
              </th>

              <th scope="col" className={styles.table_header}>
                {" "}
                Status{" "}
              </th>

              <th scope="col" className={styles.table_header}>
                {" "}
                Actions{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {filterEmp.map((x, i) => (
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
                  <div>{x.email}</div>
                </td>
                <td align="center">{x.phone}</td>

                {renderStatus(x.status)}

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
                        onClick={() => openUpdateModal(x._id)}
                      >
                        Update Employee
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        className={styles.drop}
                        onClick={() => openShiftModal(x._id)}
                      >
                        Assign Shift
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        className={styles.drop}
                        onClick={() => openUpShiftModal(x._id)}
                      >
                        Update Shift
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal  */}
      <Modal show={updateModal} onHide={closeUpdateModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update ({upEmp.name})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.update}>
            <label>
              Status:
              <select defaultValue={upEmp.status} onChange={handleStatus}>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </select>
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpdateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Shift Modal  */}
      <Modal show={shiftModal} onHide={closeShiftModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Shift</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p
            style={{
              color: "red",
              display: dpErr ? "block" : "none",
              marginLeft: "15px",
            }}
          >
            Already assigned in this day
          </p>
          <div className={styles.update}>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={date}
                onChange={handleDate}
                style={{ border: dpErr ? "1px solid red" : "" }}
              />
            </label>

            <label>
              Assign Shift:
              <select defaultValue="" onChange={handleShift}>
                <option value="">--select--</option>
                {shifts.map((shift) => (
                  <option key={shift._id} value={shift._id}>
                    {shift.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeShiftModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleShiftSubmit}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Shift  */}
      <Modal show={upShiftModal} onHide={closeUpShiftModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Shift</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.update}>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={date}
                onChange={handleDate}
              />
            </label>
            {empShift?._id ? (
              <label>
                Assign Shift:
                <select defaultValue={empShift._id} onChange={handleShift}>
                  {shifts.map((shift) => (
                    <option key={shift._id} value={shift._id}>
                      {shift.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpShiftModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleShiftUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
