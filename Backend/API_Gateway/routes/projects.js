const express = require('express');
const httpProxy = require('express-http-proxy');
const http = require('http');
const axios = require('axios');
const app = express()
module.exports = {

    projectsServiceProxy: function (req, res) {
        const context = "Function projectsServiceProxy";
        const serviceProxy = httpProxy('http://projects_microservice:3003/', {
            forwardPath: () => `http://projects_microservice:3003${req.originalUrl}`,

        });

        console.log(`http://projects_microservice:3003${req.originalUrl}`)
        serviceProxy(req, res, (err, result) => {
            if (err) {
                console.log("[/api/private/projects] Error", err.message);
                return res.status(500).send(err.message);
            }
            else
                console.log("[/api/private/projects] Result", result);
        });

    },
  
}