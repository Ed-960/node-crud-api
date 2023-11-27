import { v4 as uuidv4 } from "uuid";
import { users } from "../data/data";
import { IncomingMessage, ServerResponse } from "http";

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export const sendResponse = (
  res: ServerResponse,
  statusCode: number,
  data: Record<string, any> | null
) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

export const getUserById = (res: ServerResponse, pathname: string) => {
  console.log("pathname", pathname);
  const match = pathname.match(/\/api\/users\/([^/]+)\/?$/);
  const userId = match ? match[1] : null;
  const user = users.find((u) => u.id === userId);

  if (!userId || !user) {
    sendResponse(res, 404, { error: "User not found" });
  } else {
    sendResponse(res, 200, user);
  }
};

export const createUser = (req: IncomingMessage, res: ServerResponse) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const { username, age, hobbies } = JSON.parse(body);
      if (!username || !age) {
        sendResponse(res, 400, {
          error: "Username and age are required fields",
        });
        return;
      }

      const newUser: User = {
        id: uuidv4(),
        username,
        age,
        hobbies: hobbies || [],
      };

      users.push(newUser);
      sendResponse(res, 201, newUser);
    } catch (e) {
      sendResponse(res, 400, { error: "Invalid request body" });
    }
  });
};

export const updateUser = (
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string
) => {
  const match = pathname.match(/\/api\/users\/([^/]+)\/?$/);
  const userId = match ? match[1] : null;

  const userIndex = users.findIndex((u) => u.id === userId);

  if (!userId || userIndex === -1) {
    sendResponse(res, 404, { error: "User not found" });
  } else {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    const handleEnd = () => {
      try {
        const { username, age, hobbies } = JSON.parse(body);

        if (!username || !age) {
          sendResponse(res, 400, {
            error: "Username and age are required fields",
          });
          return;
        }

        const updatedUser = {
          id: userId,
          username,
          age,
          hobbies: hobbies || [],
        };

        users[userIndex] = updatedUser;
        sendResponse(res, 200, updatedUser);
      } catch (err) {
        sendResponse(res, 400, { error: "Invalid request body" });
      }
    };

    req.on("end", handleEnd);
  }
};

export const deleteUser = (res: ServerResponse, pathname: string) => {
  const match = pathname.match(/\/api\/users\/([^/]+)\/?$/);
  const userId = match ? match[1] : null;
  const userIndex = users.findIndex((u) => u.id === userId);

  if (!userId || userIndex === -1) {
    sendResponse(res, 404, { error: "User not found" });
  } else {
    users.splice(userIndex, 1);
    sendResponse(res, 204, null);
  }
};

export const logAllTheUsers = () => {
  new Promise<void>((resolve) => {
    setImmediate(() => {
      console.log("Users after request:");
      console.table(users);
      resolve();
    });
  });
};