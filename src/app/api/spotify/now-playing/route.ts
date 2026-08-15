import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN ?? "";

const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

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

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function GET() {
  if (!REFRESH_TOKEN || !CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json(
      { isPlaying: false },
      { headers: { "Cache-Control": "public, max-age=30" } }
    );
  }

  try {
    const accessToken = await getAccessToken();

    // 1. Check currently playing first
    const nowPlayingRes = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (nowPlayingRes.status === 200) {
      const song = (await nowPlayingRes.json()) as {
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

      if (song.item && song.is_playing) {
        return NextResponse.json(
          {
            isPlaying: true,
            isLastPlayed: false,
            title: song.item.name,
            artist: song.item.artists.map((a) => a.name).join(", "),
            album: song.item.album.name,
            albumArt: song.item.album.images[0]?.url ?? null,
            songUrl: song.item.external_urls.spotify,
            progress: song.progress_ms ?? 0,
            duration: song.item.duration_ms,
          },
          { headers: { "Cache-Control": "public, max-age=15" } }
        );
      }
    }

    // 2. If nothing currently playing, fetch most recently played track
    const recentlyPlayedRes = await fetch(RECENTLY_PLAYED_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (recentlyPlayedRes.status === 200) {
      const recentData = (await recentlyPlayedRes.json()) as {
        items?: Array<{
          track: {
            name: string;
            artists: Array<{ name: string }>;
            album: {
              name: string;
              images: Array<{ url: string; width: number; height: number }>;
            };
            external_urls: { spotify: string };
            duration_ms: number;
          };
          played_at: string;
        }>;
      };

      const recentItem = recentData.items?.[0];
      if (recentItem?.track) {
        return NextResponse.json(
          {
            isPlaying: false,
            isLastPlayed: true,
            title: recentItem.track.name,
            artist: recentItem.track.artists.map((a) => a.name).join(", "),
            album: recentItem.track.album.name,
            albumArt: recentItem.track.album.images[0]?.url ?? null,
            songUrl: recentItem.track.external_urls.spotify,
            playedAt: recentItem.played_at,
          },
          { headers: { "Cache-Control": "public, max-age=60" } }
        );
      }
    }

    return NextResponse.json(
      { isPlaying: false },
      { headers: { "Cache-Control": "public, max-age=30" } }
    );
  } catch (err) {
    console.error("[Spotify route error]", err);
    return NextResponse.json(
      { isPlaying: false },
      { headers: { "Cache-Control": "public, max-age=30" } }
    );
  }
}
