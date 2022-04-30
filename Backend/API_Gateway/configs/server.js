const express = require('express');
const app = express()
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const Process = require('process');
const ErrorHandler = require('../handler/error');
const Users = require('../routes/users');
const Projects = require('../routes/projects');
const jwt = require('jsonwebtoken');
require("dotenv-safe").load();

app.use(helmet());
app.use(express.json({ limit: '1000kb' }));
app.use(express.urlencoded({ extended: false, limit: '1000kb' }));
app.use(cookieParser());
app.use(cors());
app.use(hasValidApiToken)

function hasValidApiToken(req, res, next) {
    const context = "Function hasValidApiToken";
    const apikey = req.headers['apikey'];

    if (!apikey) {
        ErrorHandler.ErrorHandler(({ auth: false, code: 'server_general_error', message: 'No apikey provided.' }), res);
    } else {
        jwt.verify(apikey, process.env.TOKEN_SECRET, function (err, decoded) {
            if (err) {
                console.log(`[${context} jwt verify] Error `, err.message);
                ErrorHandler.ErrorHandler(err, res)
            }
            //console.log("decoded", decoded);
            if (decoded) {

                next()

            } else {

                ErrorHandler.ErrorHandler({ auth: false, code: 'server_not_authorized_access_externalAPI', message: 'Not authorized to access' }, res);

            };


        });
    }

};


function isAuthenticated(req, res, next) {
    var context = 'Function isAuthenticated';

    // First request to authorization service to check if tokens are valids
    var token = req.headers['token'];

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
            if (err) {
                console.log(`[${context} jwt verify] Error `, err.message);
                ErrorHandler.ErrorHandler(err, res)
            }
            //console.log("decoded", decoded);
            if (decoded) {

                //console.log("decoded", decoded)
                Users.getUserById(decoded.id)
                    .then((response) => {

                        console.log("Response", response)


                        if (response) {
                            req.headers['userid'] = decoded.id;
                            next();
                        }
                        else
                            ErrorHandler.ErrorHandler({ auth: false, code: 'server_token_not_valid', message: "Token not valid" }, res)
                    })
                    .catch(error => {
                        console.log(`[${context} Users.getUserById] Error `, error.message);
                        ErrorHandler.ErrorHandler(error, res)
                    })

            } else {

                ErrorHandler.ErrorHandler({ auth: false, code: 'server_not_authorized_access_externalAPI', message: 'Not authorized to access' }, res);

            };


        });
    }
    else {
        ErrorHandler.ErrorHandler({ auth: false, code: 'server_tokens_provided', message: "Tokens must be provided" });
    };

};

app.use('/api/private/', isAuthenticated);
app.use('/api/users', (req, res) => {
    Users.identityServiceProxy(req, res, (err, result) => {
        if (err) {
            console.log("[/api/users] Error", err.message);
            return res.status(500).send(err.message);
        }
        else
            console.log("[/api/users] Result", result);
    });
})

app.use('/api/private/users', (req, res) => {
    Users.identityServiceProxy(req, res, (err, result) => {
        if (err) {
            console.log("[/api/private/users] Error", err.message);
            return res.status(500).send(err.message);
        }
        else
            console.log("[/api/private/users] Result", result);
    });
})

app.use('/api/private/projects', (req, res) => {
    Projects.projectsServiceProxy(req, res, (err, result) => {
        if (err) {
            console.log("[/api/private/projects] Error", err.message);
            return res.status(500).send(err.message);
        }
        else
            console.log("[/api/private/projects] Result", result);
    });
})

app.get('/api/healthCheck', (req, res) => {
    return res.status(200).send('OK');
});

module.exports = app;