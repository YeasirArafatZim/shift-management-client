import Auth from "@/components/Auth/Auth";
import AdminAuth from "@/components/Auth/AdminAuth";

export const metadata = {
  title: "Administrator",
  description: "",
};

export default function AdminLayout({ children }) {
  return (
    <Auth>
      <AdminAuth>
        <div>{children}</div>
      </AdminAuth>
    </Auth>
  );
}
