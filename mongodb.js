const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUI = require("swagger-ui-express");

const swaggerDoc = require("./swagger.json");
const Book = require("./dbconnection");
const authRoutes = require("./auth");
const authenticateToken = require("./jwt");

dotenv.config();

const app = express();

// Connect to MongoDB with Mongoose
mongoose
  .connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to MongoDB API");
});

app.get("/api/books", authenticateToken, async (req, res) => {
  try {
    const books = await Book.find({});
    res.send(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/books/:id", authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.send(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/api/books/addbook", authenticateToken, async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
  });

  try {
    await book.save();

    console.log(book);
    res.json(book);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.put("/api/books/:id", authenticateToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.send(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/api/books/:id", authenticateToken, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.send("Book is deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
