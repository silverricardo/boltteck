const express = require('express');
const router = express.Router();
const Users = require('../handler/users');
const ErrorHandler = require('../handler/error');

//========== POST ==========
//Create a new User:
router.post('/api/users', (req, res, next) => {
    const context = "POST /api/users";
    Users.addUser(req)
        .then((result) => {

            return res.status(200).send(result);

        })
        .catch((error) => {

            console.error(`[${context}][Users.addUser] Error `, error.message);
            ErrorHandler.ErrorHandler(error, res);

        });
});

router.post('/api/users/login', (req, res, next) => {
    const context = "POST /api/users/login";
    Users.loginUser(req)
        .then((result) => {

            return res.status(200).send(result);

        })
        .catch((error) => {

            console.error(`[${context}][Users.addUser] Error `, error.message);
            ErrorHandler.ErrorHandler(error, res);

        });
});


//========== GET ==========
//Create a new User:
router.get('/api/private/users', (req, res, next) => {
    const context = "GET /api/users";
    Users.getUserInfo(req)
        .then((result) => {

            return res.status(200).send(result);

        })
        .catch((error) => {

            console.error(`[${context}][Users.addUser] Error `, error.message);
            ErrorHandler.ErrorHandler(error, res);

        });
});

router.get('/api/private/users/:userId', (req, res, next) => {
    const context = "GET /api/users/:userId";

    Users.validateUser(req.params.userId)
        .then((result) => {

            return res.status(200).send(result);

        })
        .catch((error) => {

            console.error(`[${context}][Users.addUser] Error `, error.message);
            ErrorHandler.ErrorHandler(error, res);

        });
});

module.exports = router;