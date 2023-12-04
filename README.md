# 🚀 Welcome to your new awesome project!
## CRUD API Implementation - README

### Assignment Overview

This is a simple CRUD API using an in-memory database. The API will support operations such as creating, reading, updating, and deleting user records. Below are the technical requirements and implementation details for the assignment.

### Technical Requirements

- **Language**: JavaScript or TypeScript
- **Node.js Version**: 18 LTS
- **Allowed Dependencies**: nodemon, dotenv, cross-env, typescript, ts-node, ts-node-dev, eslint, webpack-cli, webpack, prettier, uuid, @types/*, testing libraries
- **Asynchronous API**: Prefer asynchronous operations where possible

### Implementation Details

#### API Endpoints

1. **GET api/users**
   - Returns all user records
   - Response: Status code 200 and all user records

2. **GET api/users/{userId}**
   - Returns the user record with id === userId if it exists
   - Response: 
     - Status code 200 and user record if userId is valid
     - Status code 400 if userId is invalid (not uuid)
     - Status code 404 if record with id === userId doesn't exist

3. **POST api/users**
   - Creates a new user record and stores it in the database
   - Response:
     - Status code 201 and newly created record
     - Status code 400 if request body does not contain required fields

4. **PUT api/users/{userId}**
   - Updates an existing user record
   - Response:
     - Status code 200 and updated record
     - Status code 400 if userId is invalid (not uuid)
     - Status code 404 if record with id === userId doesn't exist

5. **DELETE api/users/{userId}**
   - Deletes an existing user record from the database
   - Response:
     - Status code 204 if the record is found and deleted
     - Status code 400 if userId is invalid (not uuid)
     - Status code 404 if record with id === userId doesn't exist

#### User Object Properties

- `id`: Unique identifier (string, uuid) generated on the server side
- `username`: User's name (string, required)
- `age`: User's age (number, required)
- `hobbies`: User's hobbies (array of strings or empty array, required)

#### Additional Requirements

- Handle requests to non-existing endpoints (status code 404 and corresponding message)
- Handle errors on the server side during request processing (status code 500 and corresponding message)
- Store the port value in a `.env` file
- Two modes of running the application: development (using nodemon or ts-node-dev) and production (with a build process and bundled file)
- Implement at least 3 test scenarios for the API operations
- Implement horizontal scaling for the application using the Node.js Cluster API and a load balancer with Round-robin algorithm

### Running the Application

- Development Mode: `npm run start:dev`
- Production Mode: `npm run start:prod`
- Horizontal Scaling: `npm run start:multi`
- Build Project: `npm run build`

### Test Scenarios

1. Get all records with a GET api/users request (expecting an empty array)
2. Create a new object with a POST api/users request (expecting a response containing the newly created record)
3. Get the created record by its id with a GET api/users/{userId} request (expecting the created record)
4. Update the created record with a PUT api/users/{userId} request (expecting a response containing an updated object with the same id)
5. Delete the created object by id with a DELETE api/users/{userId} request (expecting confirmation of successful deletion)
6. Try to get a deleted object by id with a GET api/users/{userId} request (expecting a 404 status code)
