async function fetchEvents() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    throw new Error("Missing GOOGLE_CALENDAR_ID");
  }
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY");
  }

  const url =
    "https://www.googleapis.com/calendar/v3/calendars/" +
    encodeURIComponent(calendarId) +
    "/events?singleEvents=true&orderBy=startTime&key=" +
    encodeURIComponent(apiKey);

  const res = await fetch(url, { cache: "no-store" });
  return res.json();
}

export async function GET() {
  const data = await fetchEvents();
  return Response.json(data);
}
