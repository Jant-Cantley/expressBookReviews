const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    // Return true if any user with the same username is found, otherwise false
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
//adding new users
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and passwor are provided
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username": username,"password": password});
      return res.status(200).json({message: "User " +username+ " successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User " +username+ " already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

function bookListPromise() {
    return new Promise((resolve, reject) => {resolve(books)});
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  bookListPromise().then((bookList) => res.send(JSON.stringify(booklist)));
});

function getBookByISBNPromise(isbn) {
    return new Promise((resolve, reject) => {resolve(books[isbn])});
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   getBookByISBNPromise(req.params.isbn).then((book) => res.send(book));
 });

 function getBookByAuthorPromise(author){
    return new Promise((resolve, reject) => {
        let foundBooks = {};

        Object.keys(books).forEach(key => {
            const book = books[key];
            if(book.author === author) {
                foundBooks[book.title] = book;
            }
        });
        resolve(foundBooks);
    });
 }


  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    getBookByAuthorPromise(req.params.author).then((bookList) => res.send(bookList));
});

  function getBooksByTitlePromise(title) {
    return new Promise((resolve, reject) => {
        let foundBooks = {};

        Object.keys(books).forEach(key => {
            const book = books[key];
            if(book.title === title) {
                foundBooks[books.author] = book;
            }
        });
        resolve(foundBooks)
    })
 }

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  getBooksByTitlePromise(re.params.title).then((foundBooks) => res.send(foundBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let booksbyreview = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
        if (books[isbn]["reviews"] === req.params.isbn) {
            booksbyreview.push({
                "isbn": isbn,
                "title": books[isbn]["title"],
                "author": books[isbn]["title"]
            });
        }
    });
    res.send(JSON.stringify({ booksbyreview }, null, 4));
});

module.exports.general = public_users;
