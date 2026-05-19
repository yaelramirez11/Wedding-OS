import { useEffect, useState } from "react";

import {
  fetchBudgetItems,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
} from "../services/budgetService";

import DeleteBudgetModal from "../components/budget/DeleteBudgetModal.jsx";

const categories = [
  { value: "venue", label: "Venue" },
  { value: "photography", label: "Photography" },
  { value: "dress", label: "Dress" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "decoration", label: "Decoration" },
  { value: "chorus", label: "Chorus" },
  { value: "getReadyBride", label: "Get Ready Bride" },
  { value: "cake", label: "Cake" },
  { value: "snacks", label: "Snacks" },
  { value: "sweets", label: "Sweets" },
  { value: "waiterTips", label: "Waiter Tips" },
  { value: "tableNumbers", label: "Table Numbers" },
  { value: "alcohol", label: "Alcohol" },
  { value: "favors", label: "Favors / Candles" },
  { value: "centerpieces", label: "Centerpieces" },
  { value: "florals", label: "Florals" },
  { value: "sweetheartTable", label: "Sweetheart Table" },
  { value: "other", label: "Other" },
];

const subcategories = {
  honeymoon: ["Hotel", "Transportation", "Extras"],
  getReadyBride: [
    "Makeup and Hair",
    "Veil",
    "Jewelry",
    "Shoes",
    "Hair Accessories",
    "Robe",
    "Bouquet",
    "Emergency Kit",
  ],
};

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700",
  },
  advancePayment: {
    label: "Advance Payment",
    className: "bg-blue-100 text-blue-700",
  },
  paid: {
    label: "Paid",
    className: "bg-green-100 text-green-700",
  },
};

