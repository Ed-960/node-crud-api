import { expect } from "chai";
import request from "supertest";
import server from "../index";
import { users } from "../data/data";

describe("CRUD API Tests", () => {
  it("should get all users wuth a GET request /api/users", async () => {
    const response = await request(server).get("/api/users");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });

  it("should get an existing user by userId with a GET request to /api/users/{userId}", async () => {
    const existingUserId = "uuid-1";
    const response = await request(server).get(`/api/users/${existingUserId}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("id", existingUserId);
  });

  it("should create a new user with a POST request to /api/users", async () => {
    const newUser = {
      username: "John Doe",
      age: 25,
      hobbies: ["Reading", "Coding"],
    };

    const response = await request(server).post("/api/users").send(newUser);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("id");
  });

  it("should update an existing user with a PUT request to /api/users/{userId}", async () => {
    const existingUserId = "uuid-1";
    const updateUser = {
      username: "Updated User",
      age: 35,
      hobbies: ["Traveling, Computer"],
    };

    const response = await request(server)
      .put(`/api/users/${existingUserId}`)
      .send(updateUser);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ id: existingUserId, ...updateUser });
  });

  it("should delete an existing user with a DELETE request to /api/users/{userId}", async () => {
    const existingUserId = "uuid-1";
    const response = await request(server).delete(
      `/api/users/${existingUserId}`
    );
    expect(response.status).to.equal(204);

    const user = users.find((u) => u.id === existingUserId);
    expect(user).to.be.undefined;
  });
});

after(() => {
  server.close();
});
