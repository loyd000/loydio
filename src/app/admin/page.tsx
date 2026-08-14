import AdminClient from "./AdminClient";
import LoginForm from "./LoginForm";
import { fetchAdminData, isAdminAuthenticated } from "./actions";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) return <LoginForm />;

  let initialData: Awaited<ReturnType<typeof fetchAdminData>> = { projects: [], photos: [] };
  let initialError = "";

  try {
    initialData = await fetchAdminData();
  } catch (error) {
    initialError = errorMessage(error);
  }

  return <AdminClient initialData={initialData} initialError={initialError} />;
}
