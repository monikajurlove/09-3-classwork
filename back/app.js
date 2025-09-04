const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mainRouter = require('./routers/mainRouter');
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.MONGO_KEY)
    .then(() => console.log('MongoDB connected!'))
    .catch((err) => console.error(err));

app.use(cors());
app.use(express.json());
app.use('/', mainRouter);

app.listen(2600);