const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// const isValid = (username)=>{
//     let usersamename = users.filter((user)=>{
//       return user.username === username
//     });
//     if(usersamename.length > 0){
//       return true;
//     } else {
//       return false;
//     }
//   }
  
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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({
          "isbn": isbn,
          "title": books[isbn]["title"],
          "reviews": books[isbn]["reviews"]
        });
      }
      resolve()
    });
    res.send(JSON.stringify({ booksbyauthor }, null, 4));
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let booksbytitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn)=> {
    if (books[isbn]["title"] === req.params.title) {
        booksbytitle.push({
            "isbn": isbn,
            "author": books[isbn]["author"],
            "reviews": books[isbn]["reviews"]
        });
    }
    resolve()
  });
  res.send(JSON.stringify({ booksbytitle }, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let booksbyreview = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
        if (books[isbn]["reviews"] === req.params.reviews) {
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
