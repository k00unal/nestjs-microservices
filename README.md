# Microservices with API Gateway with Two services

This project demonstrates the implementation of microservices architecture using API Gateway .

## Prerequisites

- Docker
- Docker Compose

## Services

### API Gateway

- **Description**: Acts as the API entry point and router, coordinating requests between services.
- **Location**: `services/api-gateway`
- **Technologies**: NestJS, NATS, Node.js

### Service A

- **Description**: Represents a microservice handling user-related operations.
- **Location**: `services/service-a`
- **Technologies**: Node.js, NATS, Typescript

### Service B

- **Description**: Another microservice responsible for managing data.
- **Location**: `services/service-b`
- **Technologies**: Node.js, NATS, Typescript

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/microservices-nats.git
   cd microservices-nats
   ```

2. Start the microservices:

   ```bash
   docker-compose up
   ```

3. The API Gateway will be accessible at `http://localhost:3002`. You can test the routes defined in the controllers.

## Endpoints

### Service A

- `POST /service-a/users`: Create a new user in Service A.

### Service B

- `POST /service-b/data`: Create new data in Service B.
- `GET /service-b/data`: Get all data in Service B.

## Logging

Logs are written to the console and can be helpful for debugging.
<pre>

http://localhost:3002/service-a/users

# Post to create new user
curl -X POST <http://localhost:3002/service-a/users> \
-H "Content-Type: application/json" \
-d '{
  "name": "Test User",
  "email": "<test@example.com>",
  "age": 25
}'

</pre>
