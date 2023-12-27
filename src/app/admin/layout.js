import Auth from "@/components/Auth/Auth";
import AdminAuth from "@/components/Auth/AdminAuth";
import AdminNav from "@/components/Navbar/AdminNav.js";

export const metadata = {
  title: "Administrator",
  description: "",
};

export default function AdminLayout({ children }) {
  return (
    <>
      <Auth>
        <AdminAuth>
          <div>
            <AdminNav />
          </div>
          <div style={{ paddingTop: "50px" }}>{children}</div>
        </AdminAuth>
      </Auth>
    </>
  );
}
