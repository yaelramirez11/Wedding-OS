import { useEffect, useMemo, useState } from "react";

import { fetchTimelineItems } from "../services/timelineService";
import { fetchGuests } from "../services/guestService";
import { fetchBudgetItems } from "../services/budgetService";
import { fetchHoneymoonItems } from "../services/honeymoonService";
import { fetchTables } from "../services/tableService";
import { useTranslation } from "../context/PreferencesContext.jsx";
import {
  formatLocaleDate,
  formatMoney,
  getWeddingHubBlessings,
  sortTimelineItems,
} from "../i18n/helpers.js";

const WEDDING_DATE = new Date("2026-10-10T14:00:00");
const RELATIONSHIP_START_DATE = new Date("2024-08-08T00:00:00");

function ProgressRing({ value, label, sublabel }) {
  const safeValue = Math.min(100, Math.max(0, value || 0));

  return (
    <div className="rounded-[2rem] bg-[#fff8fa] border border-[#eadde2] p-5 flex items-center gap-4">
      <div
        className="h-24 w-24 rounded-full grid place-items-center shrink-0"
        style={{
          background: `conic-gradient(#660033 ${
            safeValue * 3.6
          }deg, #f3dfe6 0deg)`,
        }}
      >
        <div className="h-18 w-18 rounded-full bg-white grid place-items-center">
          <span className="text-xl font-bold text-[#660033]">{safeValue}%</span>
        </div>
      </div>

      <div>
        <p className="text-sm text-[#8d7380]">{label}</p>
        <p className="text-lg font-serif wos-text-heading mt-1">{sublabel}</p>
      </div>
    </div>
  );
}

