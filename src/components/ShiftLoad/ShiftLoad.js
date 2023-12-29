"use client";
import styles from "./ShiftLoad.module.css";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ShiftLoad() {
  const [employee, setEmployee] = useState([]);
  const [fltrEmp, setFltrEmp] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [filter, setFilter] = useState({
    date: "",
    shift: "",
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
  const fetchEmps = (date) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/fixedshiftemps`,
        { date: new Date(date) },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setEmployee(res.data);
        setFltrEmp(res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchShift();
  }, []);

  const handleDate = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name == "date") {
      fetchEmps(value);
      setFilter((prev) => ({
        ...prev,
        shift: "",
      }));
    }
  };
  const handleShift = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name == "shift" && value != "") {
      const temp = employee.filter((emp) => emp.shiftId == value);
      setFltrEmp(temp);
    } else {
      setFltrEmp(employee);
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
    <div className="container pt-5">
      {/* Filtering  */}
      <div className="row mt-4 mr-1">
        <div className="col">
          <p
            style={{
              fontSize: "16px",
              margin: 0,
              color: "black",
            }}
          >
            Date
          </p>
          <input
            type="date"
            name="date"
            value={filter.date}
            onChange={handleDate}
            className={styles.drop_down}
          />
        </div>
        <div className="col">
          <p
            style={{
              fontSize: "16px",
              margin: 0,
              color: "black",
            }}
          >
            Shift
          </p>
          <select
            name="shift"
            id="shift"
            value={filter.shift}
            onChange={handleShift}
            className={styles.drop_down}
          >
            <option value="">All</option>
            {shifts.map((shift) => (
              <option key={shift._id} value={shift._id}>
                {shift.name}
              </option>
            ))}
          </select>
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
            </tr>
          </thead>
          <tbody>
            {fltrEmp?.map((x, i) => (
              <tr key={x._id}>
                <th scope="row">{i + 1}</th>
                <td
                  style={{
                    color: "#1B7FA6",
                    fontSize: "16px",
                  }}
                >
                  {x.empId.name}
                  <br />
                </td>
                <td align="center">
                  <div>{x.empId.email}</div>
                </td>
                <td align="center">{x.empId.phone}</td>

                {renderStatus(x.empId.status)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
