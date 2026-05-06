import { createClient } from "@supabase/supabase-js";

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  year: string;
  link: string | null;
  image_url: string | null;
  images: string[];
  type: "dev" | "design";
  created_at: string;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
