const express = require('express');
const httpProxy = require('express-http-proxy');
const http = require('http');
const axios = require('axios');
const app = express()
module.exports = {

    identityServiceProxy: function (req, res) {
        const context = "Function identityServiceProxy";
        const serviceProxy = httpProxy('http://identity_microservice:3001/', {
            forwardPath: () => `http://identity_microservice:3001${req.originalUrl}`,

        });

        console.log(`http://identity_microservice:3001${req.originalUrl}`)
        serviceProxy(req, res, (err, result) => {
            if (err) {
                console.log("[/api/users] Error", err.message);
                return res.status(500).send(err.message);
            }
            else
                console.log("[/api/users] Result", result);
        });

    },
    getUserById: function (userId) {
        const context = "Function getUserById";
        return new Promise((resolve, reject) => {
            let host = `http://identity_microservice:3001/api/private/users/${userId}`

            axios.get(host)
                .then((result) => {
                    resolve(result.data);
                })
                .catch((error) => {
                    console.error(`${host} ERROR`, error.message);
                    reject(error);
                })

        })
    }
}