function WeddingHubPage() {
  const { t, language } = useTranslation();
  const blessings = useMemo(() => getWeddingHubBlessings(t), [t]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [timelineItems, setTimelineItems] = useState([]);

  const [stats, setStats] = useState({
    totalGuests: 0,
    guestsConfirmed: 0,
    guestsPending: 0,
    totalTables: 0,
    tablesFull: 0,
    seatedGuests: 0,
    budgetTotal: 0,
    budgetPaid: 0,
    honeymoonTotal: 0,
    honeymoonPaid: 0,
  });

  useEffect(() => {
    loadHubData();
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = WEDDING_DATE - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateCountdown();

    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const loadHubData = async () => {
    try {
      const [timelineData, guests, budgetItems, honeymoonItems, tables] =
        await Promise.all([
          fetchTimelineItems(),
          fetchGuests(),
          fetchBudgetItems(),
          fetchHoneymoonItems(),
          fetchTables(),
        ]);

      setTimelineItems(timelineData);

      const guestsConfirmed = guests.filter(
        (guest) => guest.status === "confirmed",
      ).length;

      const guestsPending = guests.filter(
        (guest) => guest.status === "pending",
      ).length;

      const tablesFull = tables.filter(
        (table) => table.guests.length >= 10,
      ).length;

      const seatedGuests = tables.reduce(
        (sum, table) => sum + table.guests.length,
        0,
      );

      const budgetTotal = budgetItems.reduce((sum, item) => sum + item.cost, 0);

      const budgetPaid = budgetItems.reduce(
        (sum, item) => sum + item.advancePaid,
        0,
      );

      const honeymoonTotal = honeymoonItems.reduce(
        (sum, item) => sum + item.cost,
        0,
      );

      const honeymoonPaid = honeymoonItems.reduce(
        (sum, item) => sum + item.advancePaid,
        0,
      );

      setStats({
        totalGuests: guests.length,
        guestsConfirmed,
        guestsPending,
        totalTables: tables.length,
        tablesFull,
        seatedGuests,
        budgetTotal,
        budgetPaid,
        honeymoonTotal,
        honeymoonPaid,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const daysTogether = Math.floor(
    (new Date() - RELATIONSHIP_START_DATE) / (1000 * 60 * 60 * 24),
  );

  const countdownItems = [
    { label: t("weddingHub.days"), value: timeLeft.days },
    { label: t("weddingHub.hours"), value: timeLeft.hours },
    { label: t("weddingHub.minutes"), value: timeLeft.minutes },
    { label: t("weddingHub.seconds"), value: timeLeft.seconds },
  ];

  const dailyBlessing = blessings[new Date().getDate() % blessings.length];

  const upcomingTimelineItems = sortTimelineItems(
    timelineItems.filter((item) => item.status !== "completed"),
  );

  const nextTimelineItem = upcomingTimelineItems[0];

  const completedTimelineItems = timelineItems.filter(
    (item) => item.status === "completed",
  ).length;

  const timelineProgress =
    timelineItems.length === 0
      ? 0
      : Math.round((completedTimelineItems / timelineItems.length) * 100);

  const guestProgress =
    stats.totalGuests === 0
      ? 0
      : Math.round((stats.guestsConfirmed / stats.totalGuests) * 100);

  const tableProgress =
    stats.totalGuests === 0
      ? 0
      : Math.round((stats.seatedGuests / stats.totalGuests) * 100);

  const budgetProgress =
    stats.budgetTotal === 0
      ? 0
      : Math.round((stats.budgetPaid / stats.budgetTotal) * 100);

  const honeymoonProgress =
    stats.honeymoonTotal === 0
      ? 0
      : Math.round((stats.honeymoonPaid / stats.honeymoonTotal) * 100);

  const overallProgress = Math.round(
    (guestProgress +
      tableProgress +
      budgetProgress +
      honeymoonProgress +
      timelineProgress) /
      5,
  );

  const formatDate = (value) =>
    formatLocaleDate(value, language, t("honeymoon.noDateYet"));

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-[#fff0f3] via-[#fff8fa] to-[#f3edf8] border border-[#eadde2] p-8 lg:p-12">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/50" />
        <div className="absolute right-28 -bottom-32 h-96 w-96 rounded-full bg-[#f2c8d4]/35" />
        <div className="absolute left-[-120px] bottom-[-120px] h-72 w-72 rounded-full bg-[#f8e3ea]/60" />

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-end">
          <div>
            <p className="text-[#8d7380] text-sm font-medium mb-5">
              {t("weddingHub.eyebrow")}
            </p>

            <h1 className="wos-text-heading text-5xl lg:text-7xl font-semibold leading-[1.02] tracking-tight">
              {t("weddingHub.title")}
            </h1>

            <p className="wos-text-muted text-lg mt-6 leading-relaxed max-w-2xl">
              {t("weddingHub.subtitle")}
            </p>
          </div>

          <div className="rounded-[2.25rem] bg-white/70 border border-white p-6 shadow-[0_20px_60px_rgba(80,40,55,0.08)]">
            <p className="text-sm text-[#8d7380]">
              {t("weddingHub.overallProgress")}
            </p>

            <div
              className="mx-auto mt-5 h-44 w-44 rounded-full grid place-items-center"
              style={{
                background: `conic-gradient(#660033 ${
                  overallProgress * 3.6
                }deg, #f3dfe6 0deg)`,
              }}
            >
              <div className="h-32 w-32 rounded-full bg-white grid place-items-center text-center">
                <div>
                  <p className="text-4xl font-bold text-[#660033]">
                    {overallProgress}%
                  </p>
                  <p className="text-xs text-[#8d7380] mt-1">
                    {t("weddingHub.complete")}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#8d7380] mt-5 text-center">
              {t("weddingHub.progressBasis")}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {countdownItems.map((item) => (
          <div
            key={item.label}
            className="rounded-[2rem] bg-[#fff8fa] border border-[#eadde2] p-5 text-center shadow-[0_12px_35px_rgba(80,40,55,0.05)]"
          >
            <p className="text-5xl lg:text-6xl font-semibold text-[#660033] tracking-tight">
              {String(item.value).padStart(2, "0")}
            </p>

            <p className="text-sm text-[#8d7380] mt-3">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#660033] to-[#38131f] text-white p-8 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-white/10" />

          <div className="relative z-10">
            <p className="text-sm text-white/60">{t("weddingHub.loveStory")}</p>

            <h2 className="text-5xl font-serif mt-3">{daysTogether}</h2>

            <p className="text-white/70 mt-2">{t("weddingHub.daysTogether")}</p>

            <div className="mt-8 rounded-[2rem] bg-white/10 border border-white/10 p-5">
              <p className="text-sm font-semibold">
                {t("weddingHub.todaysBlessing")}
              </p>

              <h3 className="text-xl font-serif mt-3">{dailyBlessing.title}</h3>

              <p className="text-sm text-white/70 mt-2 leading-relaxed">
                {dailyBlessing.text}
              </p>

              <p className="text-xs text-white/45 mt-3">{dailyBlessing.source}</p>
            </div>
          </div>
        </div>

        <div className="wos-card rounded-[2.5rem] p-6 lg:p-8 border border-[#eadde2]">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-sm text-[#8d7380]">{t("weddingHub.untilIDo")}</p>

              <h2 className="text-4xl lg:text-5xl font-serif wos-text-heading mt-3">
                {t("weddingHub.weddingDate")}
              </h2>
            </div>

            <span className="rounded-full bg-[#fff0f3] text-[#660033] px-4 py-2 text-sm font-semibold">
              {timeLeft.days} {t("weddingHub.daysLeft")}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProgressRing
              value={guestProgress}
              label={t("weddingHub.guestsConfirmed")}
              sublabel={`${stats.guestsConfirmed} ${t("weddingHub.of")} ${stats.totalGuests}`}
            />

            <ProgressRing
              value={tableProgress}
              label={t("weddingHub.guestsSeated")}
              sublabel={`${stats.seatedGuests} ${t("weddingHub.of")} ${stats.totalGuests}`}
            />

            <ProgressRing
              value={budgetProgress}
              label={t("weddingHub.budgetPaid")}
              sublabel={`${formatMoney(stats.budgetPaid, t, language)} ${t("weddingHub.paidAmount")}`}
            />

            <ProgressRing
              value={honeymoonProgress}
              label={t("weddingHub.honeymoonPaid")}
              sublabel={`${formatMoney(stats.honeymoonPaid, t, language)} ${t("weddingHub.paidAmount")}`}
            />
          </div>
        </div>
      </section>

      <section className="wos-card rounded-[2.5rem] p-6 lg:p-8 border border-[#eadde2]">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 items-center">
          <div>
            <p className="text-sm text-[#8d7380]">
              {t("weddingHub.timelinePreview")}
            </p>

            <h2 className="text-3xl font-serif wos-text-heading mt-2">
              {nextTimelineItem?.title || t("weddingHub.noUpcomingSteps")}
            </h2>

            {nextTimelineItem ? (
              <p className="text-sm wos-text-muted mt-3">
                {nextTimelineItem.category} ·{" "}
                {formatDate(nextTimelineItem.date)}
                {nextTimelineItem.time ? ` · ${nextTimelineItem.time}` : ""}
              </p>
            ) : (
              <p className="text-sm wos-text-muted mt-3">
                {t("weddingHub.timelineComplete")}
              </p>
            )}

            <div className="mt-6 rounded-[2rem] bg-[#fff8fa] border border-[#eadde2] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold wos-text-heading">
                    {t("weddingHub.timelineProgress")}
                  </p>

                  <p className="text-sm text-[#8d7380] mt-1">
                    {completedTimelineItems} {t("weddingHub.of")}{" "}
                    {timelineItems.length} {t("weddingHub.stepsCompleted")}
                  </p>
                </div>

                <span className="rounded-full bg-[#fff0f3] text-[#660033] px-4 py-2 text-sm font-semibold">
                  {timelineProgress}% {t("weddingHub.done")}
                </span>
              </div>

              <div className="mt-5 h-3 rounded-full bg-[#f7e8ed] overflow-hidden">
                <div
                  className="h-full bg-[#660033] rounded-full"
                  style={{ width: `${timelineProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div
            className="mx-auto h-56 w-56 rounded-full grid place-items-center"
            style={{
              background: `conic-gradient(#660033 ${
                timelineProgress * 3.6
              }deg, #f3dfe6 0deg)`,
            }}
          >
            <div className="h-40 w-40 rounded-full bg-white grid place-items-center text-center border border-[#eadde2]">
              <div>
                <p className="text-5xl font-bold text-[#660033]">
                  {timelineProgress}%
                </p>
                <p className="text-xs text-[#8d7380] mt-1">
                  {t("weddingHub.timelineLabel")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WeddingHubPage;
