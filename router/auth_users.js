const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
   let usersamename = users.filter((user)=>{
    return user.username === username
   });
   if(usersamename.length > 0){
    return true;
   } else {
    return false;
   }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password){
        return res.status(404).json({message: "Error Logging in"})
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send({message: "User successfully logged in."})
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  if (filtered_book) {
    let review = req.query.review;
    let reviewer = req.session.authorization['username'];
    if (review) {
        filtered_book['reviews'][reviewer] = review;
        books[isbn] = filtered_book;
    }
    res.send(`The reivew for the book with ISBN ${isbn} has been added/updated`);
  } else {
    res.send("Unable to find this ISBN!");
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//delete section not added
//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn + "";
    const username = req.user.data;
    const book = books[isbn];
   if (book) {
    delete book.reviews[username];
    return res.status(200).json({message: "Review successfull deleted"});
   }
   return res.status(404).json({message: "Invalid ISBN"})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
