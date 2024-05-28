import express from "express";
import router from "./router.js";

const app = express();

app.use(router, express.static("dist"), (req, res) => {
  res.sendFile("dist/index.html", { root: process.cwd() });
});

export default app;
