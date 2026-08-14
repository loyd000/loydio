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
  sort_order: number;
  created_at: string;
};



export type GalleryPhoto = {
  id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.");
}

export const supabase = createClient(
  supabaseUrl ?? "",
  supabaseKey ?? ""
);
