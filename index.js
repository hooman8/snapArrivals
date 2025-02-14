import express from "express";
import path from "path";

const app = express();
const port = 3000;
const __dirname = path.resolve();

app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/chart.js/dist"))
);
app.use(
  "/js",
  express.static(
    path.join(__dirname, "node_modules/chartjs-adapter-date-fns/dist")
  )
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/@kurkle/color/dist"))
);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
