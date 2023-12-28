import Auth from "@/components/Auth/Auth";
import SupAuth from "@/components/Auth/SupAuth";
import SuperNav from "@/components/Navbar/SuperNav";

export const metadata = {
  title: "Supervisor",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <Auth>
      <SupAuth>
        <div>
          <SuperNav />
        </div>
        <div>{children}</div>
      </SupAuth>
    </Auth>
  );
}
