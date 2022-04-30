const http = require('http');
const app = require('./configs/server');
require("dotenv-safe").load();

console.log("Environment", process.env.NODE_ENV);
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : process.env.PORT_DEV;

switch (process.env.NODE_ENV) {
    case 'production':
        console.log("Initing production environment")
        break;
    case 'development':
        console.log("Initing dev environment")
        break;
    case 'pre':
        console.log("Initing pre environment")
        break;
    default:
        console.log("Unknown environment")
        break;
};

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Running on port:  ${port}`);
});