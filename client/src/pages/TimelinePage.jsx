import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchTimelineItems,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} from "../services/timelineService";

import DeleteTimelineModal from "../components/timeline/DeleteTimelineModal.jsx";

const typeConfig = {
  planning: {
    label: "Planning",
    icon: "📝",
    color: "bg-[#fff0f3] text-[#660033]",
  },
  weddingDay: {
    label: "Wedding Day",
    icon: "💍",
    color: "bg-[#f3ebff] text-[#8258ff]",
  },
  honeymoon: {
    label: "Honeymoon",
    icon: "✈️",
    color: "bg-[#eef6ff] text-[#2563eb]",
  },
};

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700",
  },
  inProgress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700",
  },
};

const priorityConfig = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const seedItems = [
  {
    title: "Complete sacraments",
    type: "planning",
    category: "church",
    status: "pending",
    priority: "high",
    notes: "Baptism, First Communion and Confirmation",
    order: 1,
  },
  {
    title: "Schedule premarital counseling",
    type: "planning",
    category: "church",
    status: "pending",
    priority: "high",
    order: 2,
  },
  {
    title: "Explore and compare hotel options",
    type: "planning",
    category: "honeymoon",
    status: "pending",
    priority: "medium",
    order: 3,
  },
  {
    title: "Schedule photography",
    type: "planning",
    category: "vendors",
    status: "pending",
    priority: "high",
    order: 4,
  },
  {
    title: "Make wedding dress",
    type: "planning",
    category: "bride",
    status: "pending",
    priority: "high",
    order: 5,
  },
  {
    title: "Schedule Get Ready Bride",
    type: "planning",
    category: "bride",
    status: "pending",
    priority: "medium",
    order: 6,
  },
  {
    title: "Resolve decoration details",
    type: "planning",
    category: "decor",
    status: "pending",
    priority: "high",
    notes: "Decoration, florals, centerpieces, favors and sweetheart table",
    order: 7,
  },
  {
    title: "Get groom suit",
    type: "planning",
    category: "groom",
    status: "pending",
    priority: "medium",
    order: 8,
  },
  {
    title: "Collect RSVPs",
    type: "planning",
    category: "guests",
    status: "pending",
    priority: "high",
    order: 9,
  },
  {
    title: "Create seating plan",
    type: "planning",
    category: "guests",
    status: "pending",
    priority: "high",
    order: 10,
  },
  {
    title: "Send second and final confirmation",
    type: "planning",
    category: "guests",
    status: "pending",
    priority: "high",
    order: 11,
  },
  {
    title: "Confirm final guest count with venue",
    type: "planning",
    category: "venue",
    status: "pending",
    priority: "high",
    order: 12,
  },
  {
    title: "Final venue walkthrough",
    type: "planning",
    category: "venue",
    status: "pending",
    priority: "medium",
    order: 13,
  },
  {
    title: "Finish venue payments",
    type: "planning",
    category: "budget",
    status: "pending",
    priority: "high",
    order: 14,
  },
  {
    title: "Prepare emergency wedding kit",
    type: "planning",
    category: "details",
    status: "pending",
    priority: "medium",
    order: 15,
  },
  {
    title: "Confirm all vendors",
    type: "planning",
    category: "vendors",
    status: "pending",
    priority: "high",
    order: 16,
  },
  {
    title: "Get Ready Bride",
    type: "weddingDay",
    category: "bride",
    status: "pending",
    priority: "high",
    time: "10:00",
    order: 1,
  },
  {
    title: "Bride leaves",
    type: "weddingDay",
    category: "logistics",
    status: "pending",
    priority: "high",
    time: "12:45",
    order: 2,
  },
  {
    title: "Groom arrival",
    type: "weddingDay",
    category: "groom",
    status: "pending",
    priority: "high",
    time: "13:15",
    order: 3,
  },
  {
    title: "Guest arrival",
    type: "weddingDay",
    category: "guests",
    status: "pending",
    priority: "medium",
    time: "13:30",
    order: 4,
  },
  {
    title: "Wedding Mass",
    type: "weddingDay",
    category: "church",
    status: "pending",
    priority: "high",
    time: "14:00",
    order: 5,
  },
  {
    title: "Wedding photos",
    type: "weddingDay",
    category: "photos",
    status: "pending",
    priority: "high",
    time: "15:00",
    notes: "Couple, family and guests",
    order: 6,
  },
  {
    title: "Transfer to venue",
    type: "weddingDay",
    category: "logistics",
    status: "pending",
    priority: "medium",
    time: "15:50",
    order: 7,
  },
  {
    title: "Reception opens",
    type: "weddingDay",
    category: "reception",
    status: "pending",
    priority: "medium",
    time: "16:00",
    order: 8,
  },
  {
    title: "Newlyweds arrival",
    type: "weddingDay",
    category: "reception",
    status: "pending",
    priority: "high",
    time: "16:30",
    order: 9,
  },
  {
    title: "Meal",
    type: "weddingDay",
    category: "reception",
    status: "pending",
    priority: "high",
    time: "17:00",
    order: 10,
  },
  {
    title: "Party",
    type: "weddingDay",
    category: "party",
    status: "pending",
    priority: "medium",
    time: "18:00",
    order: 11,
  },
  {
    title: "Cake",
    type: "weddingDay",
    category: "reception",
    status: "pending",
    priority: "medium",
    time: "19:00",
    order: 12,
  },
  {
    title: "Bouquet toss",
    type: "weddingDay",
    category: "tradition",
    status: "pending",
    priority: "medium",
    time: "19:30",
    order: 13,
  },
  {
    title: "Final photos",
    type: "weddingDay",
    category: "photos",
    status: "pending",
    priority: "medium",
    time: "20:30",
    order: 14,
  },
  {
    title: "Departure",
    type: "weddingDay",
    category: "logistics",
    status: "pending",
    priority: "high",
    time: "21:00",
    order: 15,
  },
];

