import Auth from "@/components/Auth/Auth";
import EmployeeAuth from "@/components/Auth/EmployeeAuth";
import EmployeeNav from "@/components/Navbar/EmployeeNav";

export const metadata = {
  title: "Employee",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <Auth>
      <EmployeeAuth>
        <div>
          <EmployeeNav />
        </div>
        <div>{children}</div>
      </EmployeeAuth>
    </Auth>
  );
}
