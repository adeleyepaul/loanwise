const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/user-routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/api', router);
mongoose
    .connect(`mongodb+srv://admin:Password123@loanwise.qnhvgxw.mongodb.net/?retryWrites=true&w=majority`)
    .then(()=>{
        app.listen(4000)
        console.log("Database is connected!, Listening to localhost 4000");
    }).catch((err) => {
        console.error('Error connecting to the database:', err);
    });