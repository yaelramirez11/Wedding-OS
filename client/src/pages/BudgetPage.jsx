import { useEffect, useMemo, useRef, useState } from "react";

import {
  fetchBudgetItems,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
} from "../services/budgetService";
import { useTranslation } from "../context/PreferencesContext.jsx";
import {
  formatMoney,
  getBudgetCategories,
  getBudgetSubcategories,
  getBudgetStatusConfig,
  findBudgetCategoryLabel,
  findBudgetSubcategoryLabel,
} from "../i18n/helpers.js";

import DeleteBudgetModal from "../components/budget/DeleteBudgetModal.jsx";

const BUDGET_STATS_SCROLL_KEY = "wos-budget-stats-scroll";

function isWeddingBudgetItem(item) {
  return item.category !== "honeymoon";
}

function calculatePendingTotal(itemList) {
  return itemList.reduce((sum, item) => {
    if (item.status === "paid") return sum;

    const remaining = item.cost - (item.advancePaid || 0);

    return sum + Math.max(remaining, 0);
  }, 0);
}

function BudgetScopeSwitch({ includeHoneymoon, onChange, label, t }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={includeHoneymoon}
      aria-label={label}
      title={label}
      onClick={() => onChange(!includeHoneymoon)}
      className={`wos-budget-scope-switch${includeHoneymoon ? " is-on" : ""}`}
    >
      <span className="wos-budget-scope-switch-track" aria-hidden="true">
        <span className="wos-budget-scope-switch-thumb" />
      </span>
      <span className="wos-budget-scope-switch-text">
        {includeHoneymoon ? t("budget.scopeCombinedShort") : t("budget.scopeWeddingShort")}
      </span>
    </button>
  );
}

