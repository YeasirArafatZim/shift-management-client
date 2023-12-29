import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const temp = [{ _id: 1, name: "first", start: "12", end: "8" }];

  const [sups, setSups] = useState([]);
  const [emps, setEmps] = useState([]);
  const getSupervisors = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/getsups`, {
        withCredentials: true,
      })
      .then((res) => {
        setSups(res.data);
      })
      .catch((e) => console.log(e));
  };
  const getEmps = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/employee`, {
        withCredentials: true,
      })
      .then((res) => {
        setEmps(res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getSupervisors();
    getEmps();
  }, []);

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

  const renderTableRow = (supId) => {
    const filEmp = emps.filter((emp) => emp?.supervisor?.id === supId);
    return filEmp.map((x, i) => (
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

        <td align="center">{renderStatus(x.status)}</td>
      </tr>
    ));
  };

  return (
    <div className="container pt-3">
      <div className="row mr-1">
        <div className="col">
          <p className={styles.title}>Supervisors with their Employees</p>
        </div>
      </div>
      {sups.map((sup) => (
        <div key={sup._id}>
          <div className="row mt-2 mr-1">
            <div className="col">
              <p className={styles.title}>Supervisor: {sup.name}</p>
            </div>
          </div>
          <div className="table-responsive">
            <table
              className="table mb-0"
              style={{
                border: "1px solid #E5E4E2",
                backgroundColor: "white",
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>{renderTableRow(sup._id)}</tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
