import GuestCard from "./GuestCard.jsx";

function GuestList({
  guests,
  isLoading,
  onChangeStatus,
  onDeleteGuest,
  onUpdateGuestName,
  hasGuests,
}) {
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
        <h2 className="text-xl font-semibold text-gray-900">
          {hasGuests ? "No matching guests" : "No guests yet"}
        </h2>

        <p className="text-gray-500 mt-2">
          {hasGuests
            ? "Try changing the search or filter to find who you’re looking for."
            : "Add your first guest to start building our wedding list."}
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
