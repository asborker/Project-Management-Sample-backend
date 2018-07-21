'use strict';


let config = require('../config/config');
let dbConnection = require('../db/db');

class ServiceHandler {
    constructor() {
    }

    rootRouteHandler(request, response) {
        response.write("Rule Engine WebServices");
        response.end();
    }


    createProjectHandler(request, response) {
        
    }


}

const errorCodes = {
    internalError: -32603,
    invalidParams: -32602,
    invalidCredentials: 401
};

const httpCodes = {
    createSuccess: 201,
    partialSuccess: 207,
    ok: 200,
    internalError: 500,
    invalidParams: 422,
    conflict: 409,
    unauthorized: 401
};


module.exports = new ServiceHandler();