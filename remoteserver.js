"use strict";

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var stripAnsi = require("strip-ansi");
var http = require("http");
var WebSocket = require("ws");
var url = require("url");
var handleRequest = require("@run-on-server/server/dist/handleRequest");
var handleConnection = require("@run-on-server/server/dist/handleConnection");


function createRosServer(serverConfig) {
  var socketRegistry = new _map2.default();
  var app = express();
  app.use(bodyParser.json({
    limit: serverConfig && serverConfig.requestSizeLimit || "1GB"
  }));

  if (serverConfig == null || serverConfig.cors !== false) {
    app.use(cors());
    app.options("*", cors());
  }

  app.post("/", function (req, res) {
    var requestUrl = url.parse(
    // $FlowFixMe
    req.protocol + "://" + req.get("Host") + req.originalUrl);

    handleRequest(req.body, serverConfig,
    // $FlowFixMe
    requestUrl, socketRegistry).then(function (result) {
      res.status(200).send({
        success: true,
        result: typeof result === "undefined" ? null : result
      });
    }).catch(function (err) {
      res.status(200).send({
        success: false,
        err: {
          name: stripAnsi(err.name),
          message: stripAnsi(err.message),
          stack: stripAnsi(err.stack),
          // $FlowFixMe
          code: err.code
        }
      });
    });
  });

  var server = http.createServer(app);

  var wsServer = new WebSocket.Server({ server: server });

  wsServer.on("connection", function (socket, request) {
    handleConnection(socket, request, socketRegistry);
  });

  return server;
};

const idMappings = require("fs-remote/dist/idMappings");

module.exports = function createServer(options = { cors: true }) {
  return createRosServer({
    requireFrom: __dirname + "/node_modules/fs-remote/dist", //this is important!
    idMappings,
    cors: options.cors
  });
};