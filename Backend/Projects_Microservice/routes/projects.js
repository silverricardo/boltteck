const express = require('express');
const router = express.Router();
const Projects = require('../handler/projects');
const ErrorHandler = require('../handler/error');

//========== POST ==========
//Create a new Project:
router.post('/api/private/projects', (req, res, next) => {
    const context = "POST /api/projects";
    Projects.addProject(req)
        .then((result) => {

            return res.status(200).send(result);

        })
        .catch((error) => {

            console.error(`[${context}][Projects.addProject] Error `, error.message);
            ErrorHandler.ErrorHandler(error, res);

        });
});

//========== PATCH ==========
router.patch('/api/private/projects', (req, res, next) => {
    const context = "PATCH /api/projects";
    Projects.editProject(req)
        .then((result) => {

            return res.status(200).send(result);

        })
        .catch((error) => {

            console.error(`[${context}][Projects.addProject] Error `, error.message);
            ErrorHandler.ErrorHandler(error, res);

        });
});

router.patch('/api/private/projects/addTask', (req, res, next) => {
    const context = "PATCH /api/projects/addTask";
    Projects.addTask(req)
        .then((result) => {

            return res.status(200).send(result);

        })
        .catch((error) => {

            console.error(`[${context}][Projects.addProject] Error `, error.message);
            ErrorHandler.ErrorHandler(error, res);

        });
});

router.patch('/api/private/projects/removeTask', (req, res, next) => {
    const context = "PATCH /api/projects/removeTask";
    Projects.removeTask(req)
        .then((result) => {

            return res.status(200).send(result);

        })
        .catch((error) => {

            console.error(`[${context}][Projects.addProject] Error `, error.message);
            ErrorHandler.ErrorHandler(error, res);

        });
});

router.patch('/api/private/projects/markAsDone', (req, res, next) => {
    const context = "PATCH /api/projects/markAsDone";
    Projects.markAsDone(req)
        .then((result) => {

            return res.status(200).send(result);

        })
        .catch((error) => {

            console.error(`[${context}][Projects.addProject] Error `, error.message);
            ErrorHandler.ErrorHandler(error, res);

        });
});

//========== GET ==========
router.get('/api/private/projects', (req, res, next) => {
    const context = "GET /api/projects";
    Projects.getProjects(req)
        .then((result) => {

            return res.status(200).send(result);

        })
        .catch((error) => {

            console.error(`[${context}][Projects.addUser] Error `, error.message);
            ErrorHandler.ErrorHandler(error, res);

        });
});


//========== DELETE ==========
router.delete('/api/private/projects', (req, res, next) => {
    const context = "DELETE /api/projects";
    Projects.removeProject(req)
        .then((result) => {

            return res.status(200).send(result);

        })
        .catch((error) => {

            console.error(`[${context}][Projects.addProject] Error `, error.message);
            ErrorHandler.ErrorHandler(error, res);

        });
});

module.exports = router;