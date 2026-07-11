const normalizeDateOnly = (date) => {
  if (!date) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Date(
    Date.UTC(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate(),
      12,
      0,
      0,
    ),
  );
};

const getDateOnlyMs = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
};

module.exports = {
  normalizeDateOnly,
  getDateOnlyMs,
};
