import http from "http";
import pkg from "dotenv";
import { users } from "./data/data.js";
import {
  createUser,
  deleteUser,
  getUserById,
  logAllTheUsers,
  sendResponse,
  updateUser,
} from "./services/services.js";
const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

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
});

pkg.config();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
