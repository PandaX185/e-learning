import express from 'express';

import db from './config/db.js';
import router from './student/student_routes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api', router);

const port = process.env.API_PORT;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});