import { NextRequest, NextResponse } from "next/server";
import SunCalc from "suncalc";

export const runtime = "edge";

// Read Vercel-provided geo headers (or fallbacks) and decide whether it's
// daytime at the user's location right now. Used by the SunTheme client
// component to flip light/dark automatically when the user has not picked
// a theme manually.
export async function GET(req: NextRequest) {
  const lat = parseFloat(
    req.headers.get("x-vercel-ip-latitude") ??
      req.headers.get("x-latitude") ??
      "",
  );
  const lon = parseFloat(
    req.headers.get("x-vercel-ip-longitude") ??
      req.headers.get("x-longitude") ??
      "",
  );

  const now = new Date();

  // Default fallback when geo headers are missing (local dev, certain ISPs).
  // We pretend it's the user's local clock and use 6:00–20:00 as "daytime".
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    const hours = now.getUTCHours(); // we don't know offset; UTC is best guess
    const isDay = hours >= 6 && hours < 20;
    return NextResponse.json(
      {
        theme: isDay ? "light" : "dark",
        source: "fallback-utc",
        lat: null,
        lon: null,
      },
      { headers: { "cache-control": "public, max-age=600" } },
    );
  }

  const times = SunCalc.getTimes(now, lat, lon);
  const isDay = now >= times.sunrise && now < times.sunset;

  return NextResponse.json(
    {
      theme: isDay ? "light" : "dark",
      source: "geo",
      lat,
      lon,
      sunrise: times.sunrise.toISOString(),
      sunset: times.sunset.toISOString(),
      now: now.toISOString(),
    },
    { headers: { "cache-control": "public, max-age=300" } },
  );
}
