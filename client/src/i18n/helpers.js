export const getDateOnlyMs = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
};

export const toDateInputValue = (value) => {
  if (!value) return "";

  const date = new Date(value);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatLocaleDate = (value, language, emptyLabel) => {
  if (!value) return emptyLabel;

  const locale = language === "es" ? "es-MX" : "en-US";
  const dateMs = getDateOnlyMs(value);

  return new Date(dateMs).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const formatMoney = (value, t, language = "en") => {
  const locale = language === "es" ? "es-MX" : "en-US";
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number(value || 0));

  return `$${formatted} ${t("common.currency")}`;
};

export const getBudgetCategories = (t) => [
  { value: "venue", label: t("budget.categories.venue") },
  { value: "photography", label: t("budget.categories.photography") },
  { value: "dress", label: t("budget.categories.dress") },
  { value: "honeymoon", label: t("budget.categories.honeymoon") },
  { value: "decoration", label: t("budget.categories.decoration") },
  { value: "chorus", label: t("budget.categories.chorus") },
  { value: "getReadyBride", label: t("budget.categories.getReadyBride") },
  { value: "cake", label: t("budget.categories.cake") },
  { value: "snacks", label: t("budget.categories.snacks") },
  { value: "sweets", label: t("budget.categories.sweets") },
  { value: "waiterTips", label: t("budget.categories.waiterTips") },
  { value: "tableNumbers", label: t("budget.categories.tableNumbers") },
  { value: "alcohol", label: t("budget.categories.alcohol") },
  { value: "favors", label: t("budget.categories.favors") },
  { value: "centerpieces", label: t("budget.categories.centerpieces") },
  { value: "florals", label: t("budget.categories.florals") },
  { value: "sweetheartTable", label: t("budget.categories.sweetheartTable") },
  { value: "other", label: t("budget.categoryOther") },
];

export const getBudgetSubcategories = (t) => ({
  honeymoon: [
    { value: "Hotel", label: t("budget.subcategories.hotel") },
    { value: "Transportation", label: t("budget.subcategories.transportation") },
    { value: "Extras", label: t("budget.subcategories.extras") },
  ],
  getReadyBride: [
    { value: "Makeup and Hair", label: t("budget.subcategories.makeupAndHair") },
    { value: "Veil", label: t("budget.subcategories.veil") },
    { value: "Jewelry", label: t("budget.subcategories.jewelry") },
    { value: "Shoes", label: t("budget.subcategories.shoes") },
    { value: "Hair Accessories", label: t("budget.subcategories.hairAccessories") },
    { value: "Robe", label: t("budget.subcategories.robe") },
    { value: "Bouquet", label: t("budget.subcategories.bouquet") },
    { value: "Emergency Kit", label: t("budget.subcategories.emergencyKit") },
  ],
});

export const findBudgetCategoryLabel = (t, value) =>
  getBudgetCategories(t).find((item) => item.value === value)?.label ||
  t("budget.categoryOther");

export const findBudgetSubcategoryLabel = (t, category, value) => {
  const subcategories = getBudgetSubcategories(t)[category] || [];
  return subcategories.find((item) => item.value === value)?.label || value;
};

export const getBudgetStatusConfig = (t) => ({
  pending: {
    label: t("status.pending"),
    className: "bg-yellow-100 text-yellow-700",
  },
  advancePayment: {
    label: t("status.advancePayment"),
    className: "bg-blue-100 text-blue-700",
  },
  paid: {
    label: t("status.paid"),
    className: "bg-green-100 text-green-700",
  },
});

export const getHoneymoonCategories = (t) => [
  { value: "hotel", label: t("honeymoon.categories.hotel"), icon: "🏨" },
  { value: "flight", label: t("honeymoon.categories.flight"), icon: "✈️" },
  {
    value: "transportation",
    label: t("honeymoon.categories.transportation"),
    icon: "🚗",
  },
  { value: "activities", label: t("honeymoon.categories.activities"), icon: "🌅" },
  { value: "food", label: t("honeymoon.categories.food"), icon: "🍽️" },
  { value: "documents", label: t("honeymoon.categories.documents"), icon: "📄" },
  { value: "shopping", label: t("honeymoon.categories.shopping"), icon: "🛍️" },
  { value: "other", label: t("honeymoon.categories.other"), icon: "♡" },
];

export const findHoneymoonCategory = (t, value) =>
  getHoneymoonCategories(t).find((item) => item.value === value) ||
  getHoneymoonCategories(t).at(-1);

export const getHoneymoonStatusConfig = (t) => ({
  notPlanned: {
    label: t("honeymoon.status.notPlanned"),
    className: "bg-gray-100 text-gray-600",
  },
  planned: {
    label: t("honeymoon.status.planned"),
    className: "bg-purple-100 text-purple-700",
  },
  booked: {
    label: t("honeymoon.status.booked"),
    className: "bg-blue-100 text-blue-700",
  },
  advancePaid: {
    label: t("honeymoon.status.advancePaid"),
    className: "bg-amber-100 text-amber-700",
  },
  paid: {
    label: t("status.paid"),
    className: "bg-green-100 text-green-700",
  },
});

export const getTimelineTypeConfig = (t) => ({
  planning: {
    label: t("timeline.types.planning"),
    icon: "📝",
    color: "bg-[#fff0f3] text-[#660033]",
  },
  weddingDay: {
    label: t("timeline.types.weddingDay"),
    icon: "💍",
    color: "bg-[#f3ebff] text-[#8258ff]",
  },
  honeymoon: {
    label: t("timeline.types.honeymoon"),
    icon: "✈️",
    color: "bg-[#eef6ff] text-[#2563eb]",
  },
});

export const getTimelineStatusConfig = (t) => ({
  pending: {
    label: t("status.pending"),
    className: "bg-yellow-100 text-yellow-700",
  },
  inProgress: {
    label: t("status.inProgress"),
    className: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: t("timeline.status.completed"),
    className: "bg-green-100 text-green-700",
  },
  cancelled: {
    label: t("timeline.status.cancelled"),
    className: "bg-red-100 text-red-700",
  },
});

export const getTimelinePriorityConfig = (t) => ({
  low: t("timeline.priority.low"),
  medium: t("timeline.priority.medium"),
  high: t("timeline.priority.high"),
});

export const getTimelineSignals = (t) => ({
  late: {
    label: t("timeline.signals.late"),
    className: "bg-red-100 text-red-700",
  },
  comingSoon: {
    label: t("timeline.signals.comingSoon"),
    className: "bg-amber-100 text-amber-700",
  },
});

export const getGuestStatusConfig = (t) => ({
  pending: {
    label: t("status.pending"),
    message: t("guests.statusMessages.pending"),
    className: "bg-yellow-50 text-black-700",
  },
  confirmed: {
    label: t("status.confirmed"),
    message: t("guests.statusMessages.confirmed"),
    className: "bg-green-50 text-green-700",
  },
  declined: {
    label: t("status.declined"),
    message: t("guests.statusMessages.declined"),
    className: "bg-red-100 text-red-700",
  },
  maybe: {
    label: t("guests.notSure"),
    message: t("guests.statusMessages.maybe"),
    className: "bg-blue-50 text-black-700",
  },
});

export const getGuestSideConfig = (t) => ({
  bride: {
    label: t("guests.sideBride"),
    className: "bg-rose-100 text-black-700",
  },
  groom: {
    label: t("guests.sideGroom"),
    className: "bg-blue-50 text-black-700",
  },
  both: {
    label: t("guests.sideBoth"),
    className: "bg-amber-50 text-black-700",
  },
});

export const SWEETHEART_TABLE_NAME = "Sweetheart Table";

export const getTableDisplayName = (t, name) => {
  if (name === SWEETHEART_TABLE_NAME) {
    return t("tables.names.sweetheart");
  }

  const match = /^Table (\d+)$/.exec(name);

  if (match) {
    const key = `tables.names.table${match[1]}`;
    const translated = t(key);
    return translated === key ? name : translated;
  }

  return name;
};

export const getDefaultTableLabels = (t) => [
  { name: "Table 1", label: t("tables.labels.family"), order: 1 },
  { name: "Table 2", label: t("tables.labels.friends"), order: 2 },
  { name: "Table 3", label: t("tables.labels.brideSide"), order: 3 },
  { name: "Table 4", label: t("tables.labels.groomSide"), order: 4 },
  { name: "Table 5", label: t("tables.labels.family"), order: 5 },
  { name: "Table 6", label: t("tables.labels.friends"), order: 6 },
  { name: "Sweetheart Table", label: t("tables.labels.brideAndGroom"), order: 7 },
];

export const getNextRegularTableConfig = (t, regularTables) => {
  const tableNumbers = regularTables
    .map((table) => /^Table (\d+)$/.exec(table.name)?.[1])
    .filter(Boolean)
    .map(Number);
  const nextNumber = tableNumbers.length ? Math.max(...tableNumbers) + 1 : 1;
  const nextOrder =
    regularTables.reduce((max, table) => Math.max(max, table.order ?? 0), 0) + 1;

  return {
    name: `Table ${nextNumber}`,
    label: t("tables.labels.newTable"),
    order: nextOrder,
  };
};

export const getTableLabelOptions = (t) => [
  { value: "family", label: t("tables.labels.family") },
  { value: "friends", label: t("tables.labels.friends") },
  { value: "brideSide", label: t("tables.labels.brideSide") },
  { value: "groomSide", label: t("tables.labels.groomSide") },
  { value: "specialGuests", label: t("tables.labels.specialGuests") },
  { value: "brideAndGroom", label: t("tables.labels.brideAndGroom") },
  { value: "newTable", label: t("tables.labels.newTable") },
  { value: "custom", label: t("tables.labels.custom") },
];

export const resolveTableLabelValue = (label, options) => {
  if (!label) return "custom";

  const match = options.find((option) => option.label === label);
  return match ? match.value : "custom";
};

export const resolveTableLabelText = (value, customLabel, options) => {
  if (value === "custom") {
    return customLabel.trim();
  }

  return options.find((option) => option.value === value)?.label || customLabel.trim();
};

export const parseTableNumber = (name) => {
  const match = /^Table (\d+)$/.exec(name || "");
  return match ? Number(match[1]) : "";
};

export const getWeddingHubBlessings = (t) => [
  {
    title: t("weddingHub.blessings.0.title"),
    text: t("weddingHub.blessings.0.text"),
    source: t("weddingHub.blessings.0.source"),
  },
  {
    title: t("weddingHub.blessings.1.title"),
    text: t("weddingHub.blessings.1.text"),
    source: t("weddingHub.blessings.1.source"),
  },
  {
    title: t("weddingHub.blessings.2.title"),
    text: t("weddingHub.blessings.2.text"),
    source: t("weddingHub.blessings.2.source"),
  },
  {
    title: t("weddingHub.blessings.3.title"),
    text: t("weddingHub.blessings.3.text"),
    source: t("weddingHub.blessings.3.source"),
  },
];

const timelineSeedTemplate = [
  { id: "sacraments", type: "planning", category: "church", priority: "high", order: 1, notes: true },
  { id: "premarital", type: "planning", category: "church", priority: "high", order: 2 },
  { id: "hotelExplore", type: "planning", category: "honeymoon", priority: "medium", order: 3 },
  { id: "photography", type: "planning", category: "vendors", priority: "high", order: 4 },
  { id: "dress", type: "planning", category: "bride", priority: "high", order: 5 },
  { id: "getReady", type: "planning", category: "bride", priority: "medium", order: 6 },
  { id: "decoration", type: "planning", category: "decor", priority: "high", order: 7, notes: true },
  { id: "groomSuit", type: "planning", category: "groom", priority: "medium", order: 8 },
  { id: "rsvp", type: "planning", category: "guests", priority: "high", order: 9 },
  { id: "seating", type: "planning", category: "guests", priority: "high", order: 10 },
  { id: "confirmation", type: "planning", category: "guests", priority: "high", order: 11 },
  { id: "guestCount", type: "planning", category: "venue", priority: "high", order: 12 },
  { id: "walkthrough", type: "planning", category: "venue", priority: "medium", order: 13 },
  { id: "venuePayments", type: "planning", category: "budget", priority: "high", order: 14 },
  { id: "emergencyKit", type: "planning", category: "details", priority: "medium", order: 15 },
  { id: "vendors", type: "planning", category: "vendors", priority: "high", order: 16 },
  { id: "wdGetReady", type: "weddingDay", category: "bride", priority: "high", time: "10:00", order: 1 },
  { id: "brideLeaves", type: "weddingDay", category: "logistics", priority: "high", time: "12:45", order: 2 },
  { id: "groomArrival", type: "weddingDay", category: "groom", priority: "high", time: "13:15", order: 3 },
  { id: "guestArrival", type: "weddingDay", category: "guests", priority: "medium", time: "13:30", order: 4 },
  { id: "mass", type: "weddingDay", category: "church", priority: "high", time: "14:00", order: 5 },
  { id: "photos", type: "weddingDay", category: "photos", priority: "high", time: "15:00", order: 6, notes: true },
  { id: "transfer", type: "weddingDay", category: "logistics", priority: "medium", time: "15:50", order: 7 },
  { id: "receptionOpens", type: "weddingDay", category: "reception", priority: "medium", time: "16:00", order: 8 },
  { id: "newlywedsArrival", type: "weddingDay", category: "reception", priority: "high", time: "16:30", order: 9 },
  { id: "meal", type: "weddingDay", category: "reception", priority: "high", time: "17:00", order: 10 },
  { id: "party", type: "weddingDay", category: "party", priority: "medium", time: "18:00", order: 11 },
  { id: "cake", type: "weddingDay", category: "reception", priority: "medium", time: "19:00", order: 12 },
  { id: "bouquet", type: "weddingDay", category: "tradition", priority: "medium", time: "19:30", order: 13 },
  { id: "finalPhotos", type: "weddingDay", category: "photos", priority: "medium", time: "20:30", order: 14 },
  { id: "departure", type: "weddingDay", category: "logistics", priority: "high", time: "21:00", order: 15 },
];

export const getTimelineSeedItems = (t) =>
  timelineSeedTemplate.map((item) => {
    const notesKey = `timeline.seedItems.${item.id}.notes`;
    const notes = item.notes ? t(notesKey) : undefined;

    return {
      title: t(`timeline.seedItems.${item.id}.title`),
      type: item.type,
      category: item.category,
      status: "pending",
      priority: item.priority,
      order: item.order,
      ...(item.time ? { time: item.time } : {}),
      ...(notes && notes !== notesKey ? { notes } : {}),
    };
  });

export const getTimelineCategoryLabel = (t, category) =>
  t(`timeline.categories.${category}`) === `timeline.categories.${category}`
    ? category
    : t(`timeline.categories.${category}`);

const TIMELINE_TYPE_RANK = {
  planning: 0,
  honeymoon: 1,
  weddingDay: 2,
};

const parseTimelineTimeToMinutes = (time) => {
  if (!time) return null;

  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

const getTimelineSortMeta = (item) => {
  const hasDate = Boolean(item.date);
  const dateMs = hasDate ? getDateOnlyMs(item.date) : null;

  return {
    hasDate,
    dateMs,
    timeMinutes: parseTimelineTimeToMinutes(item.time),
    typeOrder: TIMELINE_TYPE_RANK[item.type] ?? 0,
    createdAt: item.createdAt ? new Date(item.createdAt).getTime() : 0,
    id: item.id ?? 0,
  };
};

export const compareTimelineItems = (a, b) => {
  const metaA = getTimelineSortMeta(a);
  const metaB = getTimelineSortMeta(b);

  if (metaA.hasDate && metaB.hasDate) {
    if (metaA.dateMs !== metaB.dateMs) {
      return metaA.dateMs - metaB.dateMs;
    }

    const timeA = metaA.timeMinutes ?? Number.MAX_SAFE_INTEGER;
    const timeB = metaB.timeMinutes ?? Number.MAX_SAFE_INTEGER;

    if (timeA !== timeB) {
      return timeA - timeB;
    }

    return metaA.id - metaB.id;
  }

  if (metaA.hasDate) return -1;
  if (metaB.hasDate) return 1;

  if (a.type === "weddingDay" && b.type === "weddingDay") {
    const timeA = metaA.timeMinutes ?? Number.MAX_SAFE_INTEGER;
    const timeB = metaB.timeMinutes ?? Number.MAX_SAFE_INTEGER;

    if (timeA !== timeB) {
      return timeA - timeB;
    }
  } else if (metaA.typeOrder !== metaB.typeOrder) {
    return metaA.typeOrder - metaB.typeOrder;
  }

  const orderDiff = (a.order || 0) - (b.order || 0);

  if (orderDiff !== 0) {
    return orderDiff;
  }

  if (metaA.createdAt !== metaB.createdAt) {
    return metaA.createdAt - metaB.createdAt;
  }

  return metaA.id - metaB.id;
};

export const sortTimelineItems = (items) => [...items].sort(compareTimelineItems);
