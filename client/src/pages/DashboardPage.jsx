import { useEffect, useState } from "react";

import {
  fetchDashboardCards,
  updateDashboardCard,
  fetchDashboardTasks,
  createDashboardTask,
  updateDashboardTask,
  createDashboardCard,
} from "../services/dashboardService";
import { useTranslation } from "../context/PreferencesContext.jsx";

function DashboardPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [taskFilter, setTaskFilter] = useState("pending");
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStatus, setNewStatus] = useState("Next");

  const [showCardForm, setShowCardForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardText, setNewCardText] = useState("");
  const [newCardStatus, setNewCardStatus] = useState("Next");
  const [newCardIcon, setNewCardIcon] = useState("✨");
  const [newCardPath, setNewCardPath] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [cardsData, tasksData] = await Promise.all([
        fetchDashboardCards(),
        fetchDashboardTasks(),
      ]);

      setCategories(cardsData);
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryStatusChange = async (id, newStatus) => {
    try {
      const updatedCard = await updateDashboardCard(id, {
        status: newStatus,
      });

      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCard : cat)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskStatusChange = async (id, newStatus) => {
    try {
      const updatedTask = await updateDashboardTask(id, {
        status: newStatus,
      });

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!newTitle.trim()) return;

    try {
      const createdTask = await createDashboardTask({
        title: newTitle,
        desc: newDesc,
        status: newStatus,
        order: tasks.length + 1,
      });

      setTasks((prev) => [...prev, createdTask]);

      setNewTitle("");
      setNewDesc("");
      setNewStatus("Next");
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();

    if (!newCardTitle.trim() || !newCardText.trim()) return;

    try {
      const createdCard = await createDashboardCard({
        key: newCardTitle.toLowerCase().replaceAll(" ", "-"),
        title: newCardTitle,
        status: newCardStatus,
        text: newCardText,
        accent: "bg-[#f3edf8]",
        icon: newCardIcon,
        path: newCardPath.trim() || null,
        order: categories.length + 1,
      });

      setCategories((prev) => [...prev, createdCard]);

      setNewCardTitle("");
      setNewCardText("");
      setNewCardStatus("Next");
      setNewCardIcon("✨");
      setNewCardPath("");
      setShowCardForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === "completed") {
      return task.status === "Done";
    }

    return task.status === "InProgress" || task.status === "Next";
  });

  const getStatusLabel = (status) => {
    if (status === "InProgress") return t("status.inProgress");
    if (status === "Live") return t("status.live");
    if (status === "Next") return t("status.next");
    if (status === "Done") return t("status.done");
    return status;
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#f6dde4] via-[#fdf6f7] to-[#fdeff2] border border-[#ead6dc] p-8 lg:p-12">
        <div className="absolute right-[-120px] top-[-100px] h-[260px] w-[260px] rounded-full bg-[#f2c8d4]/40" />
        <div className="absolute right-[60px] bottom-[-120px] h-[320px] w-[320px] rounded-full bg-[#f5dfe5]/60" />

        <div className="relative z-10 max-w-3xl">
          <p className="text-[#7f5f69] text-sm font-medium mb-6">
            {t("dashboard.heroEyebrow")}
          </p>
          <h1 className="text-[#38131f] text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            {t("dashboard.heroTitle")}
          </h1>
          <p className="text-[#6e6168] text-lg mt-7 leading-relaxed max-w-2xl">
            {t("dashboard.heroSubtitle")}
          </p>
        </div>
      </section>

      <section className="wos-card rounded-[2rem] p-6 border border-[#eadde2] bg-white shadow-[0_12px_35px_rgba(80,40,55,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-[#8d7380]">{t("dashboard.modules")}</p>
            <h2 className="text-3xl font-serif text-[#38131f] mt-2">
              {t("dashboard.addCard")}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowCardForm(!showCardForm)}
            className="self-start sm:self-center text-xs font-sans font-semibold bg-[#38131f] text-white rounded-full px-4 py-2 hover:bg-opacity-90 transition shadow-sm shrink-0"
          >
            {showCardForm ? t("common.closeForm") : t("dashboard.addCardBtn")}
          </button>
        </div>

        {showCardForm && (
          <form
            onSubmit={handleAddCard}
            className="mt-6 p-5 border border-[#eadde2] bg-[#fffbfb] rounded-3xl space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder={t("dashboard.cardTitle")}
                className="wos-input text-xs"
                required
              />

              <select
                value={newCardStatus}
                onChange={(e) => setNewCardStatus(e.target.value)}
                className="wos-input text-xs cursor-pointer"
              >
                <option value="Live">{t("status.live")}</option>
                <option value="InProgress">{t("status.inProgress")}</option>
                <option value="Next">{t("status.next")}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={newCardIcon}
                onChange={(e) => setNewCardIcon(e.target.value)}
                placeholder={t("dashboard.icon")}
                className="wos-input text-xs"
              />

              <input
                value={newCardPath}
                onChange={(e) => setNewCardPath(e.target.value)}
                placeholder={t("dashboard.cardPathPlaceholder")}
                className="wos-input text-xs"
              />
            </div>

            <input
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              placeholder={t("dashboard.cardDescription")}
              className="w-full wos-input text-xs"
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="text-xs font-sans font-semibold bg-emerald-600 text-white rounded-full px-5 py-2 hover:bg-opacity-90 transition shadow-sm"
              >
                {t("dashboard.saveCard")}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((card) => {
          const isLive = card.status === "Live";

          return (
            <div
              key={card.id}
              className="wos-card relative overflow-hidden rounded-[2rem] p-6 border border-[#eadde2] bg-white shadow-[0_12px_35px_rgba(80,40,55,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(80,40,55,0.1)] transition"
            >
              {isLive && (
                <div className="absolute top-4 right-4 flex h-2.5 w-2.5 pointer-events-none z-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-10 w-10 rounded-xl ${card.accent} flex items-center justify-center text-lg shrink-0`}
                  >
                    {card.icon}
                  </div>
                  <p className="text-sm font-medium text-[#8d7380] truncate">
                    {card.title}
                  </p>
                </div>

                <div
                  className="relative shrink-0 ml-auto mr-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <select
                    value={card.status}
                    onChange={(e) =>
                      handleCategoryStatusChange(card.id, e.target.value)
                    }
                    className="text-xs font-sans font-semibold text-[#38131f] bg-[#fcf8f9] border border-[#eadde2] rounded-full pl-3 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#38131f] cursor-pointer appearance-none text-center min-w-[105px]"
                  >
                    <option value="Live">{t("status.live")}</option>
                    <option value="InProgress">{t("status.inProgress")}</option>
                    <option value="Next">{t("status.next")}</option>
                  </select>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#38131f]/60 pointer-events-none">
                    ▼
                  </span>
                </div>
              </div>

              <div className="relative z-10 flex flex-col justify-between h-[calc(100%-3.5rem)]">
                <p className="text-sm text-[#7f7079] leading-relaxed">
                  {card.text}
                </p>

                {isLive && card.path && (
                  <div className="mt-4 flex justify-end">
                    <a
                      href={card.path}
                      className="text-xs font-sans font-semibold text-[#38131f] text-opacity-80 hover:text-opacity-100 hover:underline transition tracking-tight"
                    >
                      {t("dashboard.takeMeThere")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="wos-card rounded-[2rem] p-8 border border-[#eadde2] bg-white shadow-[0_12px_35px_rgba(80,40,55,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-[#8d7380]">
                {t("dashboard.planningProgress")}
              </p>
              <h2 className="text-3xl font-serif text-[#38131f] mt-2">
                {t("dashboard.workingOn")}
              </h2>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="self-start sm:self-center text-xs font-sans font-semibold bg-[#38131f] text-white rounded-full px-4 py-2 hover:bg-opacity-90 transition shadow-sm shrink-0"
            >
              {showForm ? t("common.closeForm") : t("dashboard.addTask")}
            </button>
          </div>

          <div className="flex gap-2 mt-6 border-b border-[#f1e4e7] pb-3">
            <button
              onClick={() => setTaskFilter("pending")}
              className={`text-xs font-sans font-semibold px-4 py-1.5 rounded-full transition ${
                taskFilter === "pending"
                  ? "bg-[#fff0f3] text-[#38131f] border border-[#eadde2]"
                  : "text-[#8d7380] hover:text-[#38131f]"
              }`}
            >
              {t("dashboard.pendingTasks")}
            </button>

            <button
              onClick={() => setTaskFilter("completed")}
              className={`text-xs font-sans font-semibold px-4 py-1.5 rounded-full transition ${
                taskFilter === "completed"
                  ? "bg-[#eaf7ef] text-[#2f7a45] border border-emerald-200"
                  : "text-[#8d7380] hover:text-[#38131f]"
              }`}
            >
              {t("dashboard.completed")}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleAddTask}
              className="mt-6 p-5 border border-[#eadde2] bg-[#fffbfb] rounded-3xl space-y-4"
            >
              <h4 className="text-sm font-semibold wos-text-heading">
                {t("dashboard.createTask")}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t("dashboard.taskTitle")}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="wos-input text-xs"
                  required
                />

                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="wos-input text-xs cursor-pointer"
                >
                  <option value="InProgress">{t("status.inProgress")}</option>
                  <option value="Next">{t("status.next")}</option>
                  <option value="Done">{t("status.done")}</option>
                </select>
              </div>

              <input
                type="text"
                placeholder={t("dashboard.taskDescription")}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full wos-input text-xs"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-xs font-sans font-semibold bg-emerald-600 text-white rounded-full px-5 py-2 hover:bg-opacity-90 transition shadow-sm"
                >
                  {t("dashboard.saveTask")}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 space-y-5">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((item) => {
                const isDone = item.status === "Done";

                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl border p-5 transition ${
                      isDone
                        ? "border-emerald-100 bg-[#f4fbf7]/60 opacity-75"
                        : "border-[#f1e4e7] hover:bg-[#fff9fa]"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        {isDone && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">
                            ✓
                          </span>
                        )}

                        <div>
                          <h3
                            className={`font-semibold text-[#38131f] transition ${
                              isDone ? "line-through text-gray-400" : ""
                            }`}
                          >
                            {item.title}
                          </h3>

                          <p
                            className={`text-sm mt-1 transition ${
                              isDone ? "text-gray-400" : "text-[#8d7380]"
                            }`}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleTaskStatusChange(item.id, e.target.value)
                        }
                        className={`text-xs rounded-full px-3 py-1.5 font-medium border-0 focus:ring-2 focus:ring-[#38131f] cursor-pointer appearance-none text-center ${
                          item.status === "Done"
                            ? "bg-[#eaf7ef] text-[#2f7a45]"
                            : item.status === "InProgress"
                              ? "bg-[#eef0ff] text-[#4656d6]"
                              : "bg-[#fff4e5] text-[#9d6a00]"
                        }`}
                      >
                        <option value="Done">{t("status.done")}</option>
                        <option value="InProgress">
                          {t("status.inProgress")}
                        </option>
                        <option value="Next">{t("status.next")}</option>
                      </select>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-center wos-text-muted py-6 bg-[#fff8fa]/50 rounded-2xl border border-dashed border-[#eadde2]">
                {t("dashboard.noTasks")}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-[#fff8f8] to-[#f8eef1] border border-[#eadde2] p-8">
          <p className="text-sm text-[#8d7380]">{t("common.appName")}</p>

          <h2 className="text-4xl font-serif text-[#38131f] mt-3 leading-tight">
            Our beautiful planning universe ❤️
          </h2>

          <p className="wos-text-muted mt-5 leading-relaxed">
            {t("dashboard.universeSubtitle")}
          </p>

          <div className="mt-8 rounded-[1.75rem] bg-white/70 p-5 border border-white shadow-sm">
            <p className="text-sm font-semibold wos-text-heading">
              {t("dashboard.currentMilestone")}
            </p>

            <p className="text-sm text-[#8d7380] mt-2">
              {t("dashboard.currentMilestoneText")}
            </p>
          </div>

          <div className="mt-8 rounded-[1.75rem] bg-white/70 p-5 border border-white shadow-sm">
            <p className="text-sm font-semibold wos-text-heading">
              {t("dashboard.nextMilestone")}
            </p>

            <p className="text-sm text-[#8d7380] mt-2">
              {t("dashboard.nextMilestoneText")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
