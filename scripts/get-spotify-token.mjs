/**
 * Run this ONCE to get a Spotify refresh token.
 * 
 * Steps:
 * 1. Add http://localhost:3000/callback as a Redirect URI in your Spotify Developer Dashboard
 * 2. Open this URL in your browser:
 *    https://accounts.spotify.com/authorize?client_id=d2846741d0544467a238030fea73ba58&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=user-read-currently-playing%20user-read-playback-state
 * 3. Spotify will redirect you to http://localhost:3000/callback?code=XXXX
 * 4. Copy the `code` value from the URL and paste it below as AUTH_CODE
 * 5. Run: node scripts/get-spotify-token.mjs
 * 6. Copy the refresh_token from the output into .env.local as SPOTIFY_REFRESH_TOKEN
 */

const CLIENT_ID = "d2846741d0544467a238030fea73ba58";
const CLIENT_SECRET = "aba6b3d264c84c94abb999782d671a6c";
const REDIRECT_URI = "http://localhost:3000/callback";

// ← PASTE YOUR CODE HERE after step 3
const AUTH_CODE = "";

if (!AUTH_CODE) {
  console.log("\n🎵 Spotify Token Setup\n");
  console.log("1. Open this URL in your browser:");
  console.log(
    `\nhttps://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent("user-read-currently-playing user-read-playback-state")}\n`
  );
  console.log("2. After authorizing, copy the ?code= value from the redirect URL");
  console.log("3. Paste it as AUTH_CODE in this file and run again.\n");
  process.exit(0);
}

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

const res = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${basic}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code: AUTH_CODE,
    redirect_uri: REDIRECT_URI,
  }),
});

const data = await res.json();

if (data.error) {
  console.error("❌ Error:", data.error, data.error_description);
  process.exit(1);
}

console.log("\n✅ Success! Add this to your .env.local:\n");
console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
