export const formatDateTimeUtc = (dateStr: string): string => {
  // Parse naive timestamps as UTC to avoid browser local timezone shifts.
  const normalized = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
  const hasTimezone = /([zZ]|[+-]\d{2}:\d{2})$/.test(normalized);
  const input = hasTimezone ? normalized : `${normalized}Z`;

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const second = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

export const parseDateTimeUtcMs = (dateStr: string): number | null => {
  const normalized = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
  const hasTimezone = /([zZ]|[+-]\d{2}:\d{2})$/.test(normalized);
  const input = hasTimezone ? normalized : `${normalized}Z`;

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.getTime();
};
