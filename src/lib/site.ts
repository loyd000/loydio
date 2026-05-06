export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loyd.dev";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
