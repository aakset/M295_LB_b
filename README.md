# Todo List Backend

This is the backend code for a Todo List application. It provides APIs to manage tasks and user authentication.

## Development Environment

To set up and run the project, follow the instructions below:

### Setup

1. Clone the repository:

   ``git clone https://github.com/your-username/todo-list-backend.git``

2. Install dependencies:
``npm install``

### Runtime
The project requires the following dependencies:

-   Node.js
-   Express.js
-   Express Session
-   Swagger UI Express

Make sure you have Node.js installed on your system. 

### Configuration 
The project uses a session secret key for Express session. You can update it in the ``app.use(session())`` configuration within ``index.js`` file.

### Run the project
Run the project using this command:
``npm start``

### Endpoints
- GET /tasks - Retrieves all tasks.
- POST /tasks - Creates a new task.
- GET /task/:ID - Retrieves a specific task by its ID.
- PUT /task/:ID - Updates an existing task by its ID.
- DELETE /task/:ID - Deletes a task by its ID.
- POST /login - Logs in the user and generates a session token.
- GET /verify - Verifies the session token.
- DELETE /logout - Logs out the user and destroys the session.

### Author / Contact 
- Email: aakash.sethi@lernende.bbw.ch
- https://github.com/aakset/
