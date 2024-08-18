import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    host: 'localhost',
    database: 'book-notes',
    port: '5433', 
    user: 'postgres', 
    password: 'Rawad2004' 
});

export default {
    query: (text, params) => pool.query(text, params),
};
