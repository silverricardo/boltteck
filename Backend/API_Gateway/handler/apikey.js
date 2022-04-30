
const jwt = require('jsonwebtoken');
require("dotenv-safe").load();

var expiresIn ='3124202400000'

const apikey = jwt.sign({ }, 'BQgVC5sHbWL52UnR2FvVFwP6fn259eSc', { expiresIn: expiresIn });

console.log("apikey",apikey)