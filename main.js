"use strict"

const createClient = require("fs-remote/createClient");
// Pass in the URL to the server you created
const fs = createClient("http://localhost:1027");

document.getElementById('response').innerHTML = fs.readFileSync("./package.json");