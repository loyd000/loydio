import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET ?? "";
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN ?? "";

async function getAccessToken(): Promise<string> {
  const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
    cache: "no-store",
  });
  const data = await res.json();
  return data.access_token as string;
}

export async function GET() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return NextResponse.json({ isPlaying: false, error: "Spotify not configured" });
  }

  try {
    const token = await getAccessToken();

    // Try currently playing first
    const nowRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (nowRes.status === 200) {
      const data = await nowRes.json();
      if (data?.item) {
        return NextResponse.json({
          isPlaying: data.is_playing,
          title: data.item.name,
          artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
          albumArt: data.item.album.images[0]?.url ?? null,
          songUrl: data.item.external_urls?.spotify ?? null,
        });
      }
    }

    // Fallback: recently played
    const recentRes = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (recentRes.status === 200) {
      const data = await recentRes.json();
      const item = data?.items?.[0]?.track;
      if (item) {
        return NextResponse.json({
          isPlaying: false,
          title: item.name,
          artist: item.artists.map((a: { name: string }) => a.name).join(", "),
          albumArt: item.album.images[0]?.url ?? null,
          songUrl: item.external_urls?.spotify ?? null,
        });
      }
    }

    return NextResponse.json({ isPlaying: false });
  } catch {
    return NextResponse.json({ isPlaying: false, error: "Spotify fetch failed" });
  }
}
