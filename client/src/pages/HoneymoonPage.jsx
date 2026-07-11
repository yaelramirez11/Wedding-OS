import { useEffect, useMemo, useState } from "react";

import {
  fetchHoneymoonItems,
  createHoneymoonItem,
  updateHoneymoonItem,
  deleteHoneymoonItem,
} from "../services/honeymoonService";
import { useTranslation } from "../context/PreferencesContext.jsx";
import {
  formatLocaleDate,
  formatMoney,
  getHoneymoonCategories,
  getHoneymoonStatusConfig,
  findHoneymoonCategory,
  toDateInputValue,
} from "../i18n/helpers.js";

import DeleteHoneymoonModal from "../components/honeymoon/DeleteHoneymoonModal.jsx";

function HoneymoonPage() {
  const { t, language } = useTranslation();
  const categories = useMemo(() => getHoneymoonCategories(t), [t]);
  const statusConfig = useMemo(() => getHoneymoonStatusConfig(t), [t]);

  const [items, setItems] = useState([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("hotel");
  const [cost, setCost] = useState("");
  const [advancePaid, setAdvancePaid] = useState("");
  const [status, setStatus] = useState("planned");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const total = items.reduce((sum, item) => sum + item.cost, 0);

  const paid = items
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + item.cost, 0);

  const advances = items
    .filter((item) => item.status === "advancePaid")
    .reduce((sum, item) => sum + (item.advancePaid || 0), 0);

  const remaining = items.reduce((sum, item) => {
    if (item.status === "paid") return sum;

    return sum + Math.max(item.cost - (item.advancePaid || 0), 0);
  }, 0);

  useEffect(() => {
    loadItems();
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage("");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setSuccessMessage("");

    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  const getNormalizedPaymentData = (costValue, advanceValue, statusValue) => {
    const normalizedCost = Number(costValue) || 0;
    let normalizedAdvance = Number(advanceValue) || 0;
    let normalizedStatus = statusValue;

    if (
      normalizedStatus === "notPlanned" ||
      normalizedStatus === "planned" ||
      normalizedStatus === "booked"
    ) {
      normalizedAdvance = 0;
    }

    if (normalizedStatus === "paid") {
      normalizedAdvance = normalizedCost;
    }

    if (
      normalizedStatus === "advancePaid" &&
      normalizedAdvance > normalizedCost
    ) {
      normalizedAdvance = normalizedCost;
    }

    return {
      cost: normalizedCost,
      advancePaid: normalizedAdvance,
      status: normalizedStatus,
    };
  };

  const loadItems = async () => {
    try {
      const data = await fetchHoneymoonItems();
      setItems(data);
    } catch (error) {
      console.error(error);
      showError(t("honeymoon.loadError"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setLoading(true);

      const paymentData = getNormalizedPaymentData(cost, advancePaid, status);

      const newItem = await createHoneymoonItem({
        title,
        category,
        ...paymentData,
        date: date || null,
        notes: notes.trim() || null,
      });

      setItems((prev) => [newItem, ...prev]);

      setTitle("");
      setCategory("hotel");
      setCost("");
      setAdvancePaid("");
      setStatus("planned");
      setDate("");
      setNotes("");

      showSuccess(t("honeymoon.addSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("honeymoon.addError"));
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (item, nextStatus) => {
    try {
      const paymentData = getNormalizedPaymentData(
        item.cost,
        item.advancePaid,
        nextStatus,
      );

      const updatedItem = await updateHoneymoonItem(item.id, paymentData);

      setItems((prev) =>
        prev.map((current) =>
          current.id === updatedItem.id ? updatedItem : current,
        ),
      );

      showSuccess(t("honeymoon.statusUpdateSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("honeymoon.updateError"));
    }
  };

  const removeItem = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteHoneymoonItem(itemToDelete.id);

      setItems((prev) =>
        prev.filter((current) => current.id !== itemToDelete.id),
      );

      showSuccess(t("honeymoon.deleteSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("honeymoon.deleteError"));
    } finally {
      setItemToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);

    setEditingItem({
      title: item.title,
      category: item.category,
      cost: item.cost,
      advancePaid: item.advancePaid || 0,
      status: item.status,
      date: toDateInputValue(item.date),
      notes: item.notes || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingItem(null);
  };

  const saveEdit = async (item) => {
    try {
      const paymentData = getNormalizedPaymentData(
        editingItem.cost,
        editingItem.advancePaid,
        editingItem.status,
      );

      const updatedItem = await updateHoneymoonItem(item.id, {
        title: editingItem.title,
        category: editingItem.category,
        ...paymentData,
        date: editingItem.date || null,
        notes: editingItem.notes.trim() || null,
      });

      setItems((prev) =>
        prev.map((current) =>
          current.id === updatedItem.id ? updatedItem : current,
        ),
      );

      cancelEdit();
      showSuccess(t("honeymoon.updateSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("honeymoon.updateError"));
    }
  };

  const filteredItems = items
    .filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortBy === "highest") {
        return b.cost - a.cost;
      }

      if (sortBy === "lowest") {
        return a.cost - b.cost;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const formatDate = (value) =>
    formatLocaleDate(value, language, t("honeymoon.noDateYet"));

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

      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#f6dde4] via-[#fff8fa] to-[#f3edf8] border border-[#eadde2] wos-page-hero">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/40" />
        <div className="absolute right-20 -bottom-28 h-80 w-80 rounded-full bg-[#f2c8d4]/35" />

        <div className="relative z-10 max-w-3xl">
          <p className="text-[#8d7380] text-sm font-medium mb-5">
            {t("honeymoon.eyebrow")}
          </p>

          <h1 className="wos-text-heading wos-page-title font-semibold">
            {t("honeymoon.title")}
          </h1>

          <p className="wos-text-muted text-lg mt-6 leading-relaxed max-w-2xl">
            {t("honeymoon.subtitle")}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          {
            label: t("honeymoon.totalTripCost"),
            value: formatMoney(total, t, language),
            icon: "💌",
          },
          { label: t("honeymoon.paid"), value: formatMoney(paid, t, language), icon: "✓" },
          {
            label: t("honeymoon.advances"),
            value: formatMoney(advances, t, language),
            icon: "💙",
          },
          {
            label: t("honeymoon.remaining"),
            value: formatMoney(remaining, t, language),
            icon: "🌙",
          },
        ].map((card) => (
          <div key={card.label} className="wos-card p-6">
            <div className="h-12 w-12 rounded-full bg-[#fff0f3] text-[#660033] flex items-center justify-center text-xl mb-4">
              {card.icon}
            </div>

            <p className="text-sm text-[#8d7380]">{card.label}</p>

            <h2 className="text-2xl font-bold wos-text-heading mt-2">
              {card.value}
            </h2>
          </div>
        ))}
      </section>

      <section className="wos-card p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("honeymoon.searchPlaceholder")}
          className="wos-input"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="wos-input"
          >
            <option value="all">{t("honeymoon.allStatuses")}</option>

            {Object.entries(statusConfig).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="wos-input"
          >
            <option value="all">{t("honeymoon.allCategories")}</option>

            {categories.map((categoryItem) => (
              <option key={categoryItem.value} value={categoryItem.value}>
                {categoryItem.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="wos-input"
          >
            <option value="newest">{t("sort.newest")}</option>
            <option value="oldest">{t("sort.oldest")}</option>
            <option value="highest">{t("sort.highest")}</option>
            <option value="lowest">{t("sort.lowest")}</option>
          </select>
        </div>
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
                {t("honeymoon.addPlan")}
              </h2>

              <p className="text-sm wos-text-muted mt-2">
                {t("honeymoon.addPlanHint")}
              </p>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("honeymoon.planTitle")}
              className="wos-input"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="wos-input"
            >
              {categories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.icon} {item.label}
                </option>
              ))}
            </select>

            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              type="number"
              min="0"
              placeholder={t("honeymoon.cost")}
              className="wos-input"
            />

            <input
              value={advancePaid}
              onChange={(e) => setAdvancePaid(e.target.value)}
              type="number"
              min="0"
              placeholder={t("honeymoon.advancePaid")}
              className="wos-input"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="wos-input"
            >
              {Object.entries(statusConfig).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>

            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="wos-input"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("common.notesPlaceholder")}
              rows={4}
              maxLength={300}
              className="wos-input resize-none"
            />

            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full wos-button"
            >
              {loading ? t("common.adding") : t("honeymoon.addPlanBtn")}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="wos-card p-10 text-center">
              <h2 className="text-2xl font-serif font-semibold wos-text-heading">
                {items.length === 0
                  ? t("honeymoon.noPlans")
                  : t("honeymoon.noMatchingPlans")}
              </h2>

              <p className="wos-text-muted mt-2">
                {items.length === 0
                  ? t("honeymoon.noPlansHint")
                  : t("honeymoon.noMatchingHint")}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const categoryData = findHoneymoonCategory(t, item.category);
              const currentStatus =
                statusConfig[item.status] || statusConfig.planned;
              const isEditing = editingId === item.id;

              return (
                <article key={item.id} className="wos-card p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
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
                            value={editingItem.category}
                            onChange={(e) =>
                              setEditingItem((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                            className="wos-input"
                          >
                            {categories.map((categoryItem) => (
                              <option
                                key={categoryItem.value}
                                value={categoryItem.value}
                              >
                                {categoryItem.icon} {categoryItem.label}
                              </option>
                            ))}
                          </select>

                          <input
                            type="number"
                            min="0"
                            value={editingItem.cost}
                            onChange={(e) =>
                              setEditingItem((prev) => ({
                                ...prev,
                                cost: e.target.value,
                              }))
                            }
                            className="wos-input"
                          />

                          <input
                            type="number"
                            min="0"
                            value={editingItem.advancePaid}
                            onChange={(e) =>
                              setEditingItem((prev) => ({
                                ...prev,
                                advancePaid: e.target.value,
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
                            {Object.entries(statusConfig).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value.label}
                              </option>
                            ))}
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

                          <textarea
                            rows={3}
                            value={editingItem.notes}
                            onChange={(e) =>
                              setEditingItem((prev) => ({
                                ...prev,
                                notes: e.target.value,
                              }))
                            }
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
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-[#fff0f3] text-[#660033] flex items-center justify-center text-xl">
                            {categoryData.icon}
                          </div>

                          <div>
                            <h2 className="text-lg font-semibold wos-text-heading">
                              {item.title}
                            </h2>

                            <p className="text-sm wos-text-muted mt-1">
                              {categoryData.label} · {formatDate(item.date)} ·{" "}
                              {formatMoney(item.cost, t, language)}
                            </p>

                            {item.advancePaid > 0 && (
                              <p className="text-sm wos-text-muted mt-1">
                                {t("budget.advancePaidLabel")}:{" "}
                                {formatMoney(item.advancePaid, t, language)} ·{" "}
                                {t("budget.remaining")}:{" "}
                                {formatMoney(item.cost - item.advancePaid, t, language)}
                              </p>
                            )}

                            {item.notes && (
                              <p className="text-sm wos-text-muted mt-3 bg-[#fff8fa] rounded-2xl px-4 py-3">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="wos-action-row">
                      <span
                        className={`w-fit text-sm font-medium px-3 py-1 rounded-full ${currentStatus.className}`}
                      >
                        {currentStatus.label}
                      </span>

                      {!isEditing && (
                        <>
                          <select
                            value={item.status}
                            onChange={(e) => changeStatus(item, e.target.value)}
                            className="text-sm font-medium wos-text-heading border border-[#eadde2] px-4 py-2 rounded-2xl bg-white hover:bg-[#fff8fa] transition outline-none"
                          >
                            {Object.entries(statusConfig).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value.label}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="wos-secondary-btn active:scale-95 transition"
                          >
                            {t("common.edit")}
                          </button>

                          <button
                            type="button"
                            onClick={() => removeItem(item)}
                            className="text-sm font-medium text-red-600 border border-red-100 px-4 py-2 rounded-2xl hover:bg-red-50 active:scale-95 transition"
                          >
                            {t("common.delete")}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <DeleteHoneymoonModal
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

export default HoneymoonPage;
