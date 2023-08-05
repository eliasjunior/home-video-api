import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import VideosRouter from "./src/routers/VideosRouter";
import ImagesRouter from "./src/routers/ImagesRouter";
import CaptionsRouter from "./src/routers/CaptionsRouter";
import config from "./src/config";
const { serverUrl, port, moviesDir, baseLocation } = config();

import path from "path";

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", VideosRouter);
app.use("/", ImagesRouter);
app.use("/", CaptionsRouter);

app.listen(port, () => {
  console.log(`Application started, ${serverUrl}`);
  console.log(`App config`);
  console.log(`Movies folder: ${moviesDir}`);
  console.log(`baseLocation: ${baseLocation}`);
});
// Function to print memory usage statistics
function printMemoryUsage() {
  console.log("NODE_OPT", process.env.NODE_OPTIONS);

  const memoryUsage = process.memoryUsage();
  const totalHeapSize = memoryUsage.heapTotal;
  const totalHeapSizeMB = (totalHeapSize / 1024 / 1024).toFixed(2);

  console.log(`Total Heap Size: ${totalHeapSizeMB} MB`);
}

// Call the function periodically to print memory usage statistics
//setInterval(printMemoryUsage, 10000); // Print every 5 seconds (adjust as needed)
