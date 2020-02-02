const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const redis = require("redis");
const uniqid = require("uniqid");

const app = express();
const port = 3030;

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

  const oneDay = 60 * 60 * 24;

  client.set(key, JSON.stringify(req.body), "EX", oneDay);

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
