"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(_prev: unknown, formData: FormData) {
  const password = formData.get("password") as string;
  if (password === process.env.ADMIN_PASSWORD) {
    const jar = await cookies();
    jar.set("admin_auth", "true", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    redirect("/admin");
  }
  return { error: "Invalid password" };
}

export async function logout() {
  const jar = await cookies();
  jar.delete("admin_auth");
  redirect("/admin");
}
