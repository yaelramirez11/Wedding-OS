const prisma = require("../lib/prisma");

const getGuests = async (req, res) => {
  try {
    const guests = await prisma.guest.findMany();

    res.json(guests);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch guests",
    });
  }
};

module.exports = {
  getGuests,
};
