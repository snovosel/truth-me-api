const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const redis = require("redis");
const uniqid = require("uniqid");

const app = express();
const port = 8080;

const redisHost = "redis-19761.c15.us-east-1-2.ec2.cloud.redislabs.com";
const redisPort = "19761";
const redisAuth = "LegrynXfPKedyNhSm2wIO1DDsNcAC3uH";

const client = redis.createClient({
  port: redisPort,
  host: redisHost
});

client.auth(redisAuth, (err, response) => {
  if (err) {
    throw err;
  }
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/fortune", (req, res) => {
  const key = uniqid();

  const oneDay = 60 * 60 * 8;

  client.set(key, JSON.stringify(req.body), "EX", 30);

  res.send({ key });
});

app.get("/fortune/:fortuneId", (req, res) => {
  const key = req.params.fortuneId;

  client.get(key, (err, response) => {
    if (err) {
      throw err;
    } else {
      res.send(response);
    }
  });
});

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert")
    },
    app
  )
  .listen(port, () => console.log(`Example app listening on port ${port}!`));