function TimelinePage() {
  const [items, setItems] = useState([]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("planning");
  const [category, setCategory] = useState("general");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [order, setOrder] = useState("");

  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("all");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [celebratedId, setCelebratedId] = useState(null);
  const navigate = useNavigate();

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
      showError("Could not load timeline.");
    }
  };

  const formatDate = (value) => {
    if (!value) return "No date";

    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredItems =
    activeType === "all"
      ? items
      : items.filter((item) => item.type === activeType);

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.type === "weddingDay" && b.type === "weddingDay") {
      return (a.time || "").localeCompare(b.time || "");
    }

    return (a.order || 0) - (b.order || 0);
  });

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

      const newItem = await createTimelineItem({
        title,
        type,
        category: category.trim() || "general",
        status,
        priority,
        date: date || null,
        time: time || null,
        notes: notes.trim() || null,
        order: Number(order) || 0,
        isCurrent: false,
      });

      setItems((prev) => [...prev, newItem]);

      setTitle("");
      setType("planning");
      setCategory("general");
      setStatus("pending");
      setPriority("medium");
      setDate("");
      setTime("");
      setNotes("");
      setOrder("");

      showSuccess("Timeline step added 🌷");
    } catch (error) {
      console.error(error);
      showError("Could not add timeline step.");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (item, nextStatus) => {
    try {
      const updatedItem = await updateTimelineItem(item.id, {
        status: nextStatus,
        isCurrent: nextStatus === "completed" ? false : item.isCurrent,
      });

      setItems((prev) =>
        prev.map((current) =>
          current.id === updatedItem.id ? updatedItem : current,
        ),
      );

      if (nextStatus === "completed") {
        setCelebratedId(item.id);
        showSuccess("One more step completed ✨");

        setTimeout(() => setCelebratedId(null), 1800);
      } else {
        showSuccess("Timeline status updated");
      }
    } catch (error) {
      console.error(error);
      showError("Could not update timeline step.");
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
          ? "Marked as where we are 💗"
          : "Removed current marker",
      );
    } catch (error) {
      console.error(error);
      showError("Could not update current marker.");
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
      date: item.date?.split("T")[0] || "",
      time: item.time || "",
      notes: item.notes || "",
      order: item.order || 0,
      isCurrent: Boolean(item.isCurrent),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingItem(null);
  };

  const saveEdit = async (item) => {
    try {
      const updatedItem = await updateTimelineItem(item.id, {
        ...editingItem,
        category: editingItem.category.trim() || "general",
        date: editingItem.date || null,
        time: editingItem.time || null,
        notes: editingItem.notes.trim() || null,
        order: Number(editingItem.order) || 0,
        isCurrent:
          editingItem.status === "completed" ? false : editingItem.isCurrent,
      });

      setItems((prev) =>
        prev.map((current) =>
          current.id === updatedItem.id ? updatedItem : current,
        ),
      );

      cancelEdit();
      showSuccess("Timeline step updated");
    } catch (error) {
      console.error(error);
      showError("Could not update timeline step.");
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

      showSuccess("Timeline step deleted");
    } catch (error) {
      console.error(error);
      showError("Could not delete timeline step.");
    } finally {
      setItemToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const seedTimeline = async () => {
    try {
      setLoading(true);

      const createdItems = [];

      for (const item of seedItems) {
        const created = await createTimelineItem(item);
        createdItems.push(created);
      }

      setItems((prev) => [...prev, ...createdItems]);
      showSuccess("Our timeline was created 💗");
    } catch (error) {
      console.error(error);
      showError("Could not seed timeline.");
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntil = (dateValue) => {
    if (!dateValue) return null;

    const today = new Date();
    const target = new Date(dateValue);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  const getSignal = (item) => {
    const daysUntil = getDaysUntil(item.date);

    if (item.status === "completed") return null;

    if (daysUntil !== null && daysUntil < 0) {
      return {
        label: "Late",
        className: "bg-red-100 text-red-700",
      };
    }

    if (daysUntil !== null && daysUntil <= 7) {
      return {
        label: "Coming soon",
        className: "bg-amber-100 text-amber-700",
      };
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

  const nextItem = [...items]
    .filter((item) => item.status !== "completed")
    .sort((a, b) => {
      if (a.date && b.date) return new Date(a.date) - new Date(b.date);

      return (a.order || 0) - (b.order || 0);
    })[0];

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

      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#fff0f3] via-[#fff8fa] to-[#f3edf8] border border-[#eadde2] p-8 lg:p-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/50" />
        <div className="absolute right-24 -bottom-28 h-80 w-80 rounded-full bg-[#f2c8d4]/35" />

        <div className="relative z-10 max-w-3xl">
          <p className="text-[#8d7380] text-sm font-medium mb-5">
            Our wedding timeline 🛤️
          </p>

          <h1 className="text-[#38131f] text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            The little path to our forever.
          </h1>

          <p className="text-[#7f7079] text-lg mt-6 leading-relaxed max-w-2xl">
            Planning tasks, wedding day moments and honeymoon steps organized
            like a romantic little road we walk together.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">Total steps</p>
          <h2 className="text-4xl font-bold mt-2">{items.length}</h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">Completed</p>
          <h2 className="text-4xl font-bold mt-2">{completedItems}</h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">Progress</p>
          <h2 className="text-4xl font-bold mt-2">{progress}%</h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">We’re here</p>

          <h2 className="text-xl font-serif font-semibold mt-3 line-clamp-2">
            {currentItems[0]?.title || "Choose a step 💗"}
          </h2>
        </div>
      </section>
      <section className="wos-soft-card p-6">
        <p className="text-sm text-[#8d7380]">Next step</p>

        <h2 className="text-3xl font-serif text-[#38131f] mt-2">
          {nextItem?.title || "Everything looks complete ✨"}
        </h2>

        {nextItem && (
          <p className="text-sm text-[#7f7079] mt-2">
            {nextItem.category} · {formatDate(nextItem.date)}
            {nextItem.time ? ` · ${nextItem.time}` : ""}
          </p>
        )}
      </section>

      {items.length === 0 && (
        <section className="wos-soft-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif text-[#38131f]">
              Create our real timeline
            </h2>
            <p className="text-sm text-[#7f7079] mt-1">
              Add the planning and wedding day steps we already defined.
            </p>
          </div>

          <button
            type="button"
            onClick={seedTimeline}
            className="wos-button"
            disabled={loading}
          >
            Seed our timeline
          </button>
        </section>
      )}

      <section className="flex flex-wrap gap-3">
        {[
          { value: "all", label: "All", icon: "♡" },
          { value: "planning", label: "Planning", icon: "📝" },
          { value: "weddingDay", label: "Wedding Day", icon: "💍" },
          { value: "honeymoon", label: "Honeymoon", icon: "✈️" },
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
          className="wos-card p-6 xl:sticky xl:top-28 overflow-hidden relative"
        >
          <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#fff0f3]" />

          <div className="relative z-10 space-y-4">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-[#38131f]">
                Add timeline step 🌷
              </h2>

              <p className="text-sm text-[#7f7079] mt-2">
                Add anything new without changing code later.
              </p>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Step title"
              className="wos-input"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="wos-input"
            >
              <option value="planning">Planning</option>
              <option value="weddingDay">Wedding Day</option>
              <option value="honeymoon">Honeymoon</option>
            </select>

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="wos-input"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="wos-input"
            >
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="wos-input"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
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

            <input
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              type="number"
              placeholder="Order"
              className="wos-input"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes, darling..."
              rows={4}
              maxLength={500}
              className="wos-input resize-none"
            />

            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full wos-button"
            >
              {loading ? "Adding..." : "Add Step"}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute left-7 top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-[#660033] via-[#f2c8d4] to-[#660033]/20" />

          <div className="space-y-5">
            {sortedItems.length === 0 ? (
              <div className="wos-card p-10 text-center">
                <h2 className="text-2xl font-serif font-semibold text-[#38131f]">
                  No timeline steps yet
                </h2>

                <p className="text-[#7f7079] mt-2">
                  Add the first step of our little wedding path.
                </p>
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
                  <article key={item.id} className="relative pl-20">
                    <div
                      className={`absolute left-0 top-6 h-14 w-14 rounded-full border-4 shadow-[0_10px_30px_rgba(80,40,55,0.12)] flex items-center justify-center text-xl z-10 ${
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
                                <option value="planning">Planning</option>
                                <option value="weddingDay">Wedding Day</option>
                                <option value="honeymoon">Honeymoon</option>
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
                                <option value="pending">Pending</option>
                                <option value="inProgress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
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
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
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

                              <input
                                type="number"
                                value={editingItem.order}
                                onChange={(e) =>
                                  setEditingItem((prev) => ({
                                    ...prev,
                                    order: e.target.value,
                                  }))
                                }
                                className="wos-input"
                              />

                              <label className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadde2] px-4 py-3">
                                <span className="text-sm font-semibold text-[#38131f]">
                                  We’re here
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
                                  Save
                                </button>

                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="text-sm font-medium text-gray-700 border border-[#eadde2] px-4 py-2 rounded-2xl hover:bg-[#fff8fa] transition"
                                >
                                  Cancel
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
                                    We’re here 💗
                                  </span>
                                )}
                              </div>

                              <div>
                                <h2 className="text-xl font-semibold text-[#38131f]">
                                  {item.title}
                                </h2>

                                <p className="text-sm text-[#7f7079] mt-2">
                                  {item.category} · {formatDate(item.date)}{" "}
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
                          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-4 border-t border-[#f0e2e7]">
                            <select
                              value={item.status}
                              onChange={(e) =>
                                changeStatus(item, e.target.value)
                              }
                              className="text-sm font-medium text-gray-700 border border-[#eadde2] px-4 py-2 rounded-2xl bg-white hover:bg-[#fff8fa] transition outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="inProgress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {modulePath && (
                              <button
                                type="button"
                                onClick={() => navigate(modulePath)}
                                className="text-sm font-medium text-[#660033] border border-[#eadde2] px-4 py-2 rounded-2xl hover:bg-[#fff8fa] transition"
                              >
                                Open module
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => toggleCurrent(item)}
                              className="text-sm font-medium text-[#660033] border border-[#eadde2] px-4 py-2 rounded-2xl hover:bg-[#fff8fa] transition"
                            >
                              {item.isCurrent ? "Unset here" : "We’re here"}
                            </button>

                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              className="text-sm font-medium text-gray-700 border border-[#eadde2] px-4 py-2 rounded-2xl hover:bg-[#fff8fa] transition"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => removeItem(item)}
                              className="text-sm font-medium text-red-600 border border-red-100 px-4 py-2 rounded-2xl hover:bg-red-50 transition"
                            >
                              Delete
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
