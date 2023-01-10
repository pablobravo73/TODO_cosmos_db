const CosmosClient = require('@azure/cosmos').CosmosClient;
const config = require('./config');
const Tasklist = require('./routes/tasklist');
const Task = require('./models/task');

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const TaskList = require('./routes/tasklist');

const app = express();

// Mostrar los views de JADE como HTML con EXPRESS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cosmosClient = new CosmosClient({
  enspoint: config.host,
  key: config.authKey,
});

const taskObjecto = new Task(cosmosClient, config.databaseID, config.containerID);

const taskList = new TaskList(taskObjeto);

taskObjecto
  .init(err=> {
    console.log(err);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  })

  app.get("/", (req, res, next) => taskList.showTasks(req,res).catch(next));

  app.post("/agrgar", (req,res,next)=>taskList.addTask(req,res).catch(next));

  app.post("/completar", (req,res,next)=>taskList.completeTask(req,res).catch(next));

  app.set('view engine', 'jade');

  // Manejar un 404
  app.use(function(req,res,next){
    const error = new Error('No encontrado');
    err.status = 404;
    next(err);
  });

  module.exports = app;
