'use strict';

/**
 * App Config
 */
module.exports = {
    app: {
        app_host: "localhost",
        port: 3000,
        routes: {
            rootRoute: '/.*',
            createProject: '/api/addProject',
            getProject: '/api/getProject',
            getProjectList: '/api/getProjectList',
        },
        requestTimeout: 600 * 1000 //10 minutes
    },
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        passcode: 'root', //root@135
        db: 'testDb',
        reconnectDelay: 5000
    }
}