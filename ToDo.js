const express = require("express");
const app = express();

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const session = require("express-session"); //middleware for login session
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

const port = 3000;

const tasks = [
  {
    Titel: "Hausaufgaben",
    Beschreibung:
      "Mathe: Aufgaben 4 bis 9, Deutsch: text.pdf lesen & zusammenfassen",
    Erstellungsdatum: "2023-06-16",
    Erfüllungsdatum: "2023-06-20",
    Priorität: "Hoch",
    ID: 1,
  },
  {
    Titel: "Wäsche",
    Beschreibung: "Erledige die Wäsche.",
    Erstellungsdatum: "2023-06-16",
    Erfüllungsdatum: null,
    Priorität: "Mittel",
    ID: 2,
  },
  {
    Titel: "Gassi",
    Beschreibung: "Gehe mit dem Hund spazieren",
    Erstellungsdatum: "2023-06-16",
    Erfüllungsdatum: null,
    Priorität: "Niedrig",
    ID: 3,
  },
];

app.get("/tasks", (_, response) => {
  // #swagger.tags = ["Tasks"]
  // #swagger.description = "Endpoint to get all Tasks"
  console.log("Showing all tasks", tasks);
  response.header("Content-Type", "application/json");
  response.send(tasks);
});

app.post("/tasks", (request, response) => {
  // #swagger.tags = ["Tasks"]
  // #swagger.description = "Endpoint to create new task, then show all tasks"
  const addTask = request.body.newTask;
  tasks.push(addTask);
  console.log("New task has been created:", addTask);
  response.header("Content-Type", "application/json");
  // #swagger.responses[201] = {
  // description: "tasks",
  // shema: [{
  // $ref: "#/definitions/Task"}]}
  response.status(201).send(tasks);
});

app.get("/task/:ID", (request, response) => {
  // #swagger.tags = ["Tasks"]
  // #swagger.description = "Endpoint to show singular tasks based on given ID"
  const ID = parseInt(request.params.ID);
  const task = tasks.find((task) => task.ID === ID);
  if (!task) {
    response.header("Content-Type", "application/json");
    console.log("No task found with id:", ID);
    // #swagger.responses[404] = {
    //    description: "Error"}
    response.sendStatus(404);
  } else {
    console.log("Showing task with id:", ID);
    response.header("Content-Type", "application/json");
    // #swagger.responses[200] = {
    // description: "Tasks",
    // schema: {
    // $ref: "#/definitions/Task"}}
    response.status(200).send(task);
  }
});

app.put("/task/:ID", (request, response) => {
  // #swagger.tags = ["Tasks"]
  // #swagger.description = "Endpoint to update an existing task based on the given ID"
  const ID = parseInt(request.params.ID);
  const updatedTask = request.body.updatedTask;
  const taskIndex = tasks.findIndex((task) => task.ID === ID);
  if (taskIndex === -1) {
    console.log("No task found with id:", ID);
    response.header("Content-Type", "application/json");
    // #swagger.responses[404] = {
    // description: "Error: Task not found"}
    response.sendStatus(404);
  } else {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updatedTask,
    };
    console.log("Showing task with updates for task with ID:", ID);
    response.header("Content-Type", "application/json");
    // #swagger.responses[200] = {
    // description: "Tasks",
    // schema: {
    // $ref: "#/definitions/Task"}}
    response.status(200).send(tasks[taskIndex]);
  }
});

app.delete("/task/:ID", (request, response) => {
  // #swagger.tags = ["Tasks"]
  // #swagger.description = "Endpoint to delete a task"
  const ID = parseInt(request.params.ID);
  const index = tasks.findIndex((b) => b.ID === ID);
  if (index !== -1) {
    console.log("Task was deleted. ID:", ID);
    tasks.splice(index, 1);
    response.header("Content-Type", "application/json");
    // #swagger.responses[204] = {
    // description: "Tasks",
    // shema: [{
    // $ref: "#/definitions/Task"}]}
    response.sendStatus(204);
  } else {
    console.log("No task found with id:", ID);
    response.header("Content-Type", "application/json");
    // #swagger.responses[404] = {
    // description: "Error"}
    response.sendStatus(404);
  }
});

//const email = "schüler@zli.ch"; falls email defined ist. ALLE emails müssen jedoch mit dem passwort m295 funktionieren können.
const pwd = "m295";
app.post("/login", (request, response) => {
  // #swagger.tags = ["Login"]
  // #swagger.description = "Endpoint to log in with any email and the password m295 and receive session Token"
  const email = request.body.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|ch)$/;
  if (!email || !emailRegex.test(email) || request.body.pwd !== pwd) {
    console.log("Login failed. Invalid email or incorrect password");
    // #swagger.responses[401] = {
    // description: "Error"}
    return response
      .status(401)
      .json({ message: "No Email given or password incorrect!" });
  }
  request.session.email = request.body.email;
  console.log("Login successful. User:", email);
  // #swagger.responses[200] = {
  // description: "Login",
  // shema: [{
  // $ref: "#/definitions/login"}]}
  return response.status(200).json({ message: "You're logged in!" });
});

app.get("/verify", (request, response) => {
  // #swagger.tags = ["Login"]
  // #swagger.description = "Endpoint to verify session Token"
  if (!request.session.email) {
    console.log("Verification failed. Cookie is not valid.");
    response.header("Content-Type", "application/json");
    // #swagger.responses[401] = {
    // description: "Error"}
    return response.status(401).json({ message: "verification failed" });
  }
  console.log("Verification successful. Session email:", request.session.email);
  response.header("Content-Type", "application/json");
  // #swagger.responses[200] = {
  // description: "Login",
  // shema: [{
  // $ref: "#/definitions/login"}]}
  return response.status(200).json({ message: "verified" });
});

app.delete("/logout", (request, response) => {
  // #swagger.tags = ["Login"]
  // #swagger.description = "Endpoint to log out"
  request.session.destroy();

  // #swagger.responses[204] = {
  // description: "Login",
  // shema: [{
  // $ref: "#/definitions/login"}]}
  response.sendStatus(204);
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