function BudgetPage() {
  const { t, language } = useTranslation();
  const categories = useMemo(() => getBudgetCategories(t), [t]);
  const subcategories = useMemo(() => getBudgetSubcategories(t), [t]);
  const statusConfig = useMemo(() => getBudgetStatusConfig(t), [t]);

  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");
  const [advancePaid, setAdvancePaid] = useState("");
  const [category, setCategory] = useState("other");
  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [editingId, setEditingId] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [totalIncludesHoneymoon, setTotalIncludesHoneymoon] = useState(true);
  const [pendingIncludesHoneymoon, setPendingIncludesHoneymoon] = useState(true);
  const statsTrackRef = useRef(null);
  const statsScrollRestoredRef = useRef(false);

  const weddingItems = items.filter(isWeddingBudgetItem);

  const weddingTotal = weddingItems.reduce((sum, item) => sum + item.cost, 0);

  const total = items.reduce((sum, item) => sum + item.cost, 0);

  const paid = items
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + item.cost, 0);

  const advancePayments = items
    .filter((item) => item.status === "advancePayment")
    .reduce((sum, item) => sum + (item.advancePaid || 0), 0);

  const weddingPending = calculatePendingTotal(weddingItems);
  const pending = calculatePendingTotal(items);

  const displayedTotal = totalIncludesHoneymoon ? total : weddingTotal;
  const displayedPending = pendingIncludesHoneymoon ? pending : weddingPending;

  const currentSubcategories = subcategories[category] || [];
  const editingSubcategories = subcategories[editingExpense?.category] || [];

  useEffect(() => {
    loadBudget();
  }, []);

  useEffect(() => {
    if (statsScrollRestoredRef.current) return;

    const track = statsTrackRef.current;
    if (!track) return;

    const savedScroll = sessionStorage.getItem(BUDGET_STATS_SCROLL_KEY);

    requestAnimationFrame(() => {
      if (savedScroll) {
        track.scrollLeft = Number(savedScroll);
      }
      statsScrollRestoredRef.current = true;
    });
  }, [items]);

  const handleStatsScroll = () => {
    const track = statsTrackRef.current;
    if (!track) return;

    sessionStorage.setItem(BUDGET_STATS_SCROLL_KEY, String(track.scrollLeft));
  };

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

  const loadBudget = async () => {
    try {
      const data = await fetchBudgetItems();
      setItems(data);
    } catch (error) {
      console.error(error);
      showError(t("budget.loadError"));
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setSubcategory("");
  };

  const getNormalizedPaymentData = (costValue, advanceValue, statusValue) => {
    const normalizedCost = Number(costValue) || 0;
    let normalizedAdvance = Number(advanceValue) || 0;
    let normalizedStatus = statusValue;

    if (normalizedStatus === "pending") {
      normalizedAdvance = 0;
    }

    if (normalizedStatus === "paid") {
      normalizedAdvance = normalizedCost;
    }

    if (normalizedStatus === "advancePayment") {
      if (normalizedAdvance > normalizedCost) {
        normalizedAdvance = normalizedCost;
      }
    }

    return {
      cost: normalizedCost,
      advancePaid: normalizedAdvance,
      status: normalizedStatus,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || Number(cost) <= 0) return;

    try {
      setLoading(true);

      const paymentData = getNormalizedPaymentData(cost, advancePaid, status);

      const newItem = await createBudgetItem({
        title,
        ...paymentData,
        category,
        subcategory: subcategory || null,
        notes: notes.trim() || null,
      });

      setItems((prev) => [newItem, ...prev]);

      setTitle("");
      setCost("");
      setAdvancePaid("");
      setCategory("other");
      setSubcategory("");
      setStatus("pending");
      setNotes("");

      showSuccess(t("budget.addSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("budget.addError"));
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

      const updatedItem = await updateBudgetItem(item.id, paymentData);

      setItems((prev) =>
        prev.map((current) =>
          current.id === updatedItem.id ? updatedItem : current,
        ),
      );

      showSuccess(t("budget.statusUpdateSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("budget.updateError"));
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);

    setEditingExpense({
      title: item.title,
      cost: item.cost,
      advancePaid: item.advancePaid || 0,
      category: item.category,
      subcategory: item.subcategory || "",
      status: item.status,
      notes: item.notes || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingExpense(null);
  };

  const saveEdit = async (item) => {
    try {
      const paymentData = getNormalizedPaymentData(
        editingExpense.cost,
        editingExpense.advancePaid,
        editingExpense.status,
      );

      const updatedItem = await updateBudgetItem(item.id, {
        title: editingExpense.title,
        ...paymentData,
        category: editingExpense.category,
        subcategory: editingExpense.subcategory || null,
        notes: editingExpense.notes.trim() || null,
      });

      setItems((prev) =>
        prev.map((current) =>
          current.id === updatedItem.id ? updatedItem : current,
        ),
      );

      cancelEdit();
      showSuccess(t("budget.updateSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("budget.updateError"));
    }
  };

  const removeItem = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await deleteBudgetItem(itemToDelete.id);

      setItems((prev) =>
        prev.filter((current) => current.id !== itemToDelete.id),
      );

      showSuccess(t("budget.deleteSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("budget.deleteError"));
    } finally {
      setItemToDelete(null);
      setIsDeleteModalOpen(false);
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

  return (
    <div className="space-y-8 wos-page-content">
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
      <section>
        <p className="text-sm font-medium wos-text-muted">{t("budget.eyebrow")}</p>

        <h1 className="text-4xl font-bold tracking-tight mt-1 wos-text-heading">
          {t("budget.title")}
        </h1>

        <p className="wos-text-muted mt-2 max-w-2xl">{t("budget.subtitle")}</p>
      </section>
      <section className="wos-budget-stats">
        <div
          ref={statsTrackRef}
          className="wos-budget-stats-track"
          onScroll={handleStatsScroll}
        >
          <div className="wos-card wos-budget-stat-card rounded-3xl border border-black/5 shadow-sm">
            <div className="wos-budget-stat-card-header">
              <div>
                <p className="wos-budget-stat-label wos-text-muted">
                  {t("budget.totalCost")}
                </p>
                <p className="wos-budget-stat-hint">
                  {totalIncludesHoneymoon
                    ? t("budget.totalCostCombinedHint")
                    : t("budget.totalCostWeddingHint")}
                </p>
              </div>
              <BudgetScopeSwitch
                includeHoneymoon={totalIncludesHoneymoon}
                onChange={setTotalIncludesHoneymoon}
                label={t("budget.toggleTotalScope")}
                t={t}
              />
            </div>
            <p className="wos-budget-stat-value wos-text-heading">
              {formatMoney(displayedTotal, t, language)}
            </p>
          </div>

          <div className="wos-card wos-budget-stat-card rounded-3xl border border-black/5 shadow-sm">
            <p className="wos-budget-stat-label wos-text-muted">
              {t("budget.paid")}
            </p>
            <p className="wos-budget-stat-value wos-text-heading">
              {formatMoney(paid, t, language)}
            </p>
          </div>

          <div className="wos-card wos-budget-stat-card rounded-3xl border border-black/5 shadow-sm">
            <p className="wos-budget-stat-label wos-text-muted">
              {t("budget.advancePayments")}
            </p>
            <p className="wos-budget-stat-value wos-text-heading">
              {formatMoney(advancePayments, t, language)}
            </p>
          </div>

          <div className="wos-card wos-budget-stat-card rounded-3xl border border-black/5 shadow-sm">
            <div className="wos-budget-stat-card-header">
              <div>
                <p className="wos-budget-stat-label wos-text-muted">
                  {t("budget.pending")}
                </p>
                <p className="wos-budget-stat-hint">
                  {pendingIncludesHoneymoon
                    ? t("budget.totalCostCombinedHint")
                    : t("budget.totalCostWeddingHint")}
                </p>
              </div>
              <BudgetScopeSwitch
                includeHoneymoon={pendingIncludesHoneymoon}
                onChange={setPendingIncludesHoneymoon}
                label={t("budget.togglePendingScope")}
                t={t}
              />
            </div>
            <p className="wos-budget-stat-value wos-text-heading">
              {formatMoney(displayedPending, t, language)}
            </p>
          </div>
        </div>
      </section>
      <section className="wos-card rounded-3xl p-4 border border-black/5 shadow-sm flex flex-col gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("budget.searchPlaceholder")}
          className="wos-input"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="wos-input"
          >
            <option value="all">{t("budget.allStatuses")}</option>
            <option value="pending">{statusConfig.pending.label}</option>
            <option value="advancePayment">
              {statusConfig.advancePayment.label}
            </option>
            <option value="paid">{statusConfig.paid.label}</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="wos-input"
          >
            <option value="all">{t("budget.allCategories")}</option>

            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
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
      <section className="wos-split-layout">
        <form
          onSubmit={handleSubmit}
          className="wos-card p-6 rounded-3xl shadow-sm border border-black/5 wos-sticky-panel"
        >
          <h2 className="text-xl font-semibold wos-text-heading">
            {t("budget.addExpense")}
          </h2>

          <p className="text-sm wos-text-muted mt-1 mb-5">
            {t("budget.addExpenseHint")}
          </p>

          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("budget.expenseTitle")}
              className="wos-input"
            />

            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              type="number"
              min="0"
              placeholder={t("budget.cost")}
              className="wos-input"
            />

            <input
              value={advancePaid}
              onChange={(e) => setAdvancePaid(e.target.value)}
              type="number"
              min="0"
              placeholder={t("budget.advancePaid")}
              className="wos-input"
            />

            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="wos-input"
            >
              {categories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            {currentSubcategories.length > 0 && (
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="wos-input"
              >
                <option value="">{t("budget.chooseSubcategory")}</option>

                {currentSubcategories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            )}

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="wos-input"
            >
              <option value="pending">{statusConfig.pending.label}</option>
              <option value="advancePayment">
                {statusConfig.advancePayment.label}
              </option>
              <option value="paid">{statusConfig.paid.label}</option>
            </select>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("common.notesPlaceholder")}
              rows={4}
              maxLength={300}
              className="wos-input resize-none"
            />

            <button
              disabled={loading || !title.trim() || Number(cost) <= 0}
              className="w-full wos-button disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? t("common.adding") : t("budget.addExpenseBtn")}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="wos-card border border-dashed border-[#eadde2] rounded-3xl p-10 text-center">
              <h2 className="text-xl font-semibold wos-text-heading">
                {t("budget.noExpenses")}
              </h2>

              <p className="wos-text-muted mt-2">{t("budget.noExpensesHint")}</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const currentStatus =
                statusConfig[item.status] || statusConfig.pending;

              const isEditing = editingId === item.id;

              return (
                <article
                  key={item.id}
                  className="wos-card p-5 rounded-3xl shadow-sm border border-black/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            value={editingExpense.title}
                            onChange={(e) =>
                              setEditingExpense((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            className="wos-input"
                          />

                          <input
                            type="number"
                            min="0"
                            value={editingExpense.cost}
                            onChange={(e) =>
                              setEditingExpense((prev) => ({
                                ...prev,
                                cost: e.target.value,
                              }))
                            }
                            className="wos-input"
                          />

                          <input
                            type="number"
                            min="0"
                            value={editingExpense.advancePaid}
                            onChange={(e) =>
                              setEditingExpense((prev) => ({
                                ...prev,
                                advancePaid: e.target.value,
                              }))
                            }
                            className="wos-input"
                          />

                          <select
                            value={editingExpense.category}
                            onChange={(e) =>
                              setEditingExpense((prev) => ({
                                ...prev,
                                category: e.target.value,
                                subcategory: "",
                              }))
                            }
                            className="wos-input"
                          >
                            {categories.map((categoryItem) => (
                              <option
                                key={categoryItem.value}
                                value={categoryItem.value}
                              >
                                {categoryItem.label}
                              </option>
                            ))}
                          </select>

                          {editingSubcategories.length > 0 && (
                            <select
                              value={editingExpense.subcategory}
                              onChange={(e) =>
                                setEditingExpense((prev) => ({
                                  ...prev,
                                  subcategory: e.target.value,
                                }))
                              }
                              className="wos-input"
                            >
                              <option value="">
                                {t("budget.chooseSubcategory")}
                              </option>

                              {editingSubcategories.map((subcategoryItem) => (
                                <option
                                  key={subcategoryItem.value}
                                  value={subcategoryItem.value}
                                >
                                  {subcategoryItem.label}
                                </option>
                              ))}
                            </select>
                          )}

                          <select
                            value={editingExpense.status}
                            onChange={(e) =>
                              setEditingExpense((prev) => ({
                                ...prev,
                                status: e.target.value,
                              }))
                            }
                            className="wos-input"
                          >
                            <option value="pending">
                              {statusConfig.pending.label}
                            </option>
                            <option value="advancePayment">
                              {statusConfig.advancePayment.label}
                            </option>
                            <option value="paid">{statusConfig.paid.label}</option>
                          </select>

                          <textarea
                            rows={3}
                            value={editingExpense.notes}
                            onChange={(e) =>
                              setEditingExpense((prev) => ({
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
                              className="text-sm font-medium text-white bg-[#660033] px-4 py-2 rounded-2xl hover:opacity-90 transition"
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
                        <>
                          <h2 className="text-lg font-semibold wos-text-heading">
                            {item.title}
                          </h2>

                          <div className="text-sm wos-text-muted mt-1">
                            <p>
                              {findBudgetCategoryLabel(t, item.category)}{" "}
                              {item.subcategory
                                ? `· ${findBudgetSubcategoryLabel(t, item.category, item.subcategory)}`
                                : ""}{" "}
                              · {formatMoney(item.cost, t, language)}
                            </p>

                            {item.advancePaid > 0 && (
                              <p className="mt-1">
                                {t("budget.advancePaidLabel")}:{" "}
                                {formatMoney(item.advancePaid, t, language)} ·{" "}
                                {t("budget.remaining")}:{" "}
                                {formatMoney(item.cost - item.advancePaid, t, language)}
                              </p>
                            )}
                          </div>

                          {item.notes && (
                            <p className="text-sm wos-text-muted mt-3 bg-[#fff8fa] rounded-2xl px-4 py-3">
                              {item.notes}
                            </p>
                          )}
                        </>
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
                            className="text-sm font-medium wos-text-heading border border-[#eadde2] px-4 py-2 rounded-2xl wos-card hover:bg-[#fff8fa] transition outline-none"
                          >
                            <option value="pending">
                              {statusConfig.pending.label}
                            </option>
                            <option value="advancePayment">
                              {statusConfig.advancePayment.label}
                            </option>
                            <option value="paid">{statusConfig.paid.label}</option>
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
      <DeleteBudgetModal
        open={isDeleteModalOpen}
        item={itemToDelete}
        onClose={() => {
          setItemToDelete(null);
          setIsDeleteModalOpen(false);
        }}
        onConfirm={confirmDeleteItem}
      />
    </div>
  );
}

export default BudgetPage;
