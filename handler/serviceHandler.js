'use strict';


let config = require('../config/config');
let dbConnection = require('../db/db');
let utility = require('../utility/utility');

class ServiceHandler {
    constructor() {
    }

    rootRouteHandler(request, response) {
        response.write("Rule Engine WebServices");
        response.end();
    }


    createProjectHandler(request, response) {
        let startTime = new Date().getTime();
        let params = request.body;
        let requiredKeys = ['projectName', 'formsSubmitted', 'total', 'description', 'count', 'symbol', 'users'];
        if (params && utility.checkObjectPrototype(requiredKeys, params)) {
            params = utility.escapeStringUtil(params);
            let sql = `insert into transervedb.projects(project_name, forms_submitted, total, 
                last_updated, description, count, symbol) 
                values(${params.projectName}, ${params.formsSubmitted}, ${params.total}, 
                CURRENT_TIMESTAMP, ${params.description}, ${params.count}, ${params.symbol});`;
            dbConnection.query(sql, function (err, rows, fields) {
                if (err) {
                    let error = {
                        code: errorCodes.internalError,
                        message: errorMessages.internalError
                    };
                    let interval = new Date().getTime() - startTime;
                    error.time = interval;
                    response.status(httpCodes.internalError).send(error);
                } else {
                    if (rows && rows.insertId && params.users) {
                        sql = `insert into project_user(project_id, user_id) values`;
                        for (let i = 0; i < params.users.length; i++) {
                            sql += `(${rows.insertId},${params.users[i].id}),`;
                        }
                        sql = sql.slice(0, sql.length - 1);
                        if (params.forms) {
                            sql += `;insert into project_form(project_id, form_id) values`
                            for (let i = 0; i < params.users.length; i++) {
                                sql += `(${rows.insertId},${params.forms[i].formId}),`;
                            }
                            sql = sql.slice(0, sql.length - 1);
                        }
                        dbConnection.query(sql, function (err, rows, fields) {
                            if (err) {
                                let error = {
                                    code: errorCodes.internalError,
                                    message: errorMessages.internalError
                                };
                                let interval = new Date().getTime() - startTime;
                                error.time = interval;
                                response.status(httpCodes.internalError).send(error);
                            } else {
                                let data = {
                                    result: rows,
                                    success: true
                                };

                                let interval = new Date().getTime() - startTime;
                                data.time = interval;
                                response.status(httpCodes.ok).send(data);
                            }
                        });
                    } else {
                        let data = {
                            result: rows,
                            success: true
                        };

                        let interval = new Date().getTime() - startTime;
                        data.time = interval;
                        response.status(httpCodes.ok).send(data);
                    }
                }
            });
        } else {
            let result = {
                code: errorCodes.invalidParams,
                message: errorMessages.invalidParams
            };
            let interval = new Date().getTime() - startTime;
            result.time = interval;
            response.status(httpCodes.invalidParams).send(result);
        }
    }

    getProjectListHandler(request, response) {
        let startTime = new Date().getTime();
        let sql = `select id as projectId, project_name as projectName, forms_submitted as formsSubmitted, total, last_updated as lastUpdated, 
            created_on as createdOn, description, count, symbol from transervedb.projects`;
        dbConnection.query(sql, function (err, rows, fields) {
            if (err) {
                let error = {
                    code: errorCodes.internalError,
                    message: errorMessages.internalError
                };
                let interval = new Date().getTime() - startTime;
                error.time = interval;
                response.status(httpCodes.internalError).send(error);
            } else {
                let data = {
                    result: rows,
                    success: true
                };
                let interval = new Date().getTime() - startTime;
                data.time = interval;
                response.status(httpCodes.ok).send(data);
            }
        });
    }

