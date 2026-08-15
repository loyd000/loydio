import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function serverSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase env vars not set");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** POST /api/visits — atomically increments visit count for unique visits with 24h deduplication cookie */
export async function POST(req: NextRequest) {
  try {
    const db = serverSupabase();
    const alreadyCounted = req.cookies.get("loyd_visit_counted");

    // If already counted within the 24h cookie window, return current count without incrementing
    if (alreadyCounted) {
      const { data, error } = await db
        .from("site_stats")
        .select("visits")
        .eq("id", "global")
        .single();

      const visits = error ? 0 : (data as { visits: number }).visits ?? 0;
      return NextResponse.json(
        { visits, incremented: false },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    // Call the RPC function that increments and returns the new count
    const { data, error } = await db.rpc("increment_visits");

    if (error) {
      console.error("[visits] RPC error:", error.message);
      return NextResponse.json({ visits: 0 }, { status: 500 });
    }

    const response = NextResponse.json(
      { visits: data as number, incremented: true },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );

    // Set 24-hour deduplication cookie
    response.cookies.set("loyd_visit_counted", "1", {
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    });

    return response;
  } catch (err) {
    console.error("[visits] Unexpected error:", err);
    return NextResponse.json({ visits: 0 }, { status: 500 });
  }
}

/** GET /api/visits — read current count without incrementing */
export async function GET() {
  try {
    const db = serverSupabase();

    const { data, error } = await db
      .from("site_stats")
      .select("visits")
      .eq("id", "global")
      .single();

    if (error) {
      console.error("[visits] GET error:", error.message);
      return NextResponse.json({ visits: 0 }, { status: 500 });
    }

    return NextResponse.json(
      { visits: (data as { visits: number }).visits ?? 0 },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[visits] Unexpected error:", err);
    return NextResponse.json({ visits: 0 }, { status: 500 });
  }
}
