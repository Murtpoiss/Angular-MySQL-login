const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, "")));

app.use(bodyParser.json());

const publicVapidKey =
  "BCCUW17-pDT7-YvOS_qDaZwyN8Rdsle2FzIiV1OaB-yW4ksM77ixkAbfI7nCqP41l93wUV71Mw0aMjykYrnZ2T0";
const privateVapidKey = "xDrauc0hbiudW3PPkG4Gw1rO0HAF6thnA0BnofT81d4";

webpush.setVapidDetails(
  "mailto:murtpoiss@gmail.com",
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post("/notify", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: "Push Test" });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
});

const port = 3000;

//console.log("1231231231231231231");

app.listen(port, () => console.log(`Server started on port ${port}`));
