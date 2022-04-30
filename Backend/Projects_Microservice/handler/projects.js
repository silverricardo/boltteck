const express = require('express');
const app = express()
const Projects = require('../models/projects');

module.exports = {
    addProject: function (req) {
        let context = "Funciton addProject";
        return new Promise((resolve, reject) => {

            let project = new Projects(req.body);
            project.userId = req.headers['userid'];

            Projects.createProject(project, (err, result) => {
                if (err) {
                    console.log(`[${context}][Projects.createProject] Error `, err.message);
                    reject(err);
                };
                resolve(result);
            });

        });
    },
    getProjects: function (req) {
        let context = "Funciton getProjects";
        return new Promise((resolve, reject) => {

            let userId = req.headers['userid'];

            Projects.find({ userId: userId }, (err, result) => {
                if (err) {
                    console.log(`[${context}][Projects.find] Error `, err.message);
                    reject(err);
                };
                resolve(result);
            });

        });
    },
    editProject: function (req) {
        let context = "Funciton editProject";
        return new Promise((resolve, reject) => {

            let userId = req.headers['userid'];
            let projectId = req.body.projectId;
            let newName = req.body.name;

            Projects.updateProject({ userId: userId, _id: projectId }, { $set: { name: newName } }, (err, result) => {
                if (err) {
                    console.log(`[${context}][Projects.updateProject] Error `, err.message);
                    reject(err);
                };

                if (result)
                    resolve(result);
                else
                    reject({ auth: false, code: "server_project_not_found", message: "Project not found" });
            });

        });
    },
    removeProject: function (req) {
        let context = "Funciton removeProject";
        return new Promise((resolve, reject) => {

            let userId = req.headers['userid'];
            let projectId = req.body.projectId;

            Projects.deleteProject({ userId: userId, _id: projectId }, (err, result) => {
                if (err) {
                    console.log(`[${context}][Projects.deleteProject] Error `, err.message);
                    reject(err);
                };

                Projects.find({ userId: userId }, (err, result) => {
                    if (err) {
                        console.log(`[${context}][Projects.find] Error `, err.message);
                        reject(err);
                    };
                    resolve(result);
                });

            });

        });
    },
    addTask: function (req) {
        let context = "Funciton addTask";
        return new Promise((resolve, reject) => {

            let userId = req.headers['userid'];
            let projectId = req.body.projectId;
            let description = req.body.task;

            let task = {
                description: description,
                createDate: new Date(),
                done: false
            };

            Projects.updateProject({ userId: userId, _id: projectId }, { $push: { tasks: task } }, (err, result) => {
                if (err) {
                    console.log(`[${context}][Projects.updateProject] Error `, err.message);
                    reject(err);
                };

                if (result)
                    resolve(result);
                else
                    reject({ auth: false, code: "server_project_not_found", message: "Project not found" });
            });

        });
    },
    removeTask: function (req) {
        let context = "Funciton removeTask";
        return new Promise((resolve, reject) => {

            let userId = req.headers['userid'];
            let projectId = req.body.projectId;
            let taskId = req.body.taskId;

            Projects.findOne({ userId: userId, _id: projectId }, (err, projectFound) => {
                if (err) {
                    console.log(`[${context}][Projects.findOne] Error `, err.message);
                    reject(err);
                };

                if (projectFound) {
                    let listOfTasks = projectFound.tasks.filter(task => {
                        return task._id != taskId
                    });

                    Projects.updateProject({ userId: userId, _id: projectId }, { $set: { tasks: listOfTasks } }, (err, result) => {
                        if (err) {
                            console.log(`[${context}][Projects.updateProject] Error `, err.message);
                            reject(err);
                        };

                        if (result)
                            resolve(result);
                        else
                            reject({ auth: false, code: "server_project_not_found", message: "Project not found" });
                    });
                } else {
                    reject({ auth: false, code: "server_project_not_found", message: "Project not found" });
                }

            });

        });
    },
    markAsDone: function (req) {
        let context = "Funciton markAsDone";
        return new Promise((resolve, reject) => {

            let userId = req.headers['userid'];
            let projectId = req.body.projectId;
            let taskId = req.body.taskId;
            let dateNow = new Date();
            let newValues = {
                $set: {
                    "tasks.$[i].done": true,
                    "tasks.$[i].finisheDate": dateNow
                }
            };

            let arrayFilters = [
                { "i._id": taskId },

            ];

            Projects.findOneAndUpdate({ userId: userId, _id: projectId }, newValues, { arrayFilters: arrayFilters, new: true }, (err, result) => {
                if (err) {
                    console.log(`[${context}][Projects.findOneAndUpdate] Error `, err.message);
                    reject(err);
                };

                resolve(result);

            })

        });
    },

}