import "dotenv/config.js";
import app from "./app.js";
import https from "https";
import http from "http";
import fs from "fs";

const port = process.env.PORT;

const ssl_key_path = process.env.SSL_KEY_PATH || "ssl/key.pem";
const ssl_cert_path = process.env.SSL_CERT_PATH || "ssl/cert.pem";

if (
  fs.existsSync(ssl_key_path) &&
  fs.existsSync(ssl_cert_path) &&
  port === "443"
) {
  https
    .createServer(
      {
        key: fs.readFileSync(ssl_key_path, "utf8"),
        cert: fs.readFileSync(ssl_cert_path, "utf8"),
      },
      app
    )
    .listen(443, () =>
      console.log("Server is started: https://localhost:443")
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
