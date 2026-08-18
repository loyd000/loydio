import { supabase } from "@/lib/supabase";
import CertificationsClient from "./CertificationsClient";

export const revalidate = 60;

export default async function CertificationsPage() {
  const { data: certifications, error } = await supabase
    .from("credentials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch certifications:", error);
  }

  return <CertificationsClient initialCertifications={certifications ?? []} />;
}
