const createServer = require("fs-remote/createServer");

// createServer returns a net.Server
const server = createServer();

let nPort = 1027;
server.listen(nPort, () => {
  console.log("fs-remote server is listening on port " + nPort);
});