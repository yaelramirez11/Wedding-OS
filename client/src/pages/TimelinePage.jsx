import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchTimelineItems,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} from "../services/timelineService";
import { useTranslation } from "../context/PreferencesContext.jsx";
import {
  formatLocaleDate,
  getTimelineTypeConfig,
  getTimelineStatusConfig,
  getTimelinePriorityConfig,
  getTimelineSignals,
  getTimelineSeedItems,
  getTimelineCategoryLabel,
  sortTimelineItems,
  toDateInputValue,
} from "../i18n/helpers.js";

import DeleteTimelineModal from "../components/timeline/DeleteTimelineModal.jsx";

function TimelinePage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const typeConfig = useMemo(() => getTimelineTypeConfig(t), [t]);
  const statusConfig = useMemo(() => getTimelineStatusConfig(t), [t]);
  const priorityConfig = useMemo(() => getTimelinePriorityConfig(t), [t]);
  const signalConfig = useMemo(() => getTimelineSignals(t), [t]);

  const [items, setItems] = useState([]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("planning");
  const [category, setCategory] = useState("general");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("all");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [celebratedId, setCelebratedId] = useState(null);

  useEffect(() => {
    loadTimeline();
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage("");

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setSuccessMessage("");

    setTimeout(() => setErrorMessage(""), 3000);
  };

  const loadTimeline = async () => {
    try {
      const data = await fetchTimelineItems();
      setItems(data);
    } catch (error) {
      console.error(error);
      showError(t("timeline.loadError"));
    }
  };

  const formatDate = (value) =>
    formatLocaleDate(value, language, t("timeline.noDate"));

  const filteredItems =
    activeType === "all"
      ? items
      : items.filter((item) => item.type === activeType);

  const sortedItems = sortTimelineItems(filteredItems);

  const completedItems = items.filter(
    (item) => item.status === "completed",
  ).length;

  const progress =
    items.length === 0 ? 0 : Math.round((completedItems / items.length) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setLoading(true);

      await createTimelineItem({
        title,
        type,
        category: category.trim() || "general",
        status,
        priority,
        date: date || null,
        time: time || null,
        notes: notes.trim() || null,
        isCurrent: false,
      });

      await loadTimeline();

      setTitle("");
      setType("planning");
      setCategory("general");
      setStatus("pending");
      setPriority("medium");
      setDate("");
      setTime("");
      setNotes("");

      showSuccess(t("timeline.addSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("timeline.addError"));
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (item, nextStatus) => {
    try {
      await updateTimelineItem(item.id, {
        status: nextStatus,
        isCurrent: nextStatus === "completed" ? false : item.isCurrent,
      });

      await loadTimeline();

      if (nextStatus === "completed") {
        setCelebratedId(item.id);
        showSuccess(t("timeline.completedSuccess"));

        setTimeout(() => setCelebratedId(null), 1800);
      } else {
        showSuccess(t("timeline.statusUpdateSuccess"));
      }
    } catch (error) {
      console.error(error);
      showError(t("timeline.updateError"));
    }
  };

  const toggleCurrent = async (item) => {
    try {
      const updatedItem = await updateTimelineItem(item.id, {
        isCurrent: !item.isCurrent,
      });

      setItems((prev) =>
        prev.map((current) =>
          current.id === updatedItem.id ? updatedItem : current,
        ),
      );

      showSuccess(
        updatedItem.isCurrent
          ? t("timeline.markedCurrent")
          : t("timeline.removedCurrent"),
      );
    } catch (error) {
      console.error(error);
      showError(t("timeline.currentMarkerError"));
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);

    setEditingItem({
      title: item.title,
      type: item.type,
      category: item.category,
      status: item.status,
      priority: item.priority,
      date: toDateInputValue(item.date),
      time: item.time || "",
      notes: item.notes || "",
      isCurrent: Boolean(item.isCurrent),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingItem(null);
  };

  const saveEdit = async (item) => {
    try {
      await updateTimelineItem(item.id, {
        ...editingItem,
        category: editingItem.category.trim() || "general",
        date: editingItem.date || null,
        time: editingItem.time || null,
        notes: editingItem.notes.trim() || null,
        isCurrent:
          editingItem.status === "completed" ? false : editingItem.isCurrent,
      });

      await loadTimeline();

      cancelEdit();
      showSuccess(t("timeline.updateSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("timeline.updateError"));
    }
  };

  const removeItem = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteTimelineItem(itemToDelete.id);

      setItems((prev) =>
        prev.filter((current) => current.id !== itemToDelete.id),
      );

      showSuccess(t("timeline.deleteSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("timeline.deleteError"));
    } finally {
      setItemToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const seedTimeline = async () => {
    try {
      setLoading(true);

      for (const item of getTimelineSeedItems(t)) {
        await createTimelineItem(item);
      }

      await loadTimeline();
      showSuccess(t("timeline.seedSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("timeline.seedError"));
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntil = (dateValue) => {
    if (!dateValue) return null;

    const storedDate = new Date(dateValue);
    const target = new Date(
      storedDate.getUTCFullYear(),
      storedDate.getUTCMonth(),
      storedDate.getUTCDate(),
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  const getSignal = (item) => {
    const daysUntil = getDaysUntil(item.date);

    if (item.status === "completed") return null;

    if (daysUntil !== null && daysUntil < 0) {
      return signalConfig.late;
    }

    if (daysUntil !== null && daysUntil <= 7) {
      return signalConfig.comingSoon;
    }

    return null;
  };

  const getModulePath = (item) => {
    const text = `${item.title} ${item.category}`.toLowerCase();

    if (text.includes("guest") || text.includes("rsvp")) {
      return "/dashboard/guests";
    }

    if (
      text.includes("budget") ||
      text.includes("payment") ||
      text.includes("venue")
    ) {
      return "/dashboard/budget";
    }

    if (
      text.includes("honeymoon") ||
      text.includes("hotel") ||
      text.includes("flight")
    ) {
      return "/dashboard/honeymoon";
    }

    return null;
  };

  const currentItems = items.filter((item) => item.isCurrent);

  const nextItem = sortTimelineItems(
    items.filter((item) => item.status !== "completed"),
  )[0];

  return (
    <div className="space-y-8">
      {successMessage && (
        <div className="rounded-2xl px-5 py-4 text-sm font-medium wos-alert-success">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl px-5 py-4 text-sm font-medium wos-alert-error">
          {errorMessage}
        </div>
      )}

      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#fff0f3] via-[#fff8fa] to-[#f3edf8] border border-[#eadde2] wos-page-hero">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/50" />
        <div className="absolute right-24 -bottom-28 h-80 w-80 rounded-full bg-[#f2c8d4]/35" />

        <div className="relative z-10 max-w-3xl">
          <p className="text-[#8d7380] text-sm font-medium mb-5">
            {t("timeline.eyebrow")}
          </p>

          <h1 className="wos-text-heading wos-page-title font-semibold">
            {t("timeline.title")}
          </h1>

          <p className="wos-text-muted text-lg mt-6 leading-relaxed max-w-2xl">
            {t("timeline.subtitle")}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">{t("timeline.totalSteps")}</p>
          <h2 className="text-4xl font-bold mt-2">{items.length}</h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">{t("timeline.completed")}</p>
          <h2 className="wos-stat-value font-bold mt-2">{completedItems}</h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">{t("timeline.progress")}</p>
          <h2 className="wos-stat-value font-bold mt-2">{progress}%</h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">{t("timeline.weAreHere")}</p>

          <h2 className="text-xl font-serif font-semibold mt-3 line-clamp-2 wos-text-heading">
            {currentItems[0]?.title || t("timeline.chooseStep")}
          </h2>
        </div>
      </section>
      <section className="wos-soft-card p-6">
        <p className="text-sm text-[#8d7380]">{t("timeline.nextStep")}</p>

        <h2 className="text-3xl font-serif wos-text-heading mt-2">
          {nextItem?.title || t("timeline.allComplete")}
        </h2>

        {nextItem && (
          <p className="text-sm text-[#7f7079] mt-2">
            {getTimelineCategoryLabel(t, nextItem.category)} · {formatDate(nextItem.date)}
            {nextItem.time ? ` · ${nextItem.time}` : ""}
          </p>
        )}
      </section>

      {items.length === 0 && (
        <section className="wos-soft-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif wos-text-heading">
              {t("timeline.createTimeline")}
            </h2>
            <p className="text-sm wos-text-muted mt-1">
              {t("timeline.createTimelineHint")}
            </p>
          </div>

          <button
            type="button"
            onClick={seedTimeline}
            className="wos-button"
            disabled={loading}
          >
            {t("timeline.seedTimeline")}
          </button>
        </section>
      )}

      <section className="flex flex-wrap gap-3">
        {[
          { value: "all", label: t("timeline.filterAll"), icon: "♡" },
          {
            value: "planning",
            label: typeConfig.planning.label,
            icon: typeConfig.planning.icon,
          },
          {
            value: "weddingDay",
            label: typeConfig.weddingDay.label,
            icon: typeConfig.weddingDay.icon,
          },
          {
            value: "honeymoon",
            label: typeConfig.honeymoon.label,
            icon: typeConfig.honeymoon.icon,
          },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setActiveType(item.value)}
            className={`px-5 py-3 rounded-2xl text-sm font-semibold transition ${
              activeType === item.value
                ? "bg-[#660033] text-white"
                : "wos-card text-[#660033] hover:bg-[#fff0f3]"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="wos-card p-6 wos-sticky-panel overflow-hidden relative"
        >
          <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#fff0f3]" />

          <div className="relative z-10 space-y-4">
            <div>
              <h2 className="text-2xl font-serif font-semibold wos-text-heading">
                {t("timeline.addStep")}
              </h2>

              <p className="text-sm wos-text-muted mt-2">
                {t("timeline.addStepHint")}
              </p>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("timeline.stepTitle")}
              className="wos-input"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="wos-input"
            >
              <option value="planning">{typeConfig.planning.label}</option>
              <option value="weddingDay">{typeConfig.weddingDay.label}</option>
              <option value="honeymoon">{typeConfig.honeymoon.label}</option>
            </select>

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t("timeline.category")}
              className="wos-input"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="wos-input"
            >
              <option value="pending">{statusConfig.pending.label}</option>
              <option value="inProgress">{statusConfig.inProgress.label}</option>
              <option value="completed">{statusConfig.completed.label}</option>
              <option value="cancelled">{statusConfig.cancelled.label}</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="wos-input"
            >
              <option value="low">{t("timeline.priorityLow")}</option>
              <option value="medium">{t("timeline.priorityMedium")}</option>
              <option value="high">{t("timeline.priorityHigh")}</option>
            </select>

            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="wos-input"
            />

            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              type="time"
              className="wos-input"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("common.notesPlaceholder")}
              rows={4}
              maxLength={500}
              className="wos-input resize-none"
            />

            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full wos-button"
            >
              {loading ? t("common.adding") : t("timeline.addStepBtn")}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute left-7 top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-[#660033] via-[#f2c8d4] to-[#660033]/20 wos-timeline-rail" />

          <div className="space-y-5">
            {sortedItems.length === 0 ? (
              <div className="wos-card p-10 text-center">
                <h2 className="text-2xl font-serif font-semibold wos-text-heading">
                  {t("timeline.noSteps")}
                </h2>

                <p className="wos-text-muted mt-2">{t("timeline.noStepsHint")}</p>
              </div>
            ) : (
              sortedItems.map((item, index) => {
                const signal = getSignal(item);
                const modulePath = getModulePath(item);
                const typeData = typeConfig[item.type] || typeConfig.planning;
                const currentStatus =
                  statusConfig[item.status] || statusConfig.pending;
                const isEditing = editingId === item.id;

                return (
                  <article key={item.id} className="relative wos-timeline-item">
                    <div
                      className={`absolute left-0 top-6 rounded-full border-4 shadow-[0_10px_30px_rgba(80,40,55,0.12)] flex items-center justify-center z-10 wos-timeline-node ${
                        item.isCurrent
                          ? "bg-[#660033] text-white border-[#ffd6e0] animate-pulse"
                          : item.status === "completed"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-white border-[#fff0f3]"
                      }`}
                    >
                      {item.status === "completed" ? "✓" : index + 1}
                    </div>

                    <div
                      className={`wos-card p-5 relative overflow-hidden ${
                        item.isCurrent ? "ring-2 ring-[#f2c8d4]" : ""
                      } ${
                        celebratedId === item.id
                          ? "scale-[1.02] bg-green-50"
                          : ""
                      } transition`}
                    >
                      {celebratedId === item.id && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-5xl">
                          ✨
                        </div>
                      )}

                      <div className="flex flex-col gap-5">
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-3">
                              <input
                                value={editingItem.title}
                                onChange={(e) =>
                                  setEditingItem((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                  }))
                                }
                                className="wos-input"
                              />

                              <select
                                value={editingItem.type}
                                onChange={(e) =>
                                  setEditingItem((prev) => ({
                                    ...prev,
                                    type: e.target.value,
                                  }))
                                }
                                className="wos-input"
                              >
                                <option value="planning">{typeConfig.planning.label}</option>
                                <option value="weddingDay">{typeConfig.weddingDay.label}</option>
                                <option value="honeymoon">{typeConfig.honeymoon.label}</option>
                              </select>

                              <input
                                value={editingItem.category}
                                onChange={(e) =>
                                  setEditingItem((prev) => ({
                                    ...prev,
                                    category: e.target.value,
                                  }))
                                }
                                className="wos-input"
                              />

                              <select
                                value={editingItem.status}
                                onChange={(e) =>
                                  setEditingItem((prev) => ({
                                    ...prev,
                                    status: e.target.value,
                                  }))
                                }
                                className="wos-input"
                              >
                                <option value="pending">{statusConfig.pending.label}</option>
                                <option value="inProgress">{statusConfig.inProgress.label}</option>
                                <option value="completed">{statusConfig.completed.label}</option>
                                <option value="cancelled">{statusConfig.cancelled.label}</option>
                              </select>

                              <select
                                value={editingItem.priority}
                                onChange={(e) =>
                                  setEditingItem((prev) => ({
                                    ...prev,
                                    priority: e.target.value,
                                  }))
                                }
                                className="wos-input"
                              >
                                <option value="low">{priorityConfig.low}</option>
                                <option value="medium">{priorityConfig.medium}</option>
                                <option value="high">{priorityConfig.high}</option>
                              </select>

                              <input
                                type="date"
                                value={editingItem.date}
                                onChange={(e) =>
                                  setEditingItem((prev) => ({
                                    ...prev,
                                    date: e.target.value,
                                  }))
                                }
                                className="wos-input"
                              />

                              <input
                                type="time"
                                value={editingItem.time}
                                onChange={(e) =>
                                  setEditingItem((prev) => ({
                                    ...prev,
                                    time: e.target.value,
                                  }))
                                }
                                className="wos-input"
                              />

                              <label className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadde2] px-4 py-3">
                                <span className="text-sm font-semibold wos-text-heading">
                                  {t("timeline.weAreHere")}
                                </span>

                                <input
                                  type="checkbox"
                                  checked={editingItem.isCurrent}
                                  onChange={(e) =>
                                    setEditingItem((prev) => ({
                                      ...prev,
                                      isCurrent: e.target.checked,
                                    }))
                                  }
                                  className="h-5 w-5 accent-[#660033]"
                                />
                              </label>

                              <textarea
                                value={editingItem.notes}
                                onChange={(e) =>
                                  setEditingItem((prev) => ({
                                    ...prev,
                                    notes: e.target.value,
                                  }))
                                }
                                rows={3}
                                className="wos-input resize-none"
                              />

                              <div className="flex flex-wrap gap-3">
                                <button
                                  type="button"
                                  onClick={() => saveEdit(item)}
                                  className="wos-button"
                                >
                                  {t("common.save")}
                                </button>

                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="wos-secondary-btn"
                                >
                                  {t("common.cancel")}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-2">
                                <span
                                  className={`w-fit text-xs font-semibold px-3 py-1 rounded-full ${typeData.color}`}
                                >
                                  {typeData.icon} {typeData.label}
                                </span>

                                <span
                                  className={`w-fit text-xs font-semibold px-3 py-1 rounded-full ${currentStatus.className}`}
                                >
                                  {currentStatus.label}
                                </span>

                                <span className="w-fit text-xs font-semibold px-3 py-1 rounded-full bg-[#fff8fa] text-[#8d7380]">
                                  {priorityConfig[item.priority]}
                                </span>

                                {signal && (
                                  <span
                                    className={`w-fit text-xs font-semibold px-3 py-1 rounded-full ${signal.className}`}
                                  >
                                    {signal.label}
                                  </span>
                                )}

                                {item.isCurrent && (
                                  <span className="w-fit text-xs font-semibold px-3 py-1 rounded-full bg-[#660033] text-white">
                                    {t("timeline.weAreHereBadge")}
                                  </span>
                                )}
                              </div>

                              <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-[#38131f] wos-break-anywhere">
                                  {item.title}
                                </h2>

                                <p className="text-sm text-[#7f7079] mt-2">
                                  {getTimelineCategoryLabel(t, item.category)} · {formatDate(item.date)}{" "}
                                  {item.time ? `· ${item.time}` : ""}
                                </p>
                              </div>

                              {item.notes && (
                                <p className="text-sm text-[#7f7079] bg-[#fff8fa] rounded-2xl px-4 py-3">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {!isEditing && (
                          <div className="wos-action-row pt-4 border-t border-[#f0e2e7]">
                            <select
                              value={item.status}
                              onChange={(e) =>
                                changeStatus(item, e.target.value)
                              }
                              className="text-sm font-medium text-gray-700 border border-[#eadde2] px-4 py-2 rounded-2xl bg-white hover:bg-[#fff8fa] transition outline-none"
                            >
                              <option value="pending">{statusConfig.pending.label}</option>
                              <option value="inProgress">{statusConfig.inProgress.label}</option>
                              <option value="completed">{statusConfig.completed.label}</option>
                              <option value="cancelled">{statusConfig.cancelled.label}</option>
                            </select>
                            {modulePath && (
                              <button
                                type="button"
                                onClick={() => navigate(modulePath)}
                                className="text-sm font-medium text-[#660033] border border-[#eadde2] px-4 py-2 rounded-2xl hover:bg-[#fff8fa] transition"
                              >
                                {t("timeline.openModule")}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => toggleCurrent(item)}
                              className="text-sm font-medium text-[#660033] border border-[#eadde2] px-4 py-2 rounded-2xl hover:bg-[#fff8fa] transition"
                            >
                              {item.isCurrent ? t("timeline.unsetHere") : t("timeline.weAreHere")}
                            </button>

                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              className="wos-secondary-btn"
                            >
                              {t("common.edit")}
                            </button>

                            <button
                              type="button"
                              onClick={() => removeItem(item)}
                              className="text-sm font-medium text-red-600 border border-red-100 px-4 py-2 rounded-2xl hover:bg-red-50 transition"
                            >
                              {t("common.delete")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <DeleteTimelineModal
        open={isDeleteModalOpen}
        item={itemToDelete}
        onClose={() => {
          setItemToDelete(null);
          setIsDeleteModalOpen(false);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default TimelinePage;
