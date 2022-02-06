// /index.js

import isOnline from 'is-online';
import signale from 'signale';
import TBA from 'tba-api-storm';
import fs from 'fs';
import express from 'express';
import http from 'http';
import path from 'path';
import reload from 'reload';
import bodyParser from 'body-parser';
import watch from 'node-watch';
import 'dotenv/config'

const __dirname = path.resolve();

const tbaClient = new TBA(process.env.TBA_KEY);
const app = express();

const publicDir = path.join(__dirname, 'public');

app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json()); // Parses json, multi-part (file), url-encoded

app.get("/", function(req, res) {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

// Reload code here
let reloadServer = await reload(app);

watch("public/tbaData.json", function() {
  signale.info("Reloading to update match times");
  reloadServer.reload();
});

server.listen(app.get("port"), function() {
  signale.success(
    "Server started at http://localhost:" + app.get("port") + "/"
  );
  signale.info("Made with <3 by FRC team 7460");
});

if (!process.env.TBA_KEY || !process.env.TEAM_NUM || !process.env.EVENT_KEY) {
  console.log(config)
  signale.error("Need to specify TBA key, team number, or event key");
  process.exit(1);
}

function checkOnline() {
  // your code here
  (async () => {
    if (await isOnline()) {
      signale.await("Online, pulling data from TBA...");
      tbaClient
        .getTeamEventMatchListSimple(process.env.TEAM_NUM, process.env.EVENT_KEY)
        .then(data => {
          fs.writeFile("public/tbaData.json", JSON.stringify(data), err => {
            // throws an error, you could also catch it here
            if (err) throw err;

            // success case, the file was saved
            signale.success("Pulled data from TBA.");
            
          });
        });
    } else {
      signale.info("Offline, not pulling data");
    }
  })();
  setTimeout(checkOnline, 600000);
}

checkOnline();
