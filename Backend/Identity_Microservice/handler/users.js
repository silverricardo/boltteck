const express = require('express');
const app = express()
const Users = require('../models/users');
const Ldap = require('./ldap');
const jwt = require('jsonwebtoken');

module.exports = {
    addUser: function (req) {
        let context = "Funciton addUser";
        return new Promise((resolve, reject) => {
            let password = req.body.password
            let user = new Users(req.body);

            Users.findOne({ email: user.email }, (err, userFound) => {
                if (err) {
                    console.log(`[${context}][Users.find] Error `, err.message);
                    reject(err);
                }

                if (userFound) {
                    reject({ code: false, code: 'server_email_in_use', message: 'Email in use' });
                } else {


                    user.password = "";
                    Users.createUser(user, (err, resultUser) => {
                        if (err) {
                            console.log(`[${context}][Users.createUser] Error `, err.message);
                            reject(err);
                        };
                        Users.getEncriptedPassword(password, function (err, encriptedPassword) {
                            if (err) {
                                console.log(`[${context}][Users.getEncriptedPassword] Error `, err.message);
                                reject(err);
                            };
                            //resultUser.password = encriptedPassword;

                            const controller = Ldap();
                            controller.addldapUser(resultUser, encriptedPassword)
                                .then(() => {

                                    resolve(user);

                                })
                                .catch(error => {
                                    //In case of error, DELETE User on mongo DB
                                    console.log(`[${context}][Users.getEncriptedPassword] Error `, error.message);
                                    Users.deleteUser({ _id: user._id }, (err, result) => {
                                        if (err) {
                                            console.log(`[${context}][Users.deleteUser] Error `, err.message);
                                            reject(err);
                                        };

                                        reject(error);
                                    });
                                });
                        });
                    });
                };
            });
        });
    },
    loginUser: function (req) {
        let context = "Funciton loginUser";
        return new Promise((resolve, reject) => {
            hasValidCredential(req)
                .then((req) => {

                    let email = req.body.email;
                    Users.findOne({ email: email }, (err, userFound) => {
                        if (err) {
                            console.log(`[${context}][Users.findOne] Error `, err.message);
                            reject(err);
                        };
                        if (userFound) {

                            let id = userFound._id;
                            let name = userFound.name
                            let token = jwt.sign({ id, email, name }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE });
                            console.log("token", token);
                            let response = {
                                auth: true,
                                token: token,
                                id: id,
                                name: name
                            }
                            resolve(response)

                        } else {
                            reject({ auth: false, code: 'server_user_not_found', message: "User not found: " + email })
                        };
                    })
                })
                .catch(error => {
                    console.log(`[${context}][hasValidCredentiald] Error `, error.message);
                    reject(error);
                })


        })
    },
    getUserInfo: function (req) {
        let context = "Funciton getUserInfo";
        return new Promise((resolve, reject) => {

            let userId = req.headers['userid'];

            Users.findOne({ _id: userId }, (err, userFound) => {
                if (err) {
                    console.log(`[${context}][Users.findOne] Error `, err.message);
                    reject(err);
                };

                if (userFound)
                    resolve(userFound)
                else
                    reject({ auth: false, code: 'server_user_not_found', message: "User not found" });
            })

        })
    },
    validateUser: function (userId) {
        let context = "Funciton validateUser";
        return new Promise((resolve, reject) => {

            console.log(userId)
            Users.findOne({ _id: userId }, (err, userFound) => {
                if (err) {
                    console.log(`[${context}][Users.findOne] Error `, err.message);
                    reject(err);
                };

                if (userFound)
                    resolve(true)
                else
                    resolve(false);
            })

        })
    },
}

function hasValidCredential(req) {
    const context = "Function hasValidCredentials";
    return new Promise((resolve, reject) => {

        var username = req.body.email;
        var password = req.body.password;

        const controller = Ldap();
        Users.getEncriptedPassword(password, function (err, encriptedPassword) {
            controller.authenticate(username, encriptedPassword)
                .then((result) => {

                    delete req.body.password;
                    resolve(req);

                })
                .catch(error => {
                    if (error.code == 49) {
                        reject({ auth: false, code: 'server_invalid_credentials', message: error.message });
                    }
                    else {
                        console.error(`[${context}][authenticate] Error `, error.message);
                        reject(error)
                    };
                });
        });

    });

};