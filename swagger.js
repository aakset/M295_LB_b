const swagger = require("swagger-autogen")();
const outputFile = "./swagger_output.json";
const endpointFile = ["./ToDo.js"];

const doc = {
  info: {
    title: "To-do list API",
    description: "Documentation for the to-do list API",
    version: "1.0.0",
  },
  host: "localhost:3000", 
  basePath: "/",
  schemes: ["http"], 
  consumes: ["application/json"],
  produces: ["application/json"], 
  tasks:  [
    {
        name: "Tasks",
        description: "Tasks in the to-do list"
    },
    {
        name: "Login",
        description: "Login, verification and logout data"
    }
],
definitions: {
    task: 
    {
        "Titel": "Hausaufgaben",
        "Beschreibung": "Mathe: Aufgaben 4 bis 9, Deutsch: text.pdf lesen & zusammenfassen",
        "Erstellungsdatum": "2023-06-16",
        "Erfüllungsdatum": "2023-06-20",
        "Priorität": "Hoch",
        "ID": 1
    }
}
};


swagger(outputFile, endpointFile, doc);