const mongoose = require("mongoose");
const { type } = require("os");
const mongodb = () => {
  const con = mongoose.connect("mongodb://localhost:27017/");
  con.then(() => {
    console.log("connexted to the database");
  });
  con.catch(() => {
    console.log("failed to connect to the db");
  });
};
const books = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});
const Book = new mongoose.model("books", books);

module.exports = Book;
