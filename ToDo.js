const express = require("express");
const app = express();

// Swagger
//const swaggerUi = require("swagger-ui-express");
//const swaggerFile = require("./swagger_output.json");
//app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

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
      "Titel": "Hausaufgaben",
      "Beschreibung": "Mathe: Aufgaben 4 bis 9, Deutsch: text.pdf lesen & zusammenfassen",
      "Erstellungsdatum": "2023-06-16",
      "Erfüllungsdatum": "2023-06-20",
      "Priorität": "Hoch",
      "ID": 1
    },
    {
      "Titel": "Wäsche",
      "Beschreibung": "Erledige die Wäsche.",
      "Erstellungsdatum": "2023-06-16",
      "Erfüllungsdatum": null,
      "Priorität": "Mittel",
      "ID": 2
    },
    {
      "Titel": "Gassi",
      "Beschreibung": "Gehe mit dem Hund spazieren",
      "Erstellungsdatum": "2023-06-16",
      "Erfüllungsdatum": null,
      "Priorität": "Niedrig",
      "ID": 3
    }
  ]
  

app.get("/tasks", (_, response) => {
    // #swagger.tags = ["Tasks"]
    // #swagger.description = "Endpoint to get Title of all Tasks"
    response.send(tasks);
});


app.post("/tasks", (request, response) => {
  // #swagger.tags = ["Tasks"]
  // #swagger.description = "Endpoint to create new task, then show all tasks"
  const addTask = request.body.newTask;
  tasks.push(addTask);
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
    // #swagger.responses[404] = {
    //    description: "Error"}
    response.sendStatus(404);
  } else {
  response.status(200).send(task);
  }
});

app.put(`/task/:ID`, (request, response) => {
  // #swagger.tags = ["Tasks"]
  // #swagger.description = "Endpoint to make changes to an existing task, then return task"
  const ID = parseInt(request.params.ID);
  const Index = tasks.findIndex((task) => task.ID === ID);
  const updatedTask = tasks.findIndex((b) => b.ID === ID);
  if (Index === -1) {
    // #swagger.responses[404] = {
    // description: "Error"}
    if (taskIndex === -1) {
    // #swagger.responses[404] = {
    // description: "Error"}
      response.sendStatus(404);
    } else {
    
    // mit ChatGPT korrigierte Zeile
    tasks[Index] = {
      ...tasks[Index],
      ...updatedTask
    };
      response.status(200).send(tasks[taskIndex]);
    }
  }
});

app.delete("/task/:ID", (request, response) => {
  // #swagger.tags = ["Tasks"]
  // #swagger.description = "Endpoint to delete a task"
  const ID = parseInt(request.params.ID);
  const index = tasks.findIndex((b) => b.ID === ID);
  if (index !== -1) {
    tasks.splice(index, 1);
  // #swagger.responses[204] = {
  // description: "Tasks",
  // shema: [{
  // $ref: "#/definitions/Task"}]}
    response.sendStatus(204);
  } else {
     // Task not found
  // #swagger.responses[404] = {
  // description: "Error: Task not found"}
    response.sendStatus(404);
  }
});


//const email = "schüler@zli.ch"; falls email defined ist. ALLE emails müssen jedoch mit dem passwort m295 funktionieren können.
const pwd = "m295";
app.post("/login", (request, response) => {
// #swagger.tags = ["Login"]
// #swagger.description = "Endpoint to log in with any email and the password m295"
  const email = request.body.email;
  if (!email || request.body.pwd !== pwd) {
    return response.status(401).send("Email or password incorrect");
  }
  request.session.email = request.body.email; 
  response.status(200).send("Your logged in");
});

app.get("/verify", (request, response) => {
  if (!request.session.email) {
    return response.status(401).send("failed");
  }
  response.status(200).send("verified");
});






app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });