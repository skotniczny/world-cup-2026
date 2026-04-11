const locale = "en-GB";

const dateFormatter = new Intl.DateTimeFormat(locale, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat(locale, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function dateTimeFormatter(isoTimeString: string) {
  const date = new Date(isoTimeString);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${isoTimeString}`);
  }
  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
}

export { dateTimeFormatter };
