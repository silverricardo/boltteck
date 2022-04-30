const ldapjs = require('ldapjs');
require("dotenv-safe").load();


function ldapcontroller() {

    const ldapOptions = {
        url: 'ldap://172.17.0.1:1041',
        timeout: 30000,
        connectTimeout: 30000,
        reconnect: true
    };

    const addldapUser = function (user, password) {
        const context = "Function addldapUser";
        return new Promise((resolve, reject) => {

            const ldapClient = ldapjs.createClient(ldapOptions)

            let newUser;
            try {
                newUser = {
                    givenName: user.name,
                    cn: user.name,
                    sn: user.name,
                    mail: user.email,
                    userPassword: password,
                    objectClass: ["person", "organizationalPerson", "inetOrgPerson"]

                };

                console.log("newUser", newUser)
                ldapClient.bind(
                    process.env.ldap_admin_user,
                    process.env.ldap_admin_password,
                    (err) => {
                        if (err) {
                            console.log(`[${context}][ldapClient.bind] Error `, err.message);
                            return reject(new Error(err));
                        };

                        ldapClient.add(
                            'uid=' + user.email + ',' + process.env.ldap_domain,
                            newUser,
                            (err, response) => {
                                if (err) {
                                    console.log(`[${context}] [ldapClient.add] Error `, err.message);
                                    return reject(err);
                                }
                                return resolve(user);
                            }
                        );
                    }
                )
            } catch (err) {
                console.log(`[${context}] Error `, err.message);
                return reject(err);
            };
        });
    };

    const authenticate = (username, password) => {
        var context = "Function authenticate";
        return new Promise((resolve, reject) => {

            const ldapClient = ldapjs.createClient(ldapOptions);
            ldapClient.bind(
                'uid=' + username + ',' + process.env.ldap_domain,
                password,
                (err, res) => {
                    if (err) {
                        console.log(`[${context}] Error `, err.message);
                        return reject(err);
                    };
                    ldapClient.unbind();
                    return resolve(res);
                }
            );
        })
    };
    return { addldapUser ,authenticate};

};
module.exports = ldapcontroller;