    getProjectsWithUserListHandler(request, response) {
        let startTime = new Date().getTime();
        let sql = `select p.id as projectId, p.project_name as projectName, p.forms_submitted as formsSubmitted, p.total, p.last_updated as lastUpdated, 
            p.created_on as createdOn, p.description, p.count, u.id as userId, u.first_name as firstName, u.last_name as lastName, u.age, u.profile_pic as imageURL from transervedb.projects p 
            LEFT JOIN transervedb.project_user pu ON p.id = pu.project_id
            JOIN transervedb.users u ON u.id = pu.user_id order by p.id`;
        dbConnection.query(sql, function (err, rows, fields) {
            if (err) {
                let error = {
                    code: errorCodes.internalError,
                    message: errorMessages.internalError
                };
                let interval = new Date().getTime() - startTime;
                error.time = interval;
                response.status(httpCodes.internalError).send(error);
            } else {
                let data = {
                    result: rows,
                    success: true
                };
                let interval = new Date().getTime() - startTime;
                data.time = interval;
                response.status(httpCodes.ok).send(data);
            }
        });
    }

    getProjectByIdHandler(request, response) {
        let startTime = new Date().getTime();
        let params = request.params;
        if (params && params.projectId) {
            params.projectId = dbConnection.getEscapedString(params.projectId);
            let sql = `select id as projectId, forms_submitted as formsSubmitted, total, last_updated as lastUpdated, 
            created_on as createdOn, description, count, symbol from transervedb.projects where id=${params.projectId}`;
            dbConnection.query(sql, function (err, rows, fields) {
                if (err) {
                    let error = {
                        code: errorCodes.internalError,
                        message: errorMessages.internalError
                    };
                    let interval = new Date().getTime() - startTime;
                    error.time = interval;
                    response.status(httpCodes.internalError).send(error);
                } else {
                    let data = {
                        result: rows,
                        success: true
                    };
                    let interval = new Date().getTime() - startTime;
                    data.time = interval;
                    response.status(httpCodes.ok).send(data);
                }
            });
        } else {
            let result = {
                code: errorCodes.invalidParams,
                message: errorMessages.invalidParams
            };
            let interval = new Date().getTime() - startTime;
            result.time = interval;
            response.status(httpCodes.invalidParams).send(result);
        }
    }

    getAllUsersHandler(request, response) {
        let startTime = new Date().getTime();
        let sql = `select u.id, u.first_name as firstName, u.last_name as lastName, u.age, 
                u.profile_pic as imageURL from transervedb.users u`;
        dbConnection.query(sql, function (err, rows, fields) {
            if (err) {
                let error = {
                    code: errorCodes.internalError,
                    message: errorMessages.internalError
                };
                let interval = new Date().getTime() - startTime;
                error.time = interval;
                response.status(httpCodes.internalError).send(error);
            } else {
                let data = {
                    result: rows,
                    success: true
                };
                let interval = new Date().getTime() - startTime;
                data.time = interval;
                response.status(httpCodes.ok).send(data);
            }
        });

    }

    getAllFormsHandler(request, response) {
        let startTime = new Date().getTime();
        let sql = `SELECT id as formId, name as formName, shape, updated_on as updatedOn 
                FROM transervedb.forms`;
        dbConnection.query(sql, function (err, rows, fields) {
            if (err) {
                let error = {
                    code: errorCodes.internalError,
                    message: errorMessages.internalError
                };
                let interval = new Date().getTime() - startTime;
                error.time = interval;
                response.status(httpCodes.internalError).send(error);
            } else {
                let data = {
                    result: rows,
                    success: true
                };
                let interval = new Date().getTime() - startTime;
                data.time = interval;
                response.status(httpCodes.ok).send(data);
            }
        });
    }

    getProjectFormsHandler(request, response) {
        let startTime = new Date().getTime();
        let params = request.params;
        let sql = `SELECT f.id as formId, f.name as formName, f.shape, f.updated_on as updatedOn FROM transervedb.forms f
        left join project_form pf on pf.form_id=f.id where pf.project_id=${params.projectId}`;
        dbConnection.query(sql, function (err, rows, fields) {
            if (err) {
                let error = {
                    code: errorCodes.internalError,
                    message: errorMessages.internalError
                };
                let interval = new Date().getTime() - startTime;
                error.time = interval;
                response.status(httpCodes.internalError).send(error);
            } else {
                let data = {
                    result: rows,
                    success: true
                };
                let interval = new Date().getTime() - startTime;
                data.time = interval;
                response.status(httpCodes.ok).send(data);
            }
        });
    }


}

const errorMessages = {
    invalidParams: 'Invalid Parameters',
    internalError: "Internal Error"
};

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