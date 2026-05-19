function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#f6dde4] via-[#fdf6f7] to-[#fdeff2] border border-[#ead6dc] p-8 lg:p-12">
        <div className="absolute right-[-120px] top-[-100px] h-[260px] w-[260px] rounded-full bg-[#f2c8d4]/40" />

        <div className="absolute right-[60px] bottom-[-120px] h-[320px] w-[320px] rounded-full bg-[#f5dfe5]/60" />

        <div className="relative z-10 max-w-3xl">
          <p className="text-[#7f5f69] text-sm font-medium mb-6">
            Our Wedding + Honeymoon Interface 🍯
          </p>

          <h1 className="text-[#38131f] text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            One cozy place for everything we’re planning together.
          </h1>

          <p className="text-[#6e6168] text-lg mt-7 leading-relaxed max-w-2xl">
            Guests, RSVP, budget, honeymoon ideas, documents, memories and all
            the little details for our wedding season ❤️
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            title: "Guests",
            status: "Live",
            text: "Let’s keep track of who’s invited, confirmed or still pending.",
            accent: "bg-[#fff0f3]",
          },
          {
            title: "Budget",
            status: "Live",
            text: "A simple place to organize costs, deposits and payments without stress.",
            accent: "bg-[#f8efe7]",
          },
          {
            title: "Honeymoon",
            status: "Next",
            text: "Flights, hotel, itinerary, ideas and documents for our trip.",
            accent: "bg-[#f3edf8]",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="wos-card rounded-[2rem] p-6 border border-[#eadde2] shadow-[0_12px_35px_rgba(80,40,55,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(80,40,55,0.1)] transition"
          >
            <div
              className={`h-12 w-12 rounded-2xl ${card.accent} mb-5 flex items-center justify-center text-xl`}
            >
              {
                {
                  Guests: "👥",
                  Budget: "🐷",
                  Honeymoon: "✈️",
                }[card.title]
              }
            </div>

            <p className="text-sm text-[#8d7380]">{card.title}</p>

            <h2 className="text-3xl font-serif font-semibold text-[#38131f] mt-2">
              {card.status}
            </h2>

            <p className="text-sm text-[#7f7079] mt-3 leading-relaxed">
              {card.text}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="wos-card rounded-[2rem] p-8 border border-[#eadde2] shadow-[0_12px_35px_rgba(80,40,55,0.06)]">
          <p className="text-sm text-[#8d7380]">Planning progress</p>

          <h2 className="text-3xl font-serif text-[#38131f] mt-2">
            What we're working on
          </h2>

          <div className="mt-8 space-y-5">
            {[
              {
                title: "Guests",
                desc: "Guest list, RSVP and organization.",
                status: "Done",
              },

              {
                title: "Budget",
                desc: "Track costs and payments together.",
                status: "In Progress",
              },

              {
                title: "Honeymoon",
                desc: "Flights, hotels, ideas and itinerary.",
                status: "Next",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[#f1e4e7] p-5 hover:bg-[#fff9fa] transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-[#38131f]">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#8d7380] mt-2">{item.desc}</p>
                  </div>

                  <span
                    className={`
              text-xs
              rounded-full
              px-3
              py-1

              ${
                item.status === "Done"
                  ? "bg-[#eaf7ef] text-[#2f7a45]"
                  : item.status === "In Progress"
                    ? "bg-[#eef0ff] text-[#4656d6]"
                    : "bg-[#fff4e5] text-[#9d6a00]"
              }
            `}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-[#fff8f8] to-[#f8eef1] border border-[#eadde2] p-8">
          <p className="text-sm text-[#8d7380]">WeddingOS</p>

          <h2 className="text-4xl font-serif text-[#38131f] mt-3 leading-tight">
            Our little planning universe ❤️
          </h2>

          <p className="text-[#7f7079] mt-5 leading-relaxed">
            One place for guests, budget, honeymoon plans, memories and all the
            tiny details we don’t want to forget.
          </p>

          <div className="mt-8 rounded-[1.75rem] wos-card/70 p-5 border border-white">
            <p className="text-sm font-semibold text-[#38131f]">
              Current milestone
            </p>

            <p className="text-sm text-[#8d7380] mt-2">
              Finish our wedding budget and unlock honeymoon planning ✈️
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
