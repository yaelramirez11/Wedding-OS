const express = require("express");
const cors = require("cors");

const guestRoutes = require("./routes/guestRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "WeddingOS API running",
  });
});

app.use("/guests", guestRoutes);
app.use("/budget", budgetRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
