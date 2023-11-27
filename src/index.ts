import http from "http";
import pkg from "dotenv";
import { users } from "./data/data";
import {
  createUser,
  deleteUser,
  getUserById,
  logAllTheUsers,
  sendResponse,
  updateUser,
} from "./services/services";
import cluster, { Worker } from "cluster";
import { availableParallelism } from "os";

const PORT = Number(process.env.PORT) || 3000;
const args = process.argv;

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { pathname } = new URL(
      req.url as string,
      `http://${req.headers.host}`
    );

    if (req.method === "GET" && pathname === "/api/users") {
      sendResponse(res, 200, users);
    } else if (req.method === "GET" && pathname.startsWith("/api/users/")) {
      getUserById(res, pathname);
    } else if (req.method === "POST" && pathname === "/api/users") {
      createUser(req, res);
    } else if (req.method === "PUT" && pathname.startsWith("/api/users/")) {
      updateUser(req, res, pathname);
    } else if (req.method === "DELETE" && pathname.startsWith("/api/users/")) {
      deleteUser(res, pathname);
    } else {
      sendResponse(res, 404, { error: "Endpoint not found" });
    }
    logAllTheUsers();
  }
);

pkg.config();

if (args.includes("--multi")) {
  if (cluster.isPrimary) {
    const numCPUs = availableParallelism();
    const workers: Worker[] = [];

    for (let i = 0; i < numCPUs; i++) {
      const worker = cluster.fork({
        workerPort: PORT + i,
        workerStartPort: PORT + numCPUs,
      });
      workers.push(worker);
    }

    workers.forEach((worker) => {
      worker.on("message", (message) => {
        for (const otherWorker of workers) {
          if (otherWorker !== worker) {
            otherWorker.send(message);
          }
        }
      });
    });

    let currentWorkerIndex = 0;

    server.on("request", (req, res) => {
      const worker = workers[currentWorkerIndex];
      worker.send({ event: "request", req, res });
      currentWorkerIndex = (currentWorkerIndex + 1) % numCPUs;
    });

    server.listen(PORT, () => {
      console.log(`Master server running on port ${PORT}`);
    });
  } else {
    process.on("message", ({ event, req, res }) => {
      if (event === "request") {
        server.emit("request", req, res);
      }
    });

    const workerStartPort = process.env.WORKERSTARTPORT || PORT;
    const workerPort =
      Number(workerStartPort) + (cluster.worker ? cluster.worker.id : 0) - 1;
    server.listen(workerPort, () => {
      console.log(`Worker server running on port ${workerPort}`);
    });
  }
} else {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default server;
