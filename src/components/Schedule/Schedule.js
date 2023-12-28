"use client";
import styles from "./Schedule.module.css";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Schedule() {
  const [data, setData] = useState([]);
  const [sup, setSup] = useState({});
  const getSchedule = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/getschedule`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => console.log(e));
  };

  const getSupervisor = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/empsup`, {
        withCredentials: true,
      })
      .then((res) => {
        setSup(res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getSchedule();
    getSupervisor();
  }, []);

  const strToTime = (date) => {
    const d = new Date(date);
    const formattedTime = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedTime;
  };
  const strToDate = (date) => {
    const d = new Date(date);
    const formattedTime = d.toLocaleDateString("en-Us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return formattedTime;
  };

  return (
    <div className="container pt-5">
      <div className="row mt-2 mr-1">
        <div className="col">
          <p className={styles.title}>Your Schedule</p>
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
              <th scope="col">Date</th>
              <th scope="col" className={styles.table_header}>
                {" "}
                Shift Name
              </th>
              <th scope="col" className={styles.table_header}>
                {" "}
                Start Time
              </th>
              <th scope="col" className={styles.table_header}>
                End Time
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((x, i) => (
              <tr key={x._id}>
                <th scope="row">{i + 1}</th>
                <td
                  style={{
                    color: "#1B7FA6",
                    fontSize: "16px",
                  }}
                >
                  {strToDate(x.date)}
                  <br />
                </td>
                <td align="center">
                  <div>{x.shiftId.name}</div>
                </td>
                <td align="center">{strToTime(x.shiftId.start)}</td>

                <td align="center">{strToTime(x.shiftId.end)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supervisor */}
      {sup ? (
        <>
          <div className="row mt-2 mr-1">
            <div className="col">
              <p className={styles.title}>Your Supervisor</p>
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
                  <th scope="col">Name</th>
                  <th scope="col" className={styles.table_header}>
                    {" "}
                    Mobile
                  </th>
                  <th scope="col" className={styles.table_header}>
                    {" "}
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      color: "#1B7FA6",
                      fontSize: "16px",
                    }}
                  >
                    {sup.name}
                    <br />
                  </td>
                  <td align="center">
                    <div>{sup.phone}</div>
                  </td>
                  <td align="center">{sup.email}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
