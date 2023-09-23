const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

mongoose.connect(
  "mongodb+srv://cedbs:yXaN2jSpIHW0PheJ@cluster0.3zntvvj.mongodb.net/airbnb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model("Item", itemSchema);

app.post("/api/addItem", async (req, res) => {
  try {
    const newItem = new Item({
      name: `Random Item ${Math.floor(Math.random() * 100)}`,
      description: `Description for Random Item`,
    });

    await newItem.save();

    res.json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});

// const listingsRouter = require('./routes/listings');
// app.use('/api/listings', listingsRouter);
