const express = require("express");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
const mongoose = require("mongoose");
const {initializeDatabase} = require("./db/db.connect");
const Book = require("./models/book.models");
const app = express();
initializeDatabase();
app.use(express.json());

async function createBook(newBook){
    try{
        const book = new Book(newBook);
        const saveBook = await book.save();
        return saveBook;
    } catch(error){
        throw error
    }
}

app.post("/books", async (req, res) => {
    try{
        const savedBook = await createBook(req.body);
        res.status(201).json({message: "Added a book successfully.", newBook: savedBook});
    } catch(error){
        console.error("Failed to add book", error);
        res.status(500).json({error: "Failed to add book.", details: error.message});
    }
});

async function readAllBooks(){
    try{
        const allBooks = await Book.find();
        return allBooks;
    } catch(error){
        throw error
    }
}

app.get("/books", async (req, res) => {
    try{
        const books = await readAllBooks();
        if(books.length != 0){
            res.json(books);
        } else{
            res.status(404).json({error: "Books not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch books."});
    }
});

async function readBookByTitle(bookTitle){
    try{
        const book = await Book.findOne({title: bookTitle});
        return book;
    } catch(error){
        throw error
    }
}

app.get("/books/:bookTitle", async (req, res) => {
    try{
        const book = await readBookByTitle(req.params.bookTitle);
        if(book){
            res.json(book);
        } else{
            res.status(404).json({error: "Book not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch book."});
    }
});

async function readBooksByAuthor(authorName){
    try{
        const book = await Book.find({author: authorName});
        return book;
    } catch(error){
        console.log(error);
    }
}

app.get("/books/authors/:authorName", async (req, res) => {
    try{
        const book = await readBooksByAuthor(req.params.authorName);
        if(book.length != 0){
            res.json(book);
        } else{
            res.status(404).json({error: "Book not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch book."});
    }
});

async function readBooksByGenre(bookGenre){
    try{
        const books = await Book.find({genre: bookGenre});
        return books;
    } catch(error){
        throw error
    }
}

app.get("/books/genres/:bookGenre", async (req, res) => {
    try{
        const books = await readBooksByGenre(req.params.bookGenre);
        if(books.length != 0){
            res.json(books);
        } else{
            res.status(404).json({error: "Books not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch books."});
    }
});

async function readBooksByReleasedYear(releasedYear){
    try{
        const books = await Book.find({publishedYear: releasedYear});
        return books;
    } catch(error){
        throw error
    }
}

app.get("/books/publishedYear/:releasedYear", async (req, res) => {
    try{
        const books = await readBooksByReleasedYear(req.params.releasedYear);
        if(books.length != 0){
            res.json(books);
        } else{
            res.status(404).json({error: "Books not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch books."});
    }
});

async function updateBookById(bookId, dataToUpdate){
    try{
        const book = await Book.findByIdAndUpdate(bookId, dataToUpdate, { new: true});
        return book;
    } catch(error){
        console.log(error);
    }
}

app.post("/books/bookIds/:bookId", async (req, res) => {
    try{
        const updatedBook = await updateBookById(req.params.bookId, req.body);
        if(updatedBook){
            res.status(200).json({message: "Book updated successfully.", updatedBook: updatedBook});
        } else{
            res.status(404).json({error: "Book does not exist."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to update book."});
    }
});

async function updateBookByTitle(bookTitle, dataToUpdate){
    try{
        const book = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, { new: true});
        return book;
    } catch(error){
        throw error
    }
}

app.post("/books/yearAndRating/:bookTitle", async (req, res) => {
    try{
        const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body);
        if(updatedBook){
            res.status(200).json({message: "Book updated successfully.", updatedBook: updatedBook});
        } else{
            res.status(404).json({error: "Book does not exist."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to update book."});
    }
});

async function deleteBookById(bookId){
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return null;
    }
    try{
        const book = await Book.findByIdAndDelete(bookId);
        return book;
    } catch(error){
        throw error
    }
}

app.delete("/books/deletion/:bookId", async (req, res) => {
    try{
        const deletedBook = await deleteBookById(req.params.bookId);
        if(deletedBook){
            res.status(200).json({message: "Book deleted successfully."});
        } else{
            res.status(404).json({error: "Book not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to delete book."});
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});