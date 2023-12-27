import Auth from "@/components/Auth/Auth";
import EmployeeAuth from "@/components/Auth/EmployeeAuth";

export const metadata = {
  title: "Employee",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <Auth>
      <EmployeeAuth>
        <div>{children}</div>
      </EmployeeAuth>
    </Auth>
  );
}
