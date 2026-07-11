import GuestCard from "./GuestCard.jsx";
import { useTranslation } from "../../context/PreferencesContext.jsx";

function GuestList({
  guests,
  isLoading,
  onChangeStatus,
  onDeleteGuest,
  onUpdateGuestName,
  hasGuests,
}) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 wos-card rounded-2xl animate-pulse" />
        <div className="h-24 wos-card rounded-2xl animate-pulse" />
        <div className="h-24 wos-card rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className="wos-card border border-dashed border-gray-300 rounded-3xl p-10 text-center">
        <h2 className="text-xl font-semibold wos-text-heading">
          {hasGuests ? t("guests.noMatchingGuests") : t("guests.noGuests")}
        </h2>

        <p className="wos-text-muted mt-2">
          {hasGuests ? t("guests.noMatchingHint") : t("guests.noGuestsHint")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {guests.map((guest) => (
        <GuestCard
          key={guest.id}
          guest={guest}
          onChangeStatus={onChangeStatus}
          onDeleteGuest={onDeleteGuest}
          onUpdateGuestName={onUpdateGuestName}
        />
      ))}
    </div>
  );
}

export default GuestList;
