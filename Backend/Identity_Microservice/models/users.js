const mongoose = require('mongoose');
const mongo = require('mongodb');
require("dotenv-safe").load();

var UserSchema = mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

var User = module.exports = mongoose.model('User', UserSchema);

var crypto = require('crypto'),
    algorithm = 'aes-256-cbc',
    password = 'bolttech2022!';


module.exports.getEncriptedPassword = function (userPassword, callback) {


    var cipher = crypto.createCipher(algorithm, password);
    var encriptedPassword = cipher.update(userPassword, 'utf8', 'hex');
    encriptedPassword += cipher.final('hex');

    callback(null, encriptedPassword);
}

module.exports.createUser = function (newUser, callback) {
    newUser.save(callback);
}

module.exports.deleteUser = function (query, callback) {
    User.deleteOne(query, callback);
}
