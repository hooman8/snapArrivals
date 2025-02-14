import path from "path";

export default {
  entry: "./public/js/chart.js", // Your main frontend file
  output: {
    path: path.resolve("public/dist"), // Output folder
    filename: "bundle.js", // The bundled file
  },
  mode: "production",
};
