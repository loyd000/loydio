import { cookies } from "next/headers";
import AdminClient from "./AdminClient";
import LoginForm from "./LoginForm";

export default async function AdminPage() {
  const jar = await cookies();
  const isAuth = jar.get("admin_auth")?.value === "true";
  return isAuth ? <AdminClient /> : <LoginForm />;
}
