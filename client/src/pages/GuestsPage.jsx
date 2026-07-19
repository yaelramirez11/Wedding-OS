import { useEffect, useState } from "react";

import {
  fetchGuests,
  createGuest,
  updateGuest,
  deleteGuest,
} from "../services/guestService";

import GuestList from "../components/guests/GuestList.jsx";
import GuestForm from "../components/guests/GuestForm.jsx";
import GuestFilters from "../components/guests/GuestFilters.jsx";
import DeleteConfirmationModal from "../components/guests/DeleteConfirmationModal.jsx";
import { useTranslation } from "../context/PreferencesContext.jsx";

function GuestsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isFetching, setIsFetching] = useState(true);
  const [guests, setGuests] = useState([]);
  const [name, setName] = useState("");
  const [side, setSide] = useState("both");
  const [plusOneAllowed, setPlusOneAllowed] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [guestToDelete, setGuestToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sideFilter, setSideFilter] = useState("all");

  const totalGuests = guests.length;
  const confirmedGuests = guests.filter(
    (guest) => guest.status === "confirmed",
  ).length;

  const pendingGuests = guests.filter(
    (guest) => guest.status === "pending",
  ).length;

  const declinedGuests = guests.filter(
    (guest) => guest.status === "declined",
  ).length;

  const notSureGuests = guests.filter(
    (guest) => guest.status === "maybe",
  ).length;

  useEffect(() => {
    loadGuests();
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

  const loadGuests = async () => {
    try {
      setIsFetching(true);
      const data = await fetchGuests();
      setGuests(data);
    } catch (error) {
      console.error(error);
      showError(t("guests.loadError"));
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim().length < 3) return;

    try {
      setLoading(true);

      const newGuest = await createGuest({
        name,
        status: "pending",
        side,
        plusOneAllowed,
        notes: notes.trim() || null,
      });

      setGuests((prev) => [newGuest, ...prev]);
      setName("");
      setSide("both");
      setPlusOneAllowed(false);
      setNotes("");
      showSuccess(t("guests.addSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("guests.addError"));
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (guest, status) => {
    try {
      const updatedGuest = await updateGuest(guest.id, {
        status,
      });

      setGuests((prev) =>
        prev.map((item) => (item.id === updatedGuest.id ? updatedGuest : item)),
      );

      showSuccess(t("guests.statusUpdateSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("guests.statusUpdateError"));
    }
  };

  const handleDeleteGuest = (guest) => {
    setGuestToDelete(guest);
    setIsDeleteModalOpen(true);
  };
  const confirmDeleteGuest = async () => {
    if (!guestToDelete) return;

    try {
      await deleteGuest(guestToDelete.id);

      setGuests((prev) => prev.filter((item) => item.id !== guestToDelete.id));

      showSuccess(t("guests.deleteSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("guests.deleteError"));
    } finally {
      setGuestToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const filteredGuests = guests
    .filter((guest) => {
      const matchesSide = sideFilter === "all" || guest.side === sideFilter;
      const matchesSearch = guest.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = status === "all" || guest.status === status;

      return matchesSearch && matchesStatus && matchesSide;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const handleUpdateGuestName = async (guest, updates) => {
    try {
      const updatedGuest = await updateGuest(guest.id, updates);

      setGuests((prev) =>
        prev.map((item) => (item.id === updatedGuest.id ? updatedGuest : item)),
      );

      showSuccess(t("guests.updateSuccess"));
    } catch (error) {
      console.error(error);
      showError(t("guests.updateError"));
    }
  };

  return (
    <div className="space-y-8 wos-page-content">
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

      <section className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium wos-text-muted">
            {t("guests.eyebrow")}
          </p>

          <h1 className="text-4xl font-bold tracking-tight mt-1 wos-text-heading">
            {t("guests.title")}
          </h1>

          <p className="wos-text-muted mt-2 max-w-2xl">{t("guests.subtitle")}</p>
        </div>

        <div className="wos-stat-grid">
          {[
            {
              label: t("guests.totalGuests"),
              value: totalGuests,
              icon: "👥",
              color: "bg-[#fff0f3] text-[#d24d7a]",
            },

            {
              label: t("status.confirmed"),
              value: confirmedGuests,
              icon: "✓",
              color: "bg-[#ecfbf1] text-[#2fa060]",
            },

            {
              label: t("status.pending"),
              value: pendingGuests,
              icon: "⌛",
              color: "bg-[#fff7ea] text-[#e28a18]",
            },

            {
              label: t("status.declined"),
              value: declinedGuests,
              icon: "×",
              color: "bg-[#fff0f1] text-[#f05252]",
            },

            {
              label: t("guests.notSure"),
              value: notSureGuests,
              icon: "?",
              color: "bg-[#f3ebff] text-[#8258ff]",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="wos-card p-6 flex items-center gap-5 min-h-[140px] min-w-0"
            >
              <div
                className={`
        h-16
        w-16
        rounded-full
        flex
        items-center
        justify-center
        text-2xl
        font-bold
        ${card.color}
      `}
              >
                {card.icon}
              </div>

              <div className="min-w-0">
                <p className="text-sm text-[#8d7380]">{card.label}</p>

                <div className="flex items-end gap-3 mt-2">
                  <h2 className="wos-stat-value font-bold text-[#241c21]">
                    {card.value}
                  </h2>

                  <span className="text-xs text-[#b08f9b] mb-2">
                    {t("common.guests")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wos-split-layout">
        <GuestForm
          name={name}
          setName={setName}
          side={side}
          setSide={setSide}
          plusOneAllowed={plusOneAllowed}
          setPlusOneAllowed={setPlusOneAllowed}
          notes={notes}
          setNotes={setNotes}
          loading={loading}
          onSubmit={handleSubmit}
        />

        <div className="space-y-4">
          <GuestFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            sideFilter={sideFilter}
            setSideFilter={setSideFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <GuestList
            guests={filteredGuests}
            isLoading={isFetching}
            onChangeStatus={handleChangeStatus}
            onDeleteGuest={handleDeleteGuest}
            hasGuests={guests.length > 0}
            onUpdateGuestName={handleUpdateGuestName}
          />

          <DeleteConfirmationModal
            open={isDeleteModalOpen}
            guest={guestToDelete}
            onClose={() => {
              setGuestToDelete(null);
              setIsDeleteModalOpen(false);
            }}
            onConfirm={confirmDeleteGuest}
          />
        </div>
      </section>
    </div>
  );
}

export default GuestsPage;
