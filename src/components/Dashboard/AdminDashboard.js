import { Container } from "react-bootstrap";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  return (
    <>
      <Container className="mt-5">
        <div className={styles.flexCont}>
          <div style={{ backgroundColor: "#F1C40F" }}>
            <p>Total Employee</p>
          </div>

          <div style={{ backgroundColor: "#F1C40F" }}>Total Supervisor</div>

          <div>Shifts</div>
        </div>
      </Container>
    </>
  );
}
