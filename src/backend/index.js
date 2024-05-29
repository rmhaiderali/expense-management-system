import "dotenv/config.js";
import app from "./app.js";
import https from "https";
import http from "http";
import fs from "fs";

const port = process.env.PORT;

if (
  fs.existsSync("ssl/key.pem") &&
  fs.existsSync("ssl/cert.pem") &&
  port === "443"
) {
  https
    .createServer(
      {
        key: fs.readFileSync("ssl/key.pem", "utf8"),
        cert: fs.readFileSync("ssl/cert.pem", "utf8"),
      },
      app
    )
    .listen(port, () =>
      console.log("Server is started: https://localhost:" + port)
    );

  http
    .createServer((req, res) => {
      res.writeHead(301, {
        Location: "https://" + req.headers["host"] + (req.url || "/"),
      });
      res.end();
    })
    .listen(80, () => {
      console.log("Redirect server is started: http://localhost:80");
    });
} else {
  app.listen(port, () =>
    console.log("Server is started: http://localhost:" + port)
  );
}
