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

router.get('/add-book', (req, res) => {
    res.render('addbook', {book: null});
});

router.post('/add', async (req, res) => {
    const {title, author, isbn, rating, read_date} = req.body;

    try {
        const coverResponse = await axios.get(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
        const cover_url = coverResponse.config.url;

        await db.query(
            'INSERT INTO books (title, author, isbn, cover_url, rating, read_date) VALUES ($1, $2, $3, $4, $5, $6)',
            [title, author, isbn, cover_url, rating, read_date]
        );
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error adding book');
    }
});
export default router;
