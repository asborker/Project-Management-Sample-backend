
var express = require('express');
var router = express.Router();
let config = require('../config/config');
let serviceHandler = require('../handler/serviceHandler');

let rootRouteHandler = function(request, response) {
    serviceHandler.rootRouteHandler(request, response);
  };
  
  let getProjectListHandler = function(request, response) {
    serviceHandler.getProjectListHandler(request, response);
  };
  
  let getProjectByIdHandler = function(request, response) {
    serviceHandler.getProjectByIdHandler(request, response);
  };

  let createProjectHandler = function(request, response) {
    serviceHandler.createProjectHandler(request, response);
  };

  let getAllUsersHandler = function(request, response) {
    serviceHandler.getAllUsersHandler(request, response);
  };

  let getAllFormsHandler = function(request, response) {
    serviceHandler.getAllFormsHandler(request, response);
  };

  let getProjectsWithUserListHandler = function(request, response) {
    serviceHandler.getProjectsWithUserListHandler(request, response);
  };

  let getProjectFormsHandler = function(request, response) {
    serviceHandler.getProjectFormsHandler(request, response);
  };
  
  router.get(config.app.routes.rootRoute, rootRouteHandler);
  router.get(config.app.routes.getProjectList, getProjectListHandler);
  router.get(config.app.routes.getAllProjectData, getProjectsWithUserListHandler);
  router.get(config.app.routes.getProjectById + '/:projectId', getProjectByIdHandler);
  router.get(config.app.routes.getAllUsers, getAllUsersHandler);
  router.get(config.app.routes.getAllForms, getAllFormsHandler);
  router.get(config.app.routes.getProjectForms + '/:projectId', getProjectFormsHandler);

  router.post(config.app.routes.createProject, createProjectHandler);

  module.exports = router;