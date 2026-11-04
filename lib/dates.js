export const TZ = "America/Los_Angeles";

// "2026-10-17" + "08:00" -> "2026-10-17T08:00:00-07:00", using the Pacific offset on that date
export function isoLocal(date, time = "00:00") {
  const probe = new Date(`${date}T12:00:00Z`);
  const off = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" })
    .formatToParts(probe).find((p) => p.type === "timeZoneName").value.replace("GMT", "");
  return `${date}T${time}:00${off || "+00:00"}`;
}

export function fmt(date, opts) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...opts }).format(new Date(`${date}T00:00:00Z`));
}
