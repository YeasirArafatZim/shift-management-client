"use client";
import styles from "./Employees.module.css";
import { Dropdown } from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";
import { CgMoreVerticalO } from "react-icons/cg";
import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filterEmp, setFilterEmp] = useState(employees);
  const [filter, setFilter] = useState({
    userRole: "",
    status: "",
  });
  const [updateModal, setUpdateModal] = useState(false);
  const [upEmp, setUpEmp] = useState({});
  const [userRole, setUserRole] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const categories = ["Administrator", "Supervisor", "Employee"];
  const status = ["Active", "Pending"];

  const fetchEmployee = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee`)
      .then((res) => {
        setEmployees(res.data);
        setFilterEmp(res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const delEmp = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/${id}`)
      .then((res) => {
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        setFilterEmp((prev) => prev.filter((emp) => emp._id !== id));
      })
      .catch((e) => console.log(e));
  };

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

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFilter = () => {
    if (filter.userRole != "" && filter.status != "") {
      const filEmp = employees.filter(
        (emp) => emp.role == filter.userRole && emp.status == filter.status
      );
      console.log(1);
      setFilterEmp(filEmp);
    } else if (filter.userRole != "") {
      const filEmp = employees.filter((emp) => emp.role == filter.userRole);
      setFilterEmp(filEmp);
      console.log(2);
    } else if (filter.status != "") {
      const filEmp = employees.filter((emp) => emp.status == filter.status);
      setFilterEmp(filEmp);
      console.log(3);
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
    setUserRole("");
    setUserStatus("");
    fetchEmployee();
  };

  const handleStatus = (e) => {
    e.preventDefault();
    setUserStatus(e.target.value);
  };

  const handleRole = (e) => {
    e.preventDefault();
    setUserRole(e.target.value);
  };

  const handleSubmit = () => {
    if (userRole && userStatus != "") {
      axios
        .patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/${upEmp._id}`, {
          role: userRole,
          status: userStatus,
        })
        .then((res) => closeUpdateModal())
        .catch((e) => console.log(e));
    } else if (userRole != "") {
      axios
        .patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/${upEmp._id}`, {
          role: userRole,
        })
        .then((res) => closeUpdateModal())
        .catch((e) => console.log(e));
    } else if (userStatus != "") {
      axios
        .patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee/${upEmp._id}`, {
          status: userStatus,
        })
        .then((res) => closeUpdateModal())
        .catch((e) => console.log(e));
    }
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
        <div className="col">
          <p
            style={{
              fontSize: "16px",
              margin: 0,
              color: "black",
            }}
          >
            Role
          </p>
          <select
            name="userRole"
            id="userRole"
            className={styles.drop_down}
            onChange={handleChange}
          >
            <option value="">All</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

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
            onChange={handleChange}
          >
            <option value="">All</option>
            {status.map((x, i) => (
              <option key={i} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div
          className="col pr-0"
          style={{
            marginTop: "25px",
          }}
        >
          <input
            type="button"
            className={`btn ${styles.btn_custom} ${styles.btnList}`}
            onClick={handleFilter}
            value="Filter"
          />
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
                Role{" "}
              </th>
              <th scope="col" className={styles.table_header}>
                {" "}
                Status{" "}
              </th>
              {/* <th scope="col" className={styles.table_header}>
                {" "}
                Supervisor{" "}
              </th> */}
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

                <td align="center">{x.role}</td>

                {renderStatus(x.status)}

                {/* <td align="center">  </td> */}

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
                        onClick={() => delEmp(x._id)}
                      >
                        Delete Employee
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
              Role:
              <select defaultValue={upEmp.role} onChange={handleRole}>
                <option value="Administrator">Administrator</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Employee">Employee</option>
              </select>
            </label>
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
    </div>
  );
}