function BudgetPage() {
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

  const total = items.reduce((sum, item) => sum + item.cost, 0);

  const paid = items
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + item.cost, 0);

  const advancePayments = items
    .filter((item) => item.status === "advancePayment")
    .reduce((sum, item) => sum + (item.advancePaid || 0), 0);

  const pending = items.reduce((sum, item) => {
    if (item.status === "paid") return sum;

    const remaining = item.cost - (item.advancePaid || 0);

    return sum + Math.max(remaining, 0);
  }, 0);

  const currentSubcategories = subcategories[category] || [];
  const editingSubcategories = subcategories[editingExpense?.category] || [];

  useEffect(() => {
    loadBudget();
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

  const formatMoney = (value) => {
    return `$${Number(value || 0).toLocaleString()} MXN`;
  };

  const loadBudget = async () => {
    try {
      const data = await fetchBudgetItems();
      setItems(data);
    } catch (error) {
      console.error(error);
      showError("Could not load budget.");
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

      showSuccess("Expense added successfully 🐷");
    } catch (error) {
      console.error(error);
      showError("Could not add expense.");
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

      showSuccess("Expense status updated");
    } catch (error) {
      console.error(error);
      showError("Could not update expense.");
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
      showSuccess("Expense updated");
    } catch (error) {
      console.error(error);
      showError("Could not update expense.");
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

      showSuccess("Expense deleted");
    } catch (error) {
      console.error(error);
      showError("Could not delete expense.");
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
    <div className="space-y-8">
      {successMessage && (
        <div className="rounded-2xl bg-green-100 text-green-700 px-5 py-4 text-sm font-medium">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="rounded-2xl bg-red-100 text-red-700 px-5 py-4 text-sm font-medium">
          {errorMessage}
        </div>
      )}
      <section>
        <p className="text-sm font-medium text-gray-500">Our Wedding budget</p>

        <h1 className="text-4xl font-bold tracking-tight mt-1">
          Our budget 🐷
        </h1>

        <p className="text-gray-500 mt-2 max-w-2xl">
          Let's keep track of our wedding and honeymoon costs, advance payments
          and completed payments in one calm place.
        </p>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="wos-card rounded-3xl p-6 border border-black/5 shadow-sm">
          <p className="text-sm text-gray-500">Total cost</p>
          <h2 className="text-2xl font-bold mt-2">{formatMoney(total)}</h2>
        </div>

        <div className="wos-card rounded-3xl p-6 border border-black/5 shadow-sm">
          <p className="text-sm text-gray-500">Paid</p>
          <h2 className="text-2xl font-bold mt-2">{formatMoney(paid)}</h2>
        </div>

        <div className="wos-card rounded-3xl p-6 border border-black/5 shadow-sm">
          <p className="text-sm text-gray-500">Advance payments</p>
          <h2 className="text-2xl font-bold mt-2">
            {formatMoney(advancePayments)}
          </h2>
        </div>

        <div className="wos-card rounded-3xl p-6 border border-black/5 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="text-2xl font-bold mt-2">{formatMoney(pending)}</h2>
        </div>
      </section>
      <section className="wos-card rounded-3xl p-4 border border-black/5 shadow-sm flex flex-col gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search expenses..."
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-card"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="advancePayment">Advance Payment</option>
            <option value="paid">Paid</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-card"
          >
            <option value="all">All categories</option>

            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-card"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest cost</option>
            <option value="lowest">Lowest cost</option>
          </select>
        </div>
      </section>{" "}
      <section className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="wos-card p-6 rounded-3xl shadow-sm border border-black/5 xl:sticky xl:top-28"
        >
          <h2 className="text-xl font-semibold">Add expense</h2>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            Add anything we need to pay for.
          </p>

          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Expense title"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
            />

            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              type="number"
              min="0"
              placeholder="Cost"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
            />

            <input
              value={advancePaid}
              onChange={(e) => setAdvancePaid(e.target.value)}
              type="number"
              min="0"
              placeholder="Advance paid"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
            />

            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-card"
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
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-card"
              >
                <option value="">Choose subcategory</option>

                {currentSubcategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-card"
            >
              <option value="pending">Pending</option>
              <option value="advancePayment">Advance Payment</option>
              <option value="paid">Paid</option>
            </select>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes, darling..."
              rows={4}
              maxLength={300}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition resize-none"
            />

            <button
              disabled={loading || !title.trim() || Number(cost) <= 0}
              className="w-full bg-black text-white px-6 py-3 rounded-2xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition"
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="wos-card border border-dashed border-gray-300 rounded-3xl p-10 text-center">
              <h2 className="text-xl font-semibold">No expenses yet</h2>

              <p className="text-gray-500 mt-2">
                Add the first expense to start tracking our budget.
              </p>
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
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
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
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
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
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
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
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-card"
                          >
                            {categories.map((category) => (
                              <option
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
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
                              className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-card"
                            >
                              <option value="">Choose subcategory</option>

                              {editingSubcategories.map((subcategory) => (
                                <option key={subcategory} value={subcategory}>
                                  {subcategory}
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
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-card"
                          >
                            <option value="pending">Pending</option>
                            <option value="advancePayment">
                              Advance Payment
                            </option>
                            <option value="paid">Paid</option>
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
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition resize-none"
                          />

                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => saveEdit(item)}
                              className="text-sm font-medium text-white bg-black px-4 py-2 rounded-2xl hover:bg-gray-800 transition"
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-2xl hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-lg font-semibold">
                            {item.title}
                          </h2>

                          <div className="text-sm text-gray-500 mt-1">
                            <p>
                              {categories.find(
                                (category) => category.value === item.category,
                              )?.label || "Other"}{" "}
                              {item.subcategory ? `· ${item.subcategory}` : ""}{" "}
                              · {formatMoney(item.cost)}
                            </p>

                            {item.advancePaid > 0 && (
                              <p className="mt-1">
                                Advance paid: {formatMoney(item.advancePaid)} ·
                                Remaining:{" "}
                                {formatMoney(item.cost - item.advancePaid)}
                              </p>
                            )}
                          </div>

                          {item.notes && (
                            <p className="text-sm text-gray-500 mt-3 bg-gray-50 rounded-2xl px-4 py-3">
                              {item.notes}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
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
                            className="text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-2xl wos-card hover:bg-gray-50 transition outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="advancePayment">
                              Advance Payment
                            </option>
                            <option value="paid">Paid</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-2xl hover:bg-gray-50 active:scale-95 transition"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => removeItem(item)}
                            className="text-sm font-medium text-red-600 border border-red-100 px-4 py-2 rounded-2xl hover:bg-red-50 active:scale-95 transition"
                          >
                            Delete
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
