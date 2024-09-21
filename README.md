# Megaverse-aac

<p align="center" style="text-align: center; border: 5px solid #4CAF50; border-radius: 15px; display: inline-block; padding: 10px;">
  <img src="https://img.freepik.com/premium-vector/flat-style-abstract-space-background-vector-isolated_1332465-5445.jpg?semt=ais_hybrid" alt="Megaverse" width="400px">
</p>

Welcome to the **Megaverse-aac** project! This application allows you to create a customizable megaverse through a
pattern matrix. It processes the input pattern to determine whether to insert a polyanet, soloon, or cometh. If an
existing element is not present, it will delete any previously existing elements in that space, effectively leaving it
as empty space. In essence, this API empowers you to construct any type of universe while managing and removing previous
configurations seamlessly.


---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Endpoints](#endpoints)
- [Architecture](#architecture)
- [Running the Project](#running-the-project)
- [Unit Testing](#tests)
- [License](#license)

---

## Features

- **Asynchronous Job Processing**: Utilize Bull to queue jobs for building the megaverse, allowing for efficient
  handling of long-running tasks.
- **Dependency Injection**: Implement Inversify for managing dependencies, making the codebase cleaner and more
  maintainable.
- **Hexagonal Architecture**: Isolate the application’s core business logic from infrastructure concerns, making it
  adaptable to changes.
- **RESTful API**: Expose endpoints to build the megaverse and check the status of jobs.
- **Unit Tests**: Comprehensive unit testing using Jest for the core business logic.

---

## Technologies Used

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript**: A superset of JavaScript that compiles to clean JavaScript output.
- **Monads**: A design pattern used for handling side effects in functional programming. In this project, monads are
  employed to manage operations and results, allowing for clean and predictable error handling and chaining of
  operations without deeply nested callbacks.
- **Inversify**: A powerful and lightweight inversion of control (IoC) container for JavaScript and TypeScript apps.
- **Bull**: A robust queue package for handling jobs and messages in Node.js.
- **Jest**: A delightful JavaScript testing framework with a focus on simplicity.
- **Docker**: Containerization platform to streamline application deployment.
- **Redis**: In-memory data structure store, used as a database, cache, and message broker.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for development and testing)

### Cloning the Repository

```bash
git clone https://github.com/yourusername/megaverse-aac.git
cd megaverse-aac
```

### Creating the Docker Image

You can build the Docker image using the following command:

```bash
docker build -t megaverse-aac:0.0.1 .
```

### Running the Project

To start the application, run:

```bash
docker-compose up
```

This command will start both the Redis service and the Megaverse application.

---

## Endpoints

### 1. Build Megaverse

**POST** `/megaverse/build`

- **Request Body**:
  ```json
  {
    "megaverse": [
      ["SPACE", "RIGHT_COMETH", "SPACE"],
      ["SPACE", "SPACE", "WHITE_SOLOON"],
      ["SPACE", "SPACE", "POLYANET"]
    ]
  }
  ```

- **Response**:
    - `202 Accepted`: Returns job ID for tracking.

### 2. Check Job Status

**GET** `/megaverse/job/:id`

- **Parameters**: `id` (the job ID)

- **Response**:
    - `200 OK`: Returns job details including status, progress, and any error messages if applicable.
    - `404 Not Found`: If the job does not exist.

---

## Architecture

The Megaverse-aac application follows a **hexagonal architecture**, ensuring a clean separation between different
layers:

- **Application Layer**: Handles API requests and responses.
- **Core Layer**: Contains the business logic, orchestrating actions based on user inputs.
- **Infrastructure Layer**: Adapters for external services (e.g., databases, queues).

---

## Tests

To run the unit tests, use the following command:

```bash
npm test
```

This command will execute all tests written with Jest, providing feedback on the functionality of the core business
logic.

---

## License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/licenses/MIT) for details.

---
