import Auth from "@/components/Auth/Auth";
import SupAuth from "@/components/Auth/SupAuth";

export const metadata = {
  title: "Supervisor",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <Auth>
      <SupAuth>
        <div>{children}</div>
      </SupAuth>
    </Auth>
  );
}
