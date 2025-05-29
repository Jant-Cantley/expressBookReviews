const express = require('express');
let books = require("./booksdb.js");
const { JsonWebTokenError } = require('jsonwebtoken');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//adding new users
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message:  `User ${username} successfully registred. Now you can login`});
    } else {
      return res.status(404).json({message: `User ${username} already exists!`});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10 - Get the book list available in the shop
public_users.get('/',function (req, res) {
  const get_books = new Promise ((resolve, reject) => {
  resolve(res.send(JSON.stringify({books}, null, 4)));
  });
  get_books.then(() => console.log("Promise for Task 10 resolved"));
});

//Task 11 - Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise ((resolve, reject) => {
      const isbn = req.params.isbn;
      //console.log(isbn);
        if (req.params.isbn <= 10) {
          resolve(res.send(books[isbn]));
        } else {
          reject(res.send('ISBN not found'))
        }
    });
    get_books_isbn.then(function() {
          console.log("promise for task 11 is resolved");
        });
 });
  
// task 12 - Get book details based on author
public_users.get('/author/:author', function (req, res) {

  const get_books_author = new Promise ((resolve, reject) => {

    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({
          "isbn":isbn,
          "title":books[isbn]["title"],
          "reviews":books[isbn]["reviews"]
        });
        resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }
    });
    reject(res.send("The mentioned auther does not exist"))
  });
  get_books_author.then(function() {
        console.log("Promise is resolved");
      }).catch(function() {
                console.log("The mentiond auther does not exist");
      });
});

// task 13 - Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const get_books_title = new Promise((resolve, reject) => {

    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["title"] === req.params.title) {
        booksbytitle.push({
          "isbn":isbn,
          "author":books[isbn]["author"],
          "reviews": books[isbn]["reviews"]
        });
        resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
      }
    });
    reject(res.send("The requested title does not exist"))
  });
  get_books_title.then(function() {
          console.log("Promsie for task 13 resolved");
  }).catch(function(){
          console.log("The requeste title does not exist");
  });
});

// task 14 - Get book review
public_users.get('/review/:isbn',function (req, res) {
  const get_book_review = new Promise ((resolve, reject) => {
    let booksbyreview = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["reivews"] === req.params.reviews) {
        booksbyreview.push({
          "isbn":isbn,
          "title":books[isbn]["title"],
          "author":books[isbn]["author"]
        });
        resolve(res.send(JSON.stringify({booksbyreview}, null, 4)));
      }
    });
    reject(res.send("The requested reivew does not exist"))
  });
    get_book_review.then(function() {
          console.log("Promise for task 14 resolved")
    }).catch(function(){
          console.log("The requested review does not exist");
    });
  });

module.exports.general = public_users;
