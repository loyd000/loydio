import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN ?? "";

const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${BASIC}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status}`);
  }

  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export async function GET() {
  // If no refresh token configured, return idle state gracefully
  if (!REFRESH_TOKEN) {
    return NextResponse.json({ isPlaying: false }, {
      headers: { "Cache-Control": "public, max-age=30" },
    });
  }

  try {
    const accessToken = await getAccessToken();

    const res = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    // 204 = nothing playing
    if (res.status === 204 || res.status > 400) {
      return NextResponse.json({ isPlaying: false }, {
        headers: { "Cache-Control": "public, max-age=30" },
      });
    }

    const song = await res.json() as {
      is_playing: boolean;
      item?: {
        name: string;
        artists: Array<{ name: string }>;
        album: {
          name: string;
          images: Array<{ url: string; width: number; height: number }>;
        };
        external_urls: { spotify: string };
        duration_ms: number;
      };
      progress_ms?: number;
    };

    if (!song.item || !song.is_playing) {
      return NextResponse.json({ isPlaying: false }, {
        headers: { "Cache-Control": "public, max-age=30" },
      });
    }

    return NextResponse.json(
      {
        isPlaying: true,
        title: song.item.name,
        artist: song.item.artists.map((a) => a.name).join(", "),
        album: song.item.album.name,
        albumArt: song.item.album.images[0]?.url ?? null,
        songUrl: song.item.external_urls.spotify,
        progress: song.progress_ms ?? 0,
        duration: song.item.duration_ms,
      },
      { headers: { "Cache-Control": "public, max-age=30" } }
    );
  } catch {
    return NextResponse.json({ isPlaying: false }, {
      headers: { "Cache-Control": "public, max-age=30" },
    });
  }
}
