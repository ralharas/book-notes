import express from "express";
import axios from "axios";
import db from '../db/db.js';


db.query('SELECT * FROM books', [], (err, res) => {
    if (err) {
        console.error('Error executing query', err.stack);
    } else {
        console.log('Query result:', res.rows);
    }
});

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const books = await db.query('SELECT * FROM books');
        res.render('index', { books: books.rows });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching books');
    }
});

router.delete("/delete-book/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM books WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.status(200).send(`Book with ID ${id} removed.`);
        } else {
            res.status(404).send(`Book with ID ${id} not found.`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting book');
    }
});

router.get('/add-book', (req, res) => {
    res.render('addbook', {book: null});
});

router.post('/new-book', async (req, res) => {
    const {title, author, isbn, rating, read_date, notes} = req.body;

    try {
        const coverResponse = await axios.get(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
        const cover_url = coverResponse.config.url;

        await db.query(
            'INSERT INTO books (title, author, isbn, cover_url, rating, read_date, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [title, author, isbn, cover_url, rating, read_date, notes]
        );
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error adding book');
    }
});

router.get('/edit-book/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
        const book = result.rows[0];

        if (book) {
            res.render('addbook', { book });
        } else {
            res.status(404).send('Book not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving book');
    }
});

router.post('/edit-book/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, isbn, rating, read_date, notes } = req.body;

    try {
        const coverResponse = await axios.get(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
        const cover_url = coverResponse.config.url;

        const result = await db.query(
            'UPDATE books SET title = $1, author = $2, isbn = $3, cover_url = $4, rating = $5, read_date = $6, notes = $7 WHERE id = $8',
            [title, author, isbn, cover_url, rating, read_date, id]
        );

        if (result.rowCount > 0) {
            res.redirect('/');
        } else {
            res.status(404).send('Book not found or not updated');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error updating book');
    }
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get ('/contact', (req, res) => {
    res.render('contact');
});

router.get('/view-notes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.render('viewnotes', { book: result.rows[0] });
        } 
        else {
            res.status(404).send('Book not found');
        }
    } 
    catch (err) {
        console.log(err);
        res.status(500).send('Error fetching book notes');
    }
});

export default router;
