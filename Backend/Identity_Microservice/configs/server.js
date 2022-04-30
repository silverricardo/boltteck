const express = require('express');
const app = express()
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const Process = require('process');
const ErrorHandler = require('../handler/error');
const mongoose = require('mongoose');
require("dotenv-safe").load();

connectionDB()
async function connectionDB() {
    await mongoose.connect('mongodb://db:27017/identitysDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((db) => {
        console.log(`Connected to ${db.connections[0].name}`);

    }).catch(err => {
        console.log("[mongodb://db:27017/identitysDB] Error", err.message);
        Process.exit(0);
    });
};

app.use(helmet());
app.use(express.json({ limit: '1000kb' }));
app.use(express.urlencoded({ extended: false, limit: '1000kb' }));
app.use(cookieParser());
app.use(cors());

app.use(require('../routes/users'));

app.get('/api/users/healthCheck', (req, res) => {
    return res.status(200).send('OK');
});

module.exports = app